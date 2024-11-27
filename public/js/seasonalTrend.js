import {
    getProduction,
    getPrice,
    getPest,
    getDisease,
    addDownload,
    getUniqueCropNames,
    getRiceProduction,
    getDamages,
} from "./fetch.js";
import * as stats from "./statistics.js";
import Dialog from "../management/components/helpers/Dialog.js";
$(document).ready(function () {
    $("#infoBtn").click(function () {
        let e = `
 <div>
     <p>Welcome to our Seasonal Trends page (Maligayang pagdating sa aming Pahina ng Mga Panahonang Trend). To effectively use this tool, follow these instructions (Upang magamit nang maayos ang tool na ito, sundin ang mga tagubilin na ito):</p>

    <ol>
      <li><strong>Select Your Parameters (Piliin ang Iyong Mga Parameter):</strong><br>
      Use the dropdown menus and filters to choose the crops, seasons, or other criteria you wish to analyze (Gamitin ang mga dropdown menu at filter upang piliin ang mga pananim, panahon, o iba pang pamantayan na nais mong suriin).</li>

      <li><strong>View Trends (Tingnan ang Mga Trend):</strong><br>
      Explore the displayed charts and tables to see trends in crop production volumes, prices, income, and pest/disease occurrences etc. (Suriin ang mga ipinakitang tsart at talahanayan upang makita ang mga trend sa dami ng produksyon ng pananim, presyo, kita, at paglitaw ng peste/sakit atbp.).</li>

      <li><strong>Analyze Data (Suriin ang Data):</strong><br>
      Utilize the provided data to observe patterns, compare different crops, and make strategic decisions for crop management (Gamitin ang ibinigay na data upang obserbahan ang mga pattern, ihambing ang iba't ibang pananim, at gumawa ng mga istratehikong desisyon para sa pamamahala ng pananim).</li>

      <li><strong>Monitor Growth (Subaybayan ang Paglago):</strong><br>
      Track the growth of selected crops and assess their performance over time to improve agricultural practices (Subaybayan ang paglago ng napiling mga pananim at tasahin ang kanilang pagganap sa paglipas ng panahon upang mapabuti ang mga kasanayan sa agrikultura).</li>

      <li><strong>Download Data (I-download ang Data):</strong><br>
      You can download the data in various formats for further analysis (Maaari mong i-download ang data sa iba't ibang format para sa karagdagang pagsusuri):
        <ul>
          <li><strong>CSV:</strong> Download raw data in CSV format for use in spreadsheet applications or data analysis tools (I-download ang raw data sa format na CSV para sa paggamit sa mga spreadsheet application o mga tool sa pagsusuri ng data).</li>
          <li><strong>Excel:</strong> Download the data in Excel format, which includes formatted tables for easy review and manipulation (I-download ang data sa format na Excel, na may kasamang mga naka-format na talahanayan para sa madaling pagsusuri at pagmamanipula).</li>
          <li><strong>PDF:</strong> Download charts and visualizations in PDF format for easy sharing and reporting (I-download ang mga tsart at visualisasyon sa format na PDF para sa madaling pagbabahagi at pag-uulat).</li>
        </ul>
      </li>
    </ol>

    <p>This tool is designed to help you identify and monitor key agricultural trends, offering valuable insights into crop performance and market dynamics (Ang tool na ito ay idinisenyo upang tulungan kang matukoy at subaybayan ang mga pangunahing trend sa agrikultura, na nag-aalok ng mahahalagang pananaw sa pagganap ng pananim at dinamika ng merkado).</p>
 </div>

    `;
        Dialog.showInfoModal(e);
    });
});
let downloadYR;
class SeasonalTrends {
    constructor(e, t, o, r) {
        this.season = e;
        this.type = t;
        this.crops = o;
        this.category = r;
    }
    generateTrends(a, e, n) {
        if (!a.length) {
            return { lineChartConfig: null, barChartConfig: null };
        }
        const t = Array.from(new Set(a.map((e) => e.season)));
        const o = t[0] || "Unknown";
        const s = Array.from(
            new Set(a.map((e) => e.monthYear.split(" ")[1]))
        ).sort((e, t) => e - t);
        const r = s.length === 1 ? s[0] : `${Math.min(...s)}-${Math.max(...s)}`;
        downloadYR = r;
        const c = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12,
        };
        const i = Array.from(new Set(a.map((e) => e.monthYear))).sort(
            (e, t) => {
                const [o, r] = e.split(" ");
                const [a, n] = t.split(" ");
                return r - n || c[o] - c[a];
            }
        );
        const l = Array.from(new Set(a.map((e) => e.cropName)));
        const d = l.map((o) => {
            return {
                label: o,
                data: i.map((t) => {
                    const e = a.find(
                        (e) => e.cropName === o && e.monthYear === t
                    );
                    return e ? e[n[0]] : 0;
                }),
            };
        });
        const p = {
            datasets: d
                .filter((e) => e.data.some((e) => e !== 0))
                .map((e) => ({
                    label: e.label,
                    data: e.data.map((e, t) => ({ x: i[t], y: e })),
                    borderColor: "#007bff",
                    backgroundColor: "rgba(72, 202, 228, 0.5)",
                    pointRadius: 5,
                })),
        };
        const u =
            n[0] === "totalOccurrence" || n[0] === "averageYieldLoss"
                ? "scatter"
                : "line";
        const g = {
            type: u,
            data: p,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: `${e} Trends (${o} Season)` },
                    tooltip: {
                        callbacks: {
                            label: function (e) {
                                const t = e.dataIndex;
                                const o = p.datasets[e.datasetIndex].data[t].x;
                                const r = a.filter((e) => e.monthYear === o);
                                return [
                                    `${n[0]}: ${
                                        p.datasets[e.datasetIndex].data[t].y
                                    }`,
                                    ...n.slice(1).map((o) => {
                                        if (
                                            [
                                                "pestOccurrences",
                                                "diseaseOccurrences",
                                            ].includes(o)
                                        ) {
                                            let e = r
                                                .map((e) => {
                                                    return e[o]
                                                        .map((e) => {
                                                            let t =
                                                                o ===
                                                                "pestOccurrences"
                                                                    ? e.pestName
                                                                    : e.diseaseName;
                                                            return `${t} : ${e.occurrence}`;
                                                        })
                                                        .join(", ");
                                                })
                                                .join(" | ");
                                            return e;
                                        } else {
                                            const e = r.reduce(
                                                (e, t) => e + (t[o] || 0),
                                                0
                                            );
                                            return `${o}: ${e.toFixed(2)}`;
                                        }
                                    }),
                                ];
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: { display: true, text: "Month Year" },
                        type: "category",
                    },
                    y: { title: { display: true, text: e } },
                },
            },
        };
        const h = s.map((t) => {
            const r = a.filter((e) => e.monthYear.endsWith(t));
            const e = n.map((o) => {
                if (["pestOccurrences", "diseaseOccurrences"].includes(o)) {
                    let e = r
                        .map((e) => {
                            return e[o]
                                .map((e) => {
                                    let t =
                                        o === "pestOccurrences"
                                            ? e.pestName
                                            : e.diseaseName;
                                    return `${t} : ${e.occurrence}`;
                                })
                                .join(", ");
                        })
                        .join(" | ");
                    return e;
                }
                const { sum: e, count: t } = r.reduce(
                    (e, t) => {
                        e.sum += t[o];
                        e.count += 1;
                        return e;
                    },
                    { sum: 0, count: 0 }
                );
                return t > 0 ? e / t : 0;
            });
            return e;
        });
        const m = {
            labels: s,
            datasets: l.map((e, t) => ({
                label: e,
                data: h.map((e) => e[t] || 0),
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                borderWidth: 1,
            })),
        };
        const f = {
            type: "bar",
            data: m,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: true,
                        text: `${e} Per Year (${o} Season)`,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (e) {
                                const t = e.dataIndex;
                                const o = s[t];
                                const r = h[t];
                                return r.map((e, t) => {
                                    if (
                                        [
                                            "pestOccurrences",
                                            "diseaseOccurrences",
                                            "totalOccurrence",
                                        ].includes(n[t])
                                    ) {
                                        return `Average ${n[t]} for ${o}: ${e}`;
                                    }
                                    return `Average ${
                                        n[t]
                                    } for ${o}: ${e.toFixed(2)}`;
                                });
                            },
                        },
                    },
                },
                scales: {
                    x: { title: { display: true, text: "Year" } },
                    y: { title: { display: true, text: e } },
                },
            },
        };
        return { lineChartConfig: g, barChartConfig: f };
    }
    displayTrends(e, t) {
        const o = Chart.getChart("seasonalTrendChart");
        const r = Chart.getChart("totalPerYearChart");
        if (o) {
            o.destroy();
            r.destroy();
            $("#interpretation").empty();
        }
        const a = new Chart(document.getElementById("seasonalTrendChart"), {
            ...e.lineChartConfig,
            options: {
                ...e.lineChartConfig.options,
                responsive: true,
                maintainAspectRatio: false,
            },
        });
        const n = new Chart(document.getElementById("totalPerYearChart"), {
            ...e.barChartConfig,
            options: {
                ...e.barChartConfig.options,
                responsive: true,
                maintainAspectRatio: false,
            },
        });
        $("#interpretation").html(t);
        window.addEventListener("resize", function () {
            a.resize();
            n.resize();
        });
    }
}
let downloadData;
let printData;
let currentType;
async function updateCropOptions() {
    const e = $("#type").val().toLowerCase();
    const t = $("#season").val().toLowerCase();
    let o = "";
    try {
        if (e === "rice") {
            o = '<option value="rice">Rice</option>';
        } else {
            const a = await getUniqueCropNames(t, e);
            o =
                a.length > 0
                    ? a
                          .map(
                              (e) =>
                                  `<option value="${e}">${
                                      e.charAt(0).toUpperCase() + e.slice(1)
                                  }</option>`
                          )
                          .join("")
                    : '<option value="">No crops available</option>';
        }
    } catch (r) {
        console.error("Failed to update crop options:", r);
        o = '<option value="">Error loading crops</option>';
    }
    $("#crop").html(o);
}
async function handleCategoryChange() {
    const e = $("#season").val();
    const t = $("#type").val();
    const o = $("#crop").val();
    const r = $("#category").val();
    if (!o) {
        $("#available").hide();
        $("#unavailable").hide();
        $("#interpretation").hide();
        $("#selectFirst").show();
        $("#downloadBtn").hide();
        return;
    }
    let a;
    let n = [];
    let s = [];
    let c = [];
    switch (r) {
        case "usage_level":
            a = "Production Usage Level (%)";
            s = ["usageLevel", "totalProduction", "totalSold"];
            c = await getProduction(o, e);
            n = stats.UsageLevelFrequency(c);
            break;
        case "area_planted":
            a = "Area Planted (Hectare)";
            s = ["areaPlanted"];
            if (o === "rice") {
                c = await getRiceProduction(o, e);
            } else {
                c = await getProduction(o, e);
            }
            n = stats.countAverageAreaPlanted(c);
            break;
        case "production_volume":
            a = "Production Volume Per Hectare";
            s = ["volumeProductionPerHectare", "totalVolume", "totalArea"];
            if (o === "rice") {
                c = await getRiceProduction(o, e);
            } else {
                c = await getProduction(o, e);
            }
            n = stats.averageVolumeProduction(c);
            break;
        case "price":
            a = "Price";
            s = ["price"];
            c = await getPrice(o, e);
            n = stats.averagePrice(c);
            break;
        case "pest_occurrence":
            a = "Pest Occurrence";
            s = [
                "totalOccurrence",
                "pestOccurrences",
                "totalAffected",
                "totalPlanted",
                "percentage",
            ];
            c = await getPest(o, e);
            n = stats.countPestOccurrence(c);
            break;
        case "disease_occurrence":
            a = "Disease Occurrence";
            s = ["totalOccurrence", "diseaseOccurrences"];
            c = await getDisease(o, e);
            n = stats.countDiseaseOccurrence(c);
            break;
        case "price_income_per_hectare":
            a = "Price Income per Hectare";
            s = ["incomePerHectare", "totalArea", "totalIncome"];
            c = await getProduction(o, e);
            n = stats.priceIncomePerHectare(c);
            break;
        case "profit_per_hectare":
            a = "Profit per Hectare";
            s = [
                "profitPerHectare",
                "totalArea",
                "totalIncome",
                "totalProductionCost",
            ];
            c = await getProduction(o, e);
            n = stats.profitPerHectare(c);
            break;
        case "damages":
            a = "Damages Report";
            s = [
                "averageYieldLoss",
                "totalFarmers",
                "totalAreaAffected",
                "totalGrandValue",
            ];
            c = await getDamages(o, e);
            n = stats.calculateDamages(c);
            break;
        default:
            a = "Category not recognized";
    }
    if (n.length !== 0) {
        $("#unavailable").hide();
        $("#selectFirst").hide();
        $("#interpretation").show();
        $("#available").show();
        $("#downloadBtn").show();
        const i = new SeasonalTrends(e, t, o, a);
        const l = interpretData(n, s[0]);
        const d = i.generateTrends(n, a, s);
        i.displayTrends(d, l);
        printData = { charts: d, interpretation: l, categoryText: a };
        currentType = s[0];
    } else {
        $("#available").hide();
        $("#interpretation").hide();
        $("#selectFirst").hide();
        $("#unavailable").show();
        $("#downloadBtn").hide();
    }
    downloadData = n;
    downloadData.forEach((t) => {
        if (Array.isArray(t.diseaseOccurrences)) {
            t.diseaseOccurrences.forEach((e) => {
                t.diseaseName = e.diseaseName;
                t.occurrence = e.occurrence;
            });
            delete t.diseaseOccurrences;
        }
        if (Array.isArray(t.pestOccurrences)) {
            t.pestOccurrences.forEach((e) => {
                t.pestName = e.pestName;
                t.pestOccurrence = e.occurrence;
            });
            delete t.pestOccurrences;
        }
    });
}
function populateCategoryOptions(e) {
    const o = document.getElementById("category");
    o.innerHTML = "";
    const r = {
        usage_level: "Production Usage Level",
        production_volume: "Average Production Volume",
        price_income_per_hectare: "Average Income",
        profit_per_hectare: "Average Profit",
        area_planted: "Average Area Planted",
        price: "Average Price",
        pest_occurrence: "Pest Occurrence",
        disease_occurrence: "Disease Occurrence",
        damages: "Damages Reports",
    };
    let t;
    if (e === "Rice") {
        t = ["production_volume", "area_planted"];
    } else {
        t = Object.keys(r);
    }
    t.forEach((e) => {
        const t = document.createElement("option");
        t.value = e;
        t.textContent = r[e];
        o.appendChild(t);
    });
}
$(document).ready(async function () {
    updateCropOptions().then(() => handleCategoryChange());
    $("#type").on("change", function () {
        const e = $(this).val();
        populateCategoryOptions(e);
    });
    $("#type").on("change", function () {
        updateCropOptions().then(() => handleCategoryChange());
    });
    $("#season").on("change", function () {
        updateCropOptions().then(() => handleCategoryChange());
    });
    $("#category, #crop").on("change", function () {
        handleCategoryChange();
    });
});
function interpretData(o) {
    const a = {
        total: {},
        monthlyData: {},
        months: [],
        pestOccurrences: {},
        diseaseOccurrences: {},
    };
    const e = o[0]?.cropName || "Unknown Crop";
    const t = Object.keys(o[0]).filter((e) => typeof o[0][e] === "number");
    t.forEach((e) => {
        a.total[e] = 0;
        a.monthlyData[e] = {};
    });
    o.forEach((o) => {
        const { monthYear: r } = o;
        t.forEach((e) => {
            const t = o[e] || 0;
            a.total[e] += t;
            if (!a.monthlyData[e][r]) {
                a.monthlyData[e][r] = [];
            }
            a.monthlyData[e][r].push(t);
        });
        if (o.pestOccurrences && Array.isArray(o.pestOccurrences)) {
            o.pestOccurrences.forEach(({ pestName: e, occurrence: t }) => {
                a.pestOccurrences[e] = (a.pestOccurrences[e] || 0) + t;
            });
        }
        if (o.diseaseOccurrences && Array.isArray(o.diseaseOccurrences)) {
            o.diseaseOccurrences.forEach(
                ({ diseaseName: e, occurrence: t }) => {
                    a.diseaseOccurrences[e] =
                        (a.diseaseOccurrences[e] || 0) + t;
                }
            );
        }
        if (!a.months.includes(r)) {
            a.months.push(r);
        }
    });
    a.months.sort((e, t) => new Date(e) - new Date(t));
    let n = a.months.slice(-5);
    if (n.length < 2) {
        return;
    }
    const s = {};
    t.forEach((o) => {
        const e = n.length;
        s[o] = Array(e).fill(0);
        n.forEach((e, t) => {
            s[o][t] =
                a.monthlyData[o][e].reduce((e, t) => e + t, 0) /
                (a.monthlyData[o][e].length || 1);
        });
    });
    const c = {};
    t.forEach((t) => {
        c[t] = [];
        if (n.length >= 2) {
            for (let e = 1; e < n.length; e++) {
                const o = s[t][e - 1];
                const r = s[t][e];
                const a = o !== 0 ? Math.round(((r - o) / o) * 100) : null;
                c[t].push(a);
            }
        }
    });
    const r = {};
    t.forEach((e) => {
        r[e] =
            n.length >= 2
                ? Math.round(
                      ((s[e][s[e].length - 1] - s[e][0]) / s[e][0]) * 100
                  )
                : null;
    });
    const i = {};
    t.forEach((e) => {
        const t = c[e][c[e].length - 1] || 0;
        i[e] = {
            average: a.total[e] / (o.length || 1),
            growthRateOverall: r[e],
            growthRateLatestMonth: t,
            performance:
                r[e] > 0 ? "Increase" : r[e] < 0 ? "Decrease" : "Stable",
        };
    });
    const l = Array.from(new Set(o.map((e) => e.monthYear))).sort(
        (e, t) => new Date(e) - new Date(t)
    );
    const d = l.length === 1 ? l[0] : `${l[0]} - ${l[l.length - 1]}`;
    let p = `
    <h3 data-key="messages.test" class="text-primary" style="font-size: 2rem; font-weight: bold;">Crop Performance Analysis for <strong>${e}</strong> (Pagsusuri sa Pagganap ng Pananim para sa <strong>${e}</strong>)</h3>
    <p style="font-size: 1.1rem; color: #333;">Period: <span class="text-success">${d}</span> (Panahon: <span class="text-success">${d}</span>). Below is a detailed breakdown of the crop's performance during the specified period, focusing on the latest years with sufficient records: (Narito ang detalyadong pagsusuri ng pagganap ng pananim sa tinukoy na panahon, na nakatuon sa pinakahuling taon na may sapat na talaan:)</p>
    `;
    const u = t[t.length - 1];
    const g = r[u];
    const h = u.replace(/([A-Z])/g, " $1").toLowerCase();
    let m;
    if (g > 20) {
        m = `The crop's <strong>${h}</strong> has shown a performance categorized as <strong>Excellent</strong> (Ang <strong>${h}</strong> ng pananim ay nagpakita ng pagganap na inuri bilang <strong>Napakahusay</strong>) with a growth rate of <strong>${g.toFixed(
            2
        )}%</strong>, indicating significant growth compared to the previous season. (na may antas ng paglago na <strong>${g.toFixed(
            2
        )}%</strong>, na nagpapahiwatig ng makabuluhang paglago kumpara sa nakaraang panahon.)`;
    } else if (g > 5) {
        m = `The crop's <strong>${h}</strong> has shown a performance categorized as <strong>Good</strong> (Ang <strong>${h}</strong> ng pananim ay nagpakita ng pagganap na inuri bilang <strong>Maganda</strong>) with a growth rate of <strong>${g.toFixed(
            2
        )}%</strong>, reflecting a positive trend in production levels. (na may antas ng paglago na <strong>${g.toFixed(
            2
        )}%</strong>, na nagpapakita ng positibong takbo sa antas ng produksyon.)`;
    } else if (g >= -5) {
        m = `The crop's <strong>${h}</strong> performance has remained <strong>Stable</strong> (Ang pagganap ng <strong>${h}</strong> ng pananim ay nanatiling <strong>Matatag</strong>) with a growth rate of <strong>${g.toFixed(
            2
        )}%</strong>, indicating consistency in production levels. (na may antas ng paglago na <strong>${g.toFixed(
            2
        )}%</strong>, na nagpapahiwatig ng pagiging pare-pareho sa antas ng produksyon.)`;
    } else if (g >= -20) {
        m = `The crop's <strong>${h}</strong> has experienced a performance categorized as <strong>Poor</strong> (Ang <strong>${h}</strong> ng pananim ay nakaranas ng pagganap na inuri bilang <strong>Mahirap</strong>) with a growth rate of <strong>${g.toFixed(
            2
        )}%</strong>, suggesting potential issues that may need addressing. (na may antas ng paglago na <strong>${g.toFixed(
            2
        )}%</strong>, na nagpapahiwatig ng mga potensyal na isyu na maaaring kailangang tugunan.)`;
    } else {
        m = `The crop's <strong>${h}</strong> has shown a performance categorized as <strong>Very Poor</strong> (Ang <strong>${h}</strong> ng pananim ay nagpakita ng pagganap na inuri bilang <strong>Napakahina</strong>) with a growth rate of <strong>${g.toFixed(
            2
        )}%</strong>, indicating significant decline and requiring immediate attention. (na may antas ng paglago na <strong>${g.toFixed(
            2
        )}%</strong>, na nagpapahiwatig ng makabuluhang pagbagsak at nangangailangan ng agarang pansin.)`;
    }
    p += `
    <div class="row mb-4">
        <div class="col-12">
            <div class="alert alert-info" role="alert" style="border-radius: 10px;">
                <strong>Performance Summary:</strong> (Buod ng Pagganap:) ${m}
            </div>
        </div>
    </div>
    `;

    p += `<div class="row" style="margin-bottom: 20px;">`;
    t.slice()
        .reverse()
        .forEach((e) => {
            const t = e.replace(/([A-Z])/g, " $1").toLowerCase();
            const o = i[e].growthRateOverall;
            const r = i[e].growthRateLatestMonth;
            const a =
                i[e].performance === "Increase"
                    ? "bg-success"
                    : i[e].performance === "Decrease"
                    ? "bg-danger"
                    : "bg-warning";
            const n =
                i[e].performance === "Increase"
                    ? '<i class="fas fa-arrow-up"></i>'
                    : i[e].performance === "Decrease"
                    ? '<i class="fas fa-arrow-down"></i>'
                    : '<i class="fas fa-minus"></i>';
            const s = e === u ? "highlighted-field" : "";
            p += ` 
    <div class="col-md-4 mb-4"> <!-- Adjust the number of columns here --> 
        <div class="card shadow-lg" style="border-radius: 15px; color: white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);"> 
            <div class="card-header ${a} ${s} text-center" style="font-size: 1.25rem;"><strong>${n} ${
                t.charAt(0).toUpperCase() + t.slice(1)
            }</strong></div> 
            <div class="card-body"> 
                <ul class="text-center" style="list-style-type: none; padding: 0; color: #000"> 
                    <li style="margin: 5px 0;">Average: <strong>${i[
                        e
                    ].average.toFixed(2)}</strong></li> 
                    <li style="margin: 5px 0;">Overall Growth Rate: <strong>${o}%</strong></li> 
                    <li style="margin: 5px 0;">Growth Rate in Latest Month: <strong>${r}%</strong></li> 
                    <li style="margin: 5px 0;">Performance: <strong>${
                        i[e].performance
                    }</strong></li> 
                </ul> 
            </div> 
        </div> 
    </div>
`;
        });
    p += `</div>`;
    if (Object.keys(a.pestOccurrences).length > 0) {
        const f = Object.entries(a.pestOccurrences)
            .map(
                ([e, t]) => `
        <li style="padding: 10px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">
            ${e}: <strong>${t}</strong>
        </li>
    `
            )
            .join("");
        p += `
    <div style="margin-top: 20px;">
        <h5 style="color: #d9534f;">Pest Occurrences:</h5>
        <ul style="list-style-type: none; padding: 0; border: 1px solid #ccc; border-radius: 5px; background-color: #fff;">
            ${f}
        </ul>
    </div>
`;
    }
    if (Object.keys(a.diseaseOccurrences).length > 0) {
        const y = Object.entries(a.diseaseOccurrences)
            .map(
                ([e, t]) => `
        <li style="padding: 10px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">
            ${e}: <strong>${t}</strong>
        </li>
    `
            )
            .join("");
        p += `
    <div style="margin-top: 20px;">
        <h5 style="color: #d9534f;">Disease Occurrences:</h5>
        <ul style="list-style-type: none; padding: 0; border: 1px solid #ccc; border-radius: 5px; background-color: #fff;">
            ${y}
        </ul>
    </div>
`;
    }
    p += `<p style="margin-top: 20px; font-size: 1rem; color: #333;">This analysis provides a detailed breakdown of the crop's performance over time, highlighting trends, growth rates, and performance levels to support informed decision-making. (Ang pagsusuring ito ay nagbibigay ng detalyadong pagsusuri ng pagganap ng pananim sa paglipas ng panahon, na binibigyang-diin ang mga uso, antas ng paglago, at antas ng pagganap upang suportahan ang mahusay na paggawa ng desisyon.)</p>`;
    p += `<small class="text-muted">Note: Findings are based on available data only. (Tandaan: Ang mga natuklasan ay batay lamang sa mga magagamit na datos.)</small>`;

    return p;
}
$(document).ready(function () {
    $(".download-btn").click(function () {
        Dialog.downloadDialog()
            .then((e) => {
                download(e, currentType, downloadData);
            })
            ["catch"]((e) => {
                console.error("Error:", e);
            });
    });
});
function download(e, t, o) {
    const r = `${t.toLowerCase()}.${e}`;
    if (e === "csv") {
        downloadCSV(o);
    } else if (e === "xlsx") {
        downloadExcel(o);
    } else if (e === "pdf") {
        downloadPDF(r);
    }
}
function downloadCSV(e) {
    if (!e || e.length === 0) {
        console.error("No data available to download.");
        return;
    }
    function r(e) {
        if (e === undefined || e === null) return "";
        if (
            typeof e === "string" &&
            (e.includes(",") || e.includes('"') || e.includes("\n"))
        ) {
            e = `"${e.replace(/"/g, '""')}"`;
        }
        return e;
    }
    e.sort((e, t) => new Date(e.monthYear) - new Date(t.monthYear));
    const a = Object.keys(e[0]);
    const t = [
        "Monthly Data",
        a.join(","),
        ...e.map((o) =>
            a
                .map((e) => {
                    const t = o[e];
                    if (
                        e === "incomePerHectare" ||
                        e === "profitPerHectare" ||
                        e === "price"
                    ) {
                        return t ? `"₱${parseFloat(t).toFixed(2)}"` : "";
                    }
                    return r(t);
                })
                .join(",")
        ),
    ].join("\n");
    const n = {};
    e.forEach((t) => {
        const o = new Date(t.monthYear).getFullYear();
        const r = `${t.cropName}-${t.season}`;
        if (!n[o]) {
            n[o] = {};
        }
        if (!n[o][r]) {
            n[o][r] = {
                cropName: t.cropName,
                season: t.season,
                count: 0,
                sums: {},
            };
            a.forEach((e) => {
                n[o][r].sums[e] = 0;
            });
        }
        n[o][r].count++;
        a.forEach((e) => {
            n[o][r].sums[e] += parseFloat(t[e]) || 0;
        });
    });
    const o = [
        "\nYearly Data",
        ["Year", "Crop Name", "Season", ...a.slice(3)].join(","),
        ...Object.entries(n).flatMap(([e, t]) =>
            Object.values(t).map((o) => {
                const r = [e, o.cropName, o.season];
                a.slice(3).forEach((e) => {
                    const t = (o.sums[e] / o.count).toFixed(2);
                    r.push(t);
                });
                return r.join(",");
            })
        ),
    ].join("\n");
    const s = [t, o].join("\n");
    const c = e.map((e) => new Date(e.monthYear).getFullYear());
    const i = `${Math.min(...c)}-${Math.max(...c)}`;
    const l = `Seasonal Crops Data ${i}.csv`;
    const d = new Blob([s], { type: "text/csv" });
    const p = URL.createObjectURL(d);
    const u = document.createElement("a");
    u.href = p;
    u.download = l;
    document.body.appendChild(u);
    u.click();
    document.body.removeChild(u);
    URL.revokeObjectURL(p);
    addDownload(l, "CSV");
}
function downloadExcel(e) {
    if (!e || e.length === 0) {
        console.error("No data available to download.");
        return;
    }
    e.sort((e, t) => new Date(e.monthYear) - new Date(t.monthYear));
    const a = Object.keys(e[0]);
    const t = new ExcelJS.Workbook();
    const o = {
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
    const r = t.addWorksheet("Monthly Data");
    r.addRow(["Monthly Data"]).font = { bold: true };
    const n = r.addRow(a);
    n.eachCell((e) => {
        e.style = o;
    });
    e.forEach((o) => {
        const e = a.map((e) => {
            const t = o[e];
            if (
                e === "incomePerHectare" ||
                e === "profitPerHectare" ||
                e === "price"
            ) {
                return t ? `₱${parseFloat(t).toFixed(2)}` : "";
            }
            return t;
        });
        const t = r.addRow(e);
        t.eachCell((e) => {
            e.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });
    });
    r.columns.forEach((e) => {
        e.width = 20;
    });
    const s = t.addWorksheet("Yearly Data");
    s.addRow(["Yearly Data"]).font = { bold: true };
    const c = s.addRow(["Year", "Crop Name", "Season", ...a.slice(3)]);
    c.eachCell((e) => {
        e.style = o;
    });
    const i = {};
    e.forEach((t) => {
        const o = new Date(t.monthYear).getFullYear();
        const r = `${t.cropName}-${t.season}`;
        if (!i[o]) {
            i[o] = {};
        }
        if (!i[o][r]) {
            i[o][r] = {
                cropName: t.cropName,
                season: t.season,
                count: 0,
                sums: {},
            };
            a.forEach((e) => {
                i[o][r].sums[e] = 0;
            });
        }
        i[o][r].count++;
        a.forEach((e) => {
            i[o][r].sums[e] += parseFloat(t[e]) || 0;
        });
    });
    Object.entries(i).forEach(([t, e]) => {
        Object.values(e).forEach((o) => {
            const r = [t, o.cropName, o.season];
            a.slice(3).forEach((e) => {
                const t = (o.sums[e] / o.count).toFixed(2);
                r.push(t);
            });
            const e = s.addRow(r);
            e.eachCell((e) => {
                e.border = {
                    top: { style: "thin", color: { argb: "FF000000" } },
                    left: { style: "thin", color: { argb: "FF000000" } },
                    bottom: { style: "thin", color: { argb: "FF000000" } },
                    right: { style: "thin", color: { argb: "FF000000" } },
                };
            });
        });
    });
    s.columns.forEach((e) => {
        e.width = 20;
    });
    const l = e.map((e) => new Date(e.monthYear).getFullYear());
    const d = `${Math.min(...l)}-${Math.max(...l)}`;
    const p = `Seasonal Crops Data ${d}.xlsx`;
    t.xlsx.writeBuffer().then((e) => {
        const t = new Blob([e], { type: "application/octet-stream" });
        const o = URL.createObjectURL(t);
        const r = document.createElement("a");
        r.href = o;
        r.download = p;
        document.body.appendChild(r);
        r.click();
        document.body.removeChild(r);
        URL.revokeObjectURL(o);
    });
    addDownload(p, "XLSX");
}
function downloadPDF(e) {
    sessionStorage.setItem("printData", JSON.stringify(printData));
    const t = window.open("/print-seasonal-trends", "_blank");
    t.onload = function () {
        t.print();
    };
    addDownload(e, "PDF");
}
