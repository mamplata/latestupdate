import Dialog from "../management/components/helpers/Dialog.js";
import {
    getCrop,
    getCropName,
    getTotalAreaPlanted,
    getCropVarieties,
    getProduction,
    getPrice,
    getPest,
    getDisease,
    addDownload,
    getRiceProduction,
} from "./fetch.js";
import * as stats from "./statistics.js";
let crops = [];
let varieties = [];
let dataEntry = [];
$(document).ready(function () {
    $("#infoBtn").click(function () {
        let e = `
    <p>Welcome to the Top Crops page. (Maligayang pagdating sa pahina ng Top Crops.) This tool allows you to rank crops based on various performance indicators. (Ang tool na ito ay nagbibigay-daan sa iyo upang ranggo ang mga pananim batay sa iba't ibang mga tagapagpahiwatig ng pagganap.) Follow these instructions to use the tool effectively: (Sundin ang mga tagubiling ito upang magamit ang tool nang epektibo:)</p>

<ol>
  <li><strong>Understand Ranking Criteria:</strong><br>
  (Unawain ang Mga Pamantayan sa Pag-ranggo:) Crops are ranked based on a composite score that includes production volume, price, income, revenue, and pest/disease occurrences etc. (Ang mga pananim ay niraranggo batay sa isang pinagsamang iskor na kinabibilangan ng dami ng produksyon, presyo, kita, kita, at mga insidente ng peste/sakit, atbp.) The formula for calculating the composite score is as follows: (Ang formula para sa pagkalkula ng pinagsamang iskor ay ang mga sumusunod:)</li>
</ol>

<pre>
Composite Score = (Production Volume Score * Weight1) +
                  (Price Score * Weight2) +
                  (Income Score * Weight3) +
                  (Revenue Score * Weight4) -
                  (Pest/Disease Score * Weight5)
                  + ... (additional factors) 
(Pinagsamang Iskor = (Iskor ng Dami ng Produksyon * Timbang1) +
                     (Iskor ng Presyo * Timbang2) +
                     (Iskor ng Kita * Timbang3) +
                     (Iskor ng Kita * Timbang4) -
                     (Iskor ng Peste/Sakit * Timbang5)
                     + ... (karagdagang salik)) 
</pre>

<p>Where the scores for each factor are normalized and weighted according to their importance. (Kung saan ang mga iskor para sa bawat salik ay ginagawang normal at tinutimbang ayon sa kanilang kahalagahan.) The weights (Weight1, Weight2, etc.) are predefined to reflect the relative significance of each factor. (Ang mga timbang (Timbang1, Timbang2, atbp.) ay paunang itinatakda upang ipakita ang kamag-anak na kabuluhan ng bawat salik.) The formula may also include other factors relevant to crop performance. (Ang formula ay maaari ring magsama ng iba pang mga salik na may kaugnayan sa pagganap ng pananim.)</p>

<ol start="2">
  <li><strong>View Rankings:</strong><br>
  (Tingnan ang mga Ranggo:) The crops are displayed in descending order of their composite score. (Ang mga pananim ay ipinapakita sa pababang pagkakasunud-sunod ng kanilang pinagsamang iskor.) Higher scores indicate better overall performance based on the selected criteria. (Mas mataas na iskor ang nagpapahiwatig ng mas mahusay na pangkalahatang pagganap batay sa napiling pamantayan.)</li>

  <li><strong>Access Crop Details:</strong><br>
  (I-access ang Mga Detalye ng Pananim:) Click the 'View' button next to a crop to open a modal with detailed information. (I-click ang button na 'Tingnan' sa tabi ng isang pananim upang buksan ang isang modal na may detalyadong impormasyon.) This modal includes: (Kasama sa modal na ito ang:)
    <ul>
      <li><strong>Crop Image:</strong> A visual representation of the crop variety. (<strong>Larawan ng Pananim:</strong> Isang visual na representasyon ng uri ng pananim.)</li>
      <li><strong>Crop Information:</strong> Details such as maturity period, variety, and other relevant data. (<strong>Impormasyon ng Pananim:</strong> Mga detalye tulad ng panahon ng pagkahinog, uri, at iba pang nauugnay na datos.)</li>
    </ul>
  </li>

  <li><strong>Download Data:</strong><br>
  (I-download ang Datos:) You can download the data in various formats for further analysis: (Maaari mong i-download ang datos sa iba't ibang format para sa karagdagang pagsusuri:)
    <ul>
      <li><strong>CSV:</strong> Download raw data in CSV format for use in spreadsheet applications or data analysis tools. (<strong>CSV:</strong> I-download ang hilaw na datos sa CSV na format para magamit sa mga aplikasyon ng spreadsheet o mga tool sa pagsusuri ng datos.)</li>
      <li><strong>Excel:</strong> Download the data in Excel format, which includes formatted tables for easy review and manipulation. (<strong>Excel:</strong> I-download ang datos sa Excel na format, na naglalaman ng mga naka-format na talahanayan para sa madaling pagsusuri at manipulasyon.)</li>
      <li><strong>PDF:</strong> Download table in PDF format for easy sharing and reporting. (<strong>PDF:</strong> I-download ang talahanayan sa PDF na format para sa madaling pagbabahagi at pag-uulat.)</li>
    </ul>
  </li>
</ol>

<p>This tool is designed to help you rank crops transparently and make informed decisions based on comprehensive performance data. (Ang tool na ito ay dinisenyo upang matulungan kang rangguhin ang mga pananim nang may transparency at gumawa ng mga mahusay na desisyon batay sa komprehensibong datos ng pagganap.)</p>

    `;
        Dialog.showInfoModal(e);
    });
});
async function initializeCrops() {
    try {
        crops = await getCrop();
    } catch (e) {
        console.error("Failed to initialize crops:", e);
    }
}
async function initializeCropVarieties() {
    try {
        varieties = await getCropVarieties();
    } catch (e) {
        console.error("Failed to initialize crop varieties:", e);
    }
}
function calculateOccurrencePercentage(e, t) {
    if (t === 0) {
        return 0;
    }
    return (e / t) * 100;
}
class TopCrops {
    constructor(e, t) {
        this.season = e;
        this.type = t;
        this.initialize();
    }
    async initialize() {
        try {
            const t = await main(this.season, this.type);
            const o = this.generateTopCrops(t);
            this.displayTopCrops(o);
            dataEntry = o;
        } catch (e) {
            console.error("Failed to initialize TopCrops:", e);
        }
    }
    generateTopCrops(e) {
        if (!Array.isArray(e)) {
            console.error("Expected input to be an array");
            return [];
        }
        const t = e.map((e) => {
            const t = e.totalArea > 0 ? e.totalVolume / e.totalArea : 0;
            const o = t;
            if (e.cropType === "Rice") {
                return {
                    cropName: e.cropName,
                    type: e.cropType,
                    compositeScore: o,
                    remarks:
                        `Rice: The total area is <strong>${e.totalArea.toFixed(
                            2
                        )} hectares</strong>. ` +
                        `The total volume is <strong>${e.totalVolume.toFixed(
                            2
                        )}</strong>. ` +
                        `The average yield is <strong>${e.averageYield.toFixed(
                            2
                        )}</strong>.`,
                    totalArea: e.totalArea,
                    totalVolume: e.totalVolume,
                    averageYield: e.averageYield,
                };
            } else {
                return {
                    cropName: e.cropName,
                    type: e.cropType,
                    compositeScore: o,
                    remarks:
                        `The total area is <strong>${e.totalArea.toFixed(
                            2
                        )} hectares</strong>. ` +
                        `Average volume per hectare is <strong>${t.toFixed(
                            2
                        )}</strong>. ` +
                        `The current price stands at <strong>₱${e.price.toFixed(
                            2
                        )}</strong>. ` +
                        `Pest occurrences total <strong>${
                            e.pestOccurrence
                        }</strong>, which is <strong>${calculateOccurrencePercentage(
                            e.pestOccurrence,
                            e.totalPlanted
                        ).toFixed(2)}%</strong> of the total planted area. ` +
                        `Disease occurrences are <strong>${
                            e.diseaseOccurrence
                        }</strong>, representing <strong>${calculateOccurrencePercentage(
                            e.diseaseOccurrence,
                            e.totalPlanted
                        ).toFixed(2)}%</strong> of the total planted area. ` +
                        `Additionally, the average income per hectare is <strong>₱${(
                            e.totalIncome / e.totalArea
                        ).toFixed(2)}</strong>, ` +
                        `while the average profit per hectare amounts to <strong>₱${(
                            e.totalProfit / e.totalArea
                        ).toFixed(2)}</strong>.`,
                    volumeProductionPerHectare: t.toFixed(2),
                    price: e.price.toFixed(2),
                    pestOccurrence: e.pestOccurrence,
                    diseaseOccurrence: e.diseaseOccurrence,
                    totalArea: e.totalArea,
                    totalVolume: e.totalVolume,
                };
            }
        });
        const o = t.sort((e, t) => t.compositeScore - e.compositeScore);
        return o;
    }
    displayTopCrops(e) {
        const t = $("#cropsTable tbody");
        t.empty();
        let o = e.map((n) => {
            const s = crops.find((e) => e.cropName === n.cropName);
            if (!s) {
                return Promise.resolve(`<tr class="text-center">
                <td>${n.cropName}</td>
                <td>${n.type}</td>
                <td>${n.remarks}</td>
                <td>No details available</td>
            </tr>`);
            }
            const t = varieties.filter((e) => e.cropId === s.cropId);
            if (t.length > 0) {
                let e = t.map((t) => {
                    return getTotalAreaPlanted(t.cropId, t.varietyName).then(
                        (e) => {
                            t.totalAreaPlanted = parseFloat(e).toFixed(2);
                            return {
                                varietyName: t.varietyName,
                                totalAreaPlanted: t.totalAreaPlanted,
                                cropImg: t.cropImg,
                                color: t.color,
                                flavor: t.flavor,
                                size: t.size,
                                growthConditions: t.growthConditions,
                                pestDiseaseResistance: t.pestDiseaseResistance,
                                recommendedPractices: t.recommendedPractices,
                            };
                        }
                    );
                });
                return Promise.all(e).then((e) => {
                    const t = s.cropImg || "";
                    const o = `
                    <div class='card m-3 shadow-sm'>
                        <div class='card-header bg-success text-white'>
                            <h5 class='mb-0'>Crop Details</h5>
                        </div>
                        <div class='card-body'>
                            <p class='card-text'><strong>Scientific Name:</strong> <span class='text-primary'>${
                                s.scientificName || "N/A"
                            }</span></p>
                            <p class='card-text'><strong>Unit:</strong> <span class='text-primary'>${
                                s.unit || "N/A"
                            }</span></p>
                            <p class='card-text'><strong>Weight:</strong> <span class='text-primary'>${
                                s.weight || "N/A"
                            }</span></p>
                            <p class='card-text'><strong>Planting Season:</strong> <span class='text-primary'>${
                                s.plantingSeason || "N/A"
                            }</span></p>
                            <p class='card-text'><strong>Growth Duration:</strong> <span class='text-primary'>${
                                s.growthDuration || "N/A"
                            }</span></p>
                        </div>
                    </div>
                `;
                    const r = s.cropName;
                    const a = `<tr class="text-center">
                    <td>${n.cropName}</td>
                    <td>${n.type}</td>
                    <td>${n.remarks}</td>
                    <td>
                        <button class="btn btn-green view-btn" 
                            data-img="${t}" 
                            data-description="${o}" 
                            data-crop="${r}" 
                            data-variety='${JSON.stringify(e)}'>
                            View Information
                        </button>
                    </td>
                </tr>`;
                    return a;
                });
            } else {
                const e = s.cropImg || "";
                const o = `
                <div class='card m-3 shadow-sm'>
                    <div class='card-header bg-success text-white'>
                        <h5 class='mb-0'>Crop Details</h5>
                    </div>
                    <div class='card-body'>
                        <p class='card-text'><strong>Scientific Name:</strong> <span class='text-primary'>${
                            s.scientificName || "N/A"
                        }</span></p>
                        <p class='card-text'><strong>Unit:</strong> <span class='text-primary'>${
                            s.unit || "N/A"
                        }</span></p>
                        <p class='card-text'><strong>Weight:</strong> <span class='text-primary'>${
                            s.weight || "N/A"
                        }</span></p>
                        <p class='card-text'><strong>Planting Season:</strong> <span class='text-primary'>${
                            s.plantingSeason || "N/A"
                        }</span></p>
                        <p class='card-text'><strong>Growth Duration:</strong> <span class='text-primary'>${
                            s.growthDuration || "N/A"
                        }</span></p>
                    </div>
                </div>
            `;
                const r = s.cropName;
                const a = `<tr class="text-center">
                <td>${n.cropName}</td>
                <td>${n.type}</td>
                <td>${n.remarks}</td>
                <td>
                    <button class="btn btn-green view-btn" 
                        data-img="${e}" 
                        data-description="${o}" 
                        data-crop="${r}" 
                        data-variety='${JSON.stringify(
                            []
                        )}'> <!-- Empty array for varieties -->
                        View Information
                    </button>
                </td>
            </tr>`;
                return a;
            }
        });
        Promise.all(o)
            .then((e) => {
                e.forEach((e) => {
                    if (e) {
                        t.append(e);
                    }
                });
                $(".view-btn").on("click", async function () {
                    const e = $(this).data("img");
                    const t = $(this).data("description");
                    const o = $(this).data("crop");
                    const r = $(this).data("variety");
                    const a = await Dialog.showCropModal(e, t, o, r);
                    if (a.operation === Dialog.OK_OPTION) {
                    } else {
                    }
                });
            })
            ["catch"]((e) => {
                console.error("Error fetching crop details:", e);
            });
    }
}
$(document).ready(async function () {
    await initializeCrops();
    await initializeCropVarieties();
    new TopCrops("Dry", "Vegetables");
    $("#seasonSelect, #typeSelect").on("change", function () {
        const e = $("#seasonSelect").val();
        const t = $("#typeSelect").val();
        if (t === "Rice") {
            $("#riceDisplay").show();
        } else {
            $("#riceDisplay").hide();
        }
        new TopCrops(e, t);
    });
    $("#searchInput").on("keyup", function () {
        const e = $(this).val().toLowerCase();
        $("#cropsTable tbody tr").filter(function () {
            $(this).toggle(
                $(this).find("td:eq(0)").text().toLowerCase().indexOf(e) > -1 ||
                    $(this).find("td:eq(1)").text().toLowerCase().indexOf(e) >
                        -1
            );
        });
    });
    $(document).ready(function () {
        $(".download-btn").click(function () {
            Dialog.downloadDialog()
                .then((e) => {
                    const t = $("#typeSelect").val();
                    download(e, t, dataEntry);
                })
                ["catch"]((e) => {
                    console.error("Error:", e);
                });
        });
    });
});
async function main(n, s) {
    try {
        let e = await getProduction("", n);
        let t = await getPrice("", n);
        let o = await getRiceProduction("", n);
        let r = await getPest("", n);
        let a = await getDisease("", n);
        e = e.map((e) => ({ ...e, type: s }));
        t = t.map((e) => ({ ...e, type: s }));
        r = r.map((e) => ({ ...e, type: s }));
        a = a.map((e) => ({ ...e, type: s }));
        if (s === "Rice") {
            return await stats.getRiceCropData(o);
        } else {
            return await stats.getCropData(e, t, r, a, crops, s);
        }
    } catch (e) {
        console.error("An error occurred in the main function:", e);
    }
}
function download(e, t, o) {
    const r = `${t.toLowerCase()}.${e}`;
    if (e === "csv") {
        downloadCSV(r, o);
    } else if (e === "xlsx") {
        downloadExcel(r, o);
    } else if (e === "pdf") {
        downloadPDF(r, o);
    }
}
function formatHeader(e) {
    return e
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (e) => e.toUpperCase());
}
function escapeCSVValue(e) {
    if (
        typeof e === "string" &&
        (e.includes(",") || e.includes("\n") || e.includes('"'))
    ) {
        e = '"' + e.replace(/"/g, '""') + '"';
    }
    return e;
}
function downloadCSV(e, t) {
    const o = {
        cropName: "Crop Name",
        variety: "Variety",
        type: "Type",
        totalArea: "Total Area (ha)",
        volumeProductionPerHectare: "Average Volume Production (mt/ha)",
        incomePerHectare: "Average Income / ha ",
        profitPerHectare: "Average Profit / ha",
        price: "Price (kg)",
        pestOccurrence: "Pest Observed",
        diseaseOccurrence: "Disease Observed",
    };
    const r = [
        "cropName",
        "type",
        "totalArea",
        "volumeProductionPerHectare",
        "incomePerHectare",
        "profitPerHectare",
        "price",
        "pestOccurrence",
        "diseaseOccurrence",
    ];
    const a = r.map((e) => o[e]);
    function n(e) {
        if (e === undefined || e === null) return "";
        if (
            typeof e === "string" &&
            (e.includes(",") || e.includes('"') || e.includes("\n"))
        ) {
            e = `"${e.replace(/"/g, '""')}"`;
        }
        return e;
    }
    const s = [
        a.join(","),
        ...t.map((o) =>
            r
                .map((e) => {
                    const t = o[e] !== undefined ? o[e] : "";
                    if (
                        e === "incomePerHectare" ||
                        e === "profitPerHectare" ||
                        e === "price"
                    ) {
                        return t !== "" ? `₱${parseFloat(t).toFixed(2)}` : "";
                    }
                    return n(t);
                })
                .join(",")
        ),
    ].join("\n");
    const c = new Blob([s], { type: "text/csv" });
    const i = URL.createObjectURL(c);
    const l = document.createElement("a");
    l.href = i;
    l.download =
        $("#seasonSelect").val() + "_" + e.charAt(0).toUpperCase() + e.slice(1);
    document.body.appendChild(l);
    l.click();
    document.body.removeChild(l);
    URL.revokeObjectURL(i);
    addDownload(e, "CSV");
}
function downloadExcel(a, e) {
    const r = {
        cropName: "Crop Name",
        type: "Type",
        totalArea: "Total Area (ha)",
        volumeProductionPerHectare: "Average Volume Production (mt/ha)",
        incomePerHectare: "Average Income / ha ",
        profitPerHectare: "Average Profit / ha",
        price: "Price (kg)",
        pestOccurrence: "Pest Observed",
        diseaseOccurrence: "Disease Observed",
    };
    const n = [
        "cropName",
        "type",
        "totalArea",
        "volumeProductionPerHectare",
        "incomePerHectare",
        "profitPerHectare",
        "price",
        "pestOccurrence",
        "diseaseOccurrence",
    ];
    const t = n.map((e) => r[e]);
    const o = e.map((t) => {
        const o = {};
        n.forEach((e) => {
            o[r[e]] = t[e];
        });
        return o;
    });
    const s = new ExcelJS.Workbook();
    const c = s.addWorksheet("Sheet1");
    c.addRow(t);
    o.forEach((o) => {
        c.addRow(
            n.map((e) => {
                const t = o[r[e]];
                if (
                    e === "incomePerHectare" ||
                    e === "profitPerHectare" ||
                    e === "price"
                ) {
                    return t ? `₱${parseFloat(t).toFixed(2)}` : "";
                }
                return t;
            })
        );
    });
    const i = {
        font: {
            name: "Calibri",
            size: 12,
            bold: true,
            color: { argb: "FFFFFFFF" },
        },
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "B1BA4D" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
        },
    };
    const l = {
        font: { name: "Calibri", size: 11 },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
        },
    };
    const d = c.getRow(1);
    d.eachCell({ includeEmpty: true }, (e) => {
        e.style = i;
    });
    d.height = 20;
    c.eachRow({ includeEmpty: true }, (e, t) => {
        if (t > 1) {
            e.eachCell({ includeEmpty: true }, (e) => {
                e.style = l;
            });
        }
    });
    c.columns = t.map((e) => ({ width: Math.max(e.length, 10) + 5 }));
    s.xlsx.writeBuffer().then(function (e) {
        const t = new Blob([e], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const o = URL.createObjectURL(t);
        const r = document.createElement("a");
        r.href = o;
        r.download =
            $("#seasonSelect").val() +
            "_" +
            a.charAt(0).toUpperCase() +
            a.slice(1);
        r.click();
        URL.revokeObjectURL(o);
    });
    addDownload(a, "XLSX");
}
function downloadPDF(e, t) {
    const { jsPDF: o } = window.jspdf;
    const r = new o();
    const a = ["cropName", "type", "remarks"];
    const n = a.map(formatHeader);
    r.autoTable({
        head: [n],
        body: t.map((t) =>
            a.map((e) => (e === "remarks" ? extractTextFromHTML(t[e]) : t[e]))
        ),
        theme: "striped",
    });
    r.save(
        $("#seasonSelect").val() + "_" + e.charAt(0).toUpperCase() + e.slice(1)
    );
    addDownload(e, "PDF");
}
function extractTextFromHTML(e) {
    const t = document.createElement("div");
    t.innerHTML = e;
    let o = t.textContent || t.innerText || "";
    o = o
        .replace(/&nbsp;/g, " ")
        .replace(/[^\w\s.,-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return o;
}
