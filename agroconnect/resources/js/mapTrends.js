import {
    getCrop,
    getProduction,
    getPest,
    getDisease,
    getProductions,
    getBarangay,
    getYearRange,
    addDownload,
    getUniqueCropNames,
    getDamages,
    getRiceProduction,
} from "./fetch.js";
import * as stats from "./statistics.js";
import Dialog from "../management/components/helpers/Dialog.js";

let barangays = [];
let globalMap = null;
let downloadData;
let downloadYR;
let printDataMap;
let markers = [];
let currentType;

$(document).ready(function () {
    $("#infoBtn").click(function () {
        let htmlScript = `
        <p>Welcome to the Map Trends page. This tool helps you analyze and visualize agricultural trends by barangay location using geo-tagging. Follow these instructions to use the tool effectively:</p>

        <ol>
          <li><strong>Select Your Parameters:</strong><br>
          Use the dropdown menus and filters to choose the specific criteria you want to analyze, such as production volume, pest occurrences, or disease incidents.</li>

          <li><strong>View Map Trends:</strong><br>
          The map will display barangays with geo-tags indicating the level of production volume, pest, and disease occurrences. Areas are categorized as:
            <ul>
              <li><strong>Low:</strong> Indicating minimal activity or low values in the selected criteria.</li>
              <li><strong>Moderate:</strong> Showing average levels of activity or medium values.</li>
              <li><strong>High:</strong> Highlighting areas with high levels of production, pest, or disease occurrences.</li>
            </ul>
          </li>

          <li><strong>Analyze Data:</strong><br>
          Utilize the map's visual representation to identify trends and patterns in different barangays. Click on specific geo-tags or areas for detailed information about production volume, pest occurrences, or disease incidents.</li>

          <li><strong>Explore Detailed Information:</strong><br>
          Clicking on a geo-tagged barangay will open a modal with more detailed information, such as:
            <ul>
              <li><strong>Production Volume:</strong> Detailed statistics on crop production in that barangay.</li>
              <li><strong>Pest and Disease Data:</strong> Information on pest and disease occurrences and their impact.</li>
              <li><strong>Additional Insights:</strong> Other relevant data points to help understand the local agricultural situation.</li>
            </ul>
          </li>

          <li><strong>Download Data:</strong><br>
          You can download the data in various formats for further analysis:
            <ul>
              <li><strong>CSV:</strong> Download raw data in CSV format for use in spreadsheet applications or data analysis tools.</li>
              <li><strong>Excel:</strong> Download the data in Excel format, which includes formatted tables for easy review and manipulation.</li>
              <li><strong>PDF:</strong> Download charts and visualizations in PDF format for easy sharing and reporting.</li>
            </ul>
          </li>
        </ol>

        <p>This tool is designed to provide a comprehensive view of agricultural trends by barangay, utilizing geo-tagging to make localized data analysis easier and more informative. The download options allow you to export and work with your data in multiple formats.</p>
        `;

        Dialog.showInfoModal(htmlScript);
    });
});

// Fetch initial barangay data
async function initializeBarangays() {
    try {
        barangays = await getBarangay();
    } catch (error) {
        console.error("Failed to initialize barangays:", error);
    }
}

// Initialize global map
function initializeGlobalMap() {
    if (!globalMap) {
        globalMap = L.map("map", { renderer: L.canvas() }).setView(
            [14.27, 121.126],
            11
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(globalMap);

        // Ensure the map is loaded initially
        globalMap.whenReady(() => globalMap.invalidateSize());
    }
}

// Define MapTrends class
class MapTrends {
    constructor(season, type, crop, category) {
        this.season =
            season.charAt(0).toUpperCase() + season.slice(1).toLowerCase();
        this.type = type;
        this.crop = crop.charAt(0).toUpperCase() + crop.slice(1);
        this.category = category;
    }

    generateMapTrends(barangays, data, key, label) {
        $("title").empty();
        $("#title").html(`<p>${label}</p>`); // Update title
        $(".label-box").empty();

        console.log(data);

        // Initialize missing barangay data
        barangays.forEach((barangay) => {
            if (!data.find((d) => d.barangayName === barangay.barangayName)) {
                data.push({
                    barangay: barangay.barangayName,
                    cropName: this.crop,
                    season: this.season,
                    [key]: 0,
                });
            }
        });

        // Parse key values to ensure they're numbers
        data.forEach((d) => {
            d[key] = parseFloat(d[key]);
        });

        const keyArray = data.map((d) => d[key]);
        console.log("Key Array:", keyArray); // Debugging

        const mean =
            keyArray.reduce((sum, value) => sum + value, 0) / keyArray.length;
        const stdDev = Math.sqrt(
            keyArray
                .map((value) => Math.pow(value - mean, 2))
                .reduce((sum, value) => sum + value, 0) / keyArray.length
        );

        data.forEach((d) => {
            d.zScore = (d[key] - mean) / stdDev;
        });

        function getColor(zScore) {
            if (zScore > 1.5) return "#0000FF"; // Blue
            if (zScore >= 0.5) return "#008000"; // Green
            return "#FF0000"; // Red
        }

        return {
            barangays,
            data,
            getColor,
        };
    }

    displayMapTrends(barangays, data, key, label, text) {
        let markerLayerGroup = L.layerGroup().addTo(globalMap);

        // Close all open popups before adding new markers
        globalMap.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker && layer.isPopupOpen()) {
                layer.closePopup();
            }
        });

        const {
            barangays: updatedBarangays,
            data: updatedData,
            getColor,
        } = this.generateMapTrends(barangays, data, key, label);

        setTimeout(() => {
            markerLayerGroup.clearLayers();

            updatedBarangays.forEach((barangay) => {
                const { lat, lon } = getLatLon(barangay.coordinates);
                const locationData = updatedData.find(
                    (d) => d.barangay === barangay.barangayName
                );
                if (locationData) {
                    const color = getColor(locationData.zScore);

                    var circleMarker = L.circleMarker([lat, lon], {
                        radius: 8,
                        color: "black",
                        fillColor: color,
                        fillOpacity: 1,
                    })
                        .bindPopup(
                            `<strong>${barangay.barangayName}:</strong><br>${text}: ${locationData[key]}`
                        )
                        .on("popupopen", function () {
                            globalMap.panTo(circleMarker.getLatLng());
                        });

                    markerLayerGroup.addLayer(circleMarker);

                    // Store marker data in the array
                    markers.push({
                        lat,
                        lon,
                        color,
                        popupText: `<strong>${barangay.barangayName}:</strong><br>${text}: ${locationData[key]}`,
                    });
                }
            });

            interpret(updatedData, key, text);
        }, 500); // Delay of 500 milliseconds
    }
}

function interpret(data, key, text) {
    // Check if data is empty
    if (data.length === 0) {
        return `
            <div class="alert alert-warning" role="alert">
                No data available.
            </div>
        `;
    }

    // Retrieve the crop name from the first entry
    const cropName = data[0].cropName;

    // Aggregate the specified key by barangay
    const aggregatedData = aggregateProduction(data, key);

    // Filter out barangays with positive and zero values
    const productiveData = aggregatedData.filter((d) => d.total !== 0);
    const nonProductiveData = aggregatedData.filter((d) => d.total === 0);

    // Handle case where there is no productive data
    if (productiveData.length === 0) {
        return `
            <div class="alert alert-warning" role="alert">
                No productive data available for ${cropName}.
            </div>
        `;
    }

    // Sort the productive data in descending order by the specified key
    const sortedProductiveData = [...productiveData].sort(
        (a, b) => b.total - a.total
    );

    // Create data for the pie chart
    const pieLabels = sortedProductiveData.map((d) => d.barangay);
    const pieData = sortedProductiveData.map((d) => d.total);

    // Prepare the content for ranking and non-productive barangays
    const ranking = sortedProductiveData
        .map(
            (d, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: #f9f9f9;">
            <span>${index + 1}. ${d.barangay}</span>
            <span class="badge" style="background-color: #4CAF50; color: white;">${
                d.total
            }</span>
        </li>
    `
        )
        .join("");
    const nonProductiveText =
        nonProductiveData.length > 0
            ? `<p class="text-danger">Data not available for: ${nonProductiveData
                  .map((d) => d.barangay)
                  .join(", ")}.</p>`
            : "";

    // Set up the pie chart
    const chartCanvas = `
        <canvas id="pieChart" style="max-height: 50rem;"></canvas>
    `;

    // Create a Bootstrap styled output with chart and ranking
    let interpretation = `
        <div class="container">
            <h3 class="text-success" style="font-size: 1.8rem;">
                ${text.replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )} for <strong>${cropName}</strong>
            </h3>
            <p class="text-muted">
                This analysis is about ${cropName}'s performance in the barangay, aiding in resource allocation metrics and decision-making based on trends and growth rates.
            </p>

            <div class="row">
                <div class="col-md-8 mb-4">
                    <div class="card" style="background-color: #e9f5e9;">
                        <div class="card-body">
                            ${chartCanvas}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" style="background-color: #e0f7fa;">
                        <div class="card-header" style="background-color: #4CAF50; color: white;">
                            <h5 class="mb-0">Ranking</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            ${ranking}
                        </ul>
                        <div class="card-body">
                            ${nonProductiveText}
                        </div>
                    </div>
                </div>
            </div>
            <small class="text-muted">Note: Findings are based on available data only.</small>
        </div>
    `;

    // Render the content in the DOM
    $("#interpretation").html(interpretation);

    // Initialize the pie chart using Chart.js
    const ctx = document.getElementById("pieChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [
                {
                    label: `Total ${formatKey(key)}`,
                    data: pieData,
                    backgroundColor: generateColors(pieData.length), // Helper function to generate colors for each slice
                    borderColor: "#fff",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow the chart to resize based on the container
            plugins: {
                legend: {
                    position: "top",
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        },
                    },
                },
                // Data labels settings
                datalabels: {
                    color: "white", // Change datalabels color to white
                },
            },
        },
        plugins: [ChartDataLabels], // Register the plugin
    });

    printDataMap = {
        markers,
        interpretation,
        pieData,
        pieLabels,
        key,
    };
}

// Helper function to generate colors for the chart
function generateColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
    }
    return colors;
}

// Function to format the key
function formatKey(key) {
    // Add space before each uppercase letter
    const formattedKey = key.replace(/([A-Z])/g, " $1").trim();

    // Capitalize the first letter
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
}

// Function to aggregate any specified key by barangay
function aggregateProduction(data, key) {
    const aggregatedData = {};

    // Iterate through each data entry
    data.forEach((entry) => {
        const barangay = entry.barangay;
        const value = entry[key] || 0; // Use 0 if the value is undefined

        // Aggregate the specified key by barangay
        if (!aggregatedData[barangay]) {
            aggregatedData[barangay] = {
                barangay: barangay,
                total: 0,
            };
        }
        aggregatedData[barangay].total += value;
    });

    // Convert aggregatedData object back to an array
    return Object.values(aggregatedData);
}

// Function to update crop options based on type and season
async function updateCropOptions() {
    const type = $("#type").val().toLowerCase();
    const season = $("#season").val().toLowerCase();
    let options = "";

    try {
        // Check if the selected type is rice
        if (type === "rice") {
            options = '<option value="rice">Rice</option>'; // Only option for rice
        } else {
            const uniqueCropNames = await getUniqueCropNames(season, type);

            options =
                uniqueCropNames.length > 0
                    ? uniqueCropNames
                          .map(
                              (cropName) =>
                                  `<option value="${cropName}">${
                                      cropName.charAt(0).toUpperCase() +
                                      cropName.slice(1)
                                  }</option>`
                          )
                          .join("")
                    : '<option value="">No crops available</option>';
        }
    } catch (error) {
        console.error("Failed to update crop options:", error);
        options = '<option value="">Error loading crops</option>';
    }

    $("#crop").html(options);
}

// Handle category change and display results
async function handleCategoryChange() {
    const season = $("#season").val();
    const type = $("#type").val();
    const crop = $("#crop").val();
    const category = $("#category").val();

    console.log(crop);

    // Check if any crop is selected
    if (!crop) {
        console.log(true);
        $(".available").hide();
        $("#unavailable").show();
        $("#interpretation").hide();
        return; // Exit the function if no crop is selected
    } else {
        console.log(false);
    }

    let categoryText,
        dataset = [],
        data = [],
        key,
        yearRange,
        text;
    yearRange = await getYearRange();
    downloadYR = yearRange;
    switch (category) {
        case "area_planted":
            key = "areaPlanted";
            if (crop === "rice") {
                data = await getRiceProduction(crop, season);
                console.log(data);
            } else {
                data = await getProduction(crop, season);
            }

            categoryText = `Area Planted Per Barangay (${yearRange})`;
            dataset = stats.countAverageAreaPlantedBarangay(data);
            text = "area planted";
            break;
        case "production_volume":
            key = "volumeProductionPerHectare";
            if (crop === "rice") {
                data = await getRiceProduction(crop, season);
                console.log(data);
            } else {
                data = await getProduction(crop, season);
            }
            categoryText = `Production Volume per Hectare Per Barangay (${yearRange})`;
            dataset = stats.averageVolumeProductionBarangay(data);
            text = "production volume per hectare";
            break;
        case "pest_occurrence":
            key = "pestOccurrence";
            data = await getPest(crop, season);
            categoryText = `Pest Occurrence Per Barangay (${yearRange})`;
            dataset = stats.countPestOccurrenceBarangay(data);
            text = "pest occurrence";
            break;
        case "disease_occurrence":
            key = "diseaseOccurrence";
            data = await getDisease(crop, season);
            categoryText = `Disease Occurrence Per Barangay (${yearRange})`;
            dataset = stats.countDiseaseOccurrenceBarangay(data);
            text = "disease occurrence";
            break;
        case "price_income_per_hectare":
            key = "incomePerHectare";
            data = await getProduction(crop, season);
            categoryText = `Price Income per Hectare Per Barangay (${yearRange})`;
            dataset = stats.priceIncomePerHectareBarangay(data);
            text = "price income per hectare";
            break;
        case "profit_per_hectare":
            key = "profitPerHectare";
            data = await getProduction(crop, season);
            categoryText = `Profit per Hectare Per Barangay (${yearRange})`;
            dataset = stats.profitPerHectareBarangay(data);
            text = "profit per hectare";
            break;
        case "damages":
            categoryText = `Damages Report (${yearRange})`;
            key = "damagePercentage";
            data = await getDamages(crop, season);
            dataset = stats.calculateDamagePerBarangay(data);
            text = "damage percentage";
            console.log(dataset);
            break;
        default:
            categoryText = "Category not recognized";
    }

    if (dataset.length !== 0 && crop !== null) {
        $("#unavailable").hide();
        $(".available").show();
        $("#interpretation").show();
        const mt = new MapTrends(season, type, crop, categoryText);
        mt.displayMapTrends(barangays, dataset, key, categoryText, text);
        currentType = key;
    } else {
        $(".available").hide();
        $("#interpretation").hide();
        $("#unavailable").show();
    }

    downloadData = dataset;
    // Dynamically get the required fields from the first index of downloadData
    const requiredFields = downloadData[0] ? Object.keys(downloadData[0]) : [];

    // Function to check if a data object is complete
    function isDataComplete(data) {
        return requiredFields.every((field) => data.hasOwnProperty(field));
    }

    // Filter out incomplete data from downloadData
    downloadData = downloadData.filter(isDataComplete);
}

function populateCategoryOptions(type) {
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = ""; // Clear existing options

    // Define all options
    const options = {
        production_volume: "Average Production Volume",
        price_income_per_hectare: "Average Income",
        profit_per_hectare: "Average Profit",
        area_planted: "Average Area Planted",
        price: "Average Price",
        pest_occurrence: "Pest Occurrence",
        disease_occurrence: "Disease Occurrence",
        damages: "Damages Report",
    };

    // Filter options based on type
    let allowedOptions;
    if (type === "Rice") {
        allowedOptions = ["production_volume", "area_planted"];
    } else {
        allowedOptions = Object.keys(options); // Include all for vegetables and fruits
    }

    // Populate the dropdown
    allowedOptions.forEach((optionKey) => {
        const optionElement = document.createElement("option");
        optionElement.value = optionKey;
        optionElement.textContent = options[optionKey];
        categorySelect.appendChild(optionElement);
    });
}

// Initialize with default crop options and attach event listeners
$(document).ready(async function () {
    await initializeGlobalMap();
    await initializeBarangays();
    await updateCropOptions();
    await handleCategoryChange();

    // Attach event listener to #type element
    $("#type").on("change", function () {
        const selectedType = $(this).val();
        populateCategoryOptions(selectedType);
        updateCropOptions().then(() => handleCategoryChange());
    });

    // Attach event listener to #season element
    $("#season").on("change", function () {
        updateCropOptions().then(() => handleCategoryChange());
    });

    $("#category, #crop").on("change", handleCategoryChange);

    $(document).ready(function () {
        $(".download-btn").click(function () {
            // Call the downloadDialog method and handle the promise
            Dialog.downloadDialog()
                .then((format) => {
                    console.log(format); // This will log the format (e.g., 'csv', 'xlsx', or 'pdf')
                    download(format, currentType, downloadData);
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle any errors that occur
                });
        });
    });
});

// Parse latitude and longitude from coordinate string
function getLatLon(coordinate) {
    const [lat, lon] = coordinate.split(",").map(parseFloat);
    return { lat, lon };
}

async function download(format, type, data) {
    const filename = `${type.toLowerCase()}.${format}`;

    if (format === "csv") {
        downloadCSV(data);
    } else if (format === "xlsx") {
        downloadExcel(data);
    } else if (format === "pdf") {
        downloadPDF(filename);
    }
}

function formatHeader(key) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatWithPesoSign(key, value) {
    const keysToFormat = [
        "incomePerHectare",
        "profitPerHectare",
        "price",
        "totalIncome",
        "totalProductionCost",
    ];

    // Check if the key is one of the keys that require formatting
    if (keysToFormat.includes(key)) {
        return value ? `₱${parseFloat(value).toFixed(2)}` : "";
    }

    // If the key does not require formatting, return the original value
    return value;
}

function downloadCSV(data) {
    // Ensure there is data to process
    if (!data || data.length === 0) {
        console.error("No data available to download.");
        return;
    }

    // Helper function to escape CSV values
    function escapeCSVValue(value) {
        if (value === undefined || value === null) return "";
        if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
            value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }

    // Extract all keys from the first data object for headers
    const headersToInclude = Object.keys(data[0]);

    // ======= CSV DATA SECTION =======
    const csvData = [
        headersToInclude.join(","), // Use the keys directly as headers
        ...data.map((row) =>
            headersToInclude
                .map((key) => {
                    const value = row[key];

                    // Use the formatWithPesoSign function to handle peso formatting for specific columns
                    const formattedValue = formatWithPesoSign(key, value);

                    // If the value is not formatted by the peso function, escape it for CSV
                    return formattedValue || escapeCSVValue(value);
                })
                .join(",")
        ),
    ].join("\n");

    // Create the new filename
    const filename = `Map Trends Crops Data Barangay.csv`;

    // Create CSV download
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download = filename; // Use the new filename format
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addDownload(filename, "CSV");
}

function downloadExcel(data) {
    // Ensure there is data to process
    if (!data || data.length === 0) {
        console.error("No data available to download.");
        return;
    }

    // Extract all keys from the first data object for headers
    const headersToInclude = Object.keys(data[0]);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Define header and data style
    const headerStyle = {
        font: {
            name: "Calibri",
            size: 12,
            bold: true,
            color: { argb: "FFFFFFFF" }, // White color
        },
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "B1BA4D" }, // Green fill color
        },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } }, // Black border
            right: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
        },
    };

    // Create a single worksheet for the data
    const worksheet = workbook.addWorksheet("Map Trends Crops Data");
    worksheet.addRow(["Crops Data"]).font = { bold: true }; // Title Row

    // Create header row and apply header style
    const headerRow = worksheet.addRow(headersToInclude);
    headerRow.eachCell((cell) => {
        cell.style = headerStyle; // Apply header style
    });

    // Populate the worksheet with data rows
    data.forEach((row) => {
        const rowData = headersToInclude.map((key) => {
            const value = row[key];

            // Use the formatWithPesoSign function to format specific columns with a peso sign
            return formatWithPesoSign(key, value) || value; // Fallback to original value if no formatting is needed
        });
        const dataRow = worksheet.addRow(rowData); // Add data row

        // Apply data cell styles
        dataRow.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });
    });

    // Set column widths
    worksheet.columns.forEach((column) => {
        column.width = 20; // Set all columns to a width of 20
    });

    // Create the new filename
    const filename = `Map Trends Crops Data Barangay.xlsx`;

    // Write the workbook and trigger the download
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    addDownload(filename, "XLSX");
}

function downloadPDF(filename) {
    console.log(printDataMap);

    // Store data in sessionStorage
    sessionStorage.setItem("printDataMap", JSON.stringify(printDataMap));

    // Open print page without printing
    const printWindow = window.open("/print-map-trends", "_blank");

    // Add download functionality (assuming addDownload is defined elsewhere)
    addDownload(filename, "PDF");
}
