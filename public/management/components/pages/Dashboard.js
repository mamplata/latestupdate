import {
    getCrop,
    getProduction,
    getPrice,
    getPest,
    getDisease,
    getUniqueCropNames,
    getRiceProduction,
    getBarangayCount,
    getConcernCount,
    getDataEntriesCount,
    getRecordCount,
    getUserCount,
    getDownloadCount,
    getFarmerCount,
} from "../../../js/fetch.js";
import * as stats from "../../../js/statistics.js";
import { user } from "../HeaderSidebar.js";

export default function initDashboard() {
    $(document).ready(function () {
        // Generate the dashboard HTML with styles included
        var dashboardHtml = `
    <style>
       thead #dashboardTable {
          background-color: #fff !important;
       }
      .card-box {
        border-radius: 1em;
        margin-bottom: 2em;
        color: white;
        cursor: pointer; /* Pointer cursor for indicating clickability */
      }
      .card-box .card-body {
        font-size: 3em;
        font-weight: bold;
        color: black;
        display: flex;
        align-items: center;
        justify-content: around;
        flex-direction: column;
      }
      
      .card-header {
        background-color: #baa863;
        color: black;
        margin-bottom: 1em;
        font-size: 1.5em;
        text-align: center;
      }
      .card-box a {
        color: white;
        text-decoration: none;
      }
      .equal-height {
        display: flex;
        align-items: stretch;
      }
      .equal-height > div {
        display: flex;
        flex-direction: column;
      }
      .form-row > .form-group {
        margin-right: 0.5em;
        margin-left: 0.5em;
      }
      #available {
        text-align: center;
      }
      .underline-link {
        text-decoration: underline;
        color: #000; /* Color for links */
        font-weight: bold; /* Make the link text bold */
        font-style: italic; /* Italicize the link text */
        transition: color 0.3s, text-decoration-color 0.3s; /* Smooth transition for color changes */
      }
      .underline-link:hover {
        color: #333; /* Darker shade on hover */
        text-decoration-color: #555; /* Change underline color on hover */
        text-decoration-thickness: 2px; /* Make underline thicker on hover */
      }
      .underline-link:active {
        color: #e64a19; /* Even darker shade on active */
      }

      .form-control {
          padding-left: 20px;
          background-color: #B1BA4D;
          border-radius: 5px;
          text-align: center;
          color: #fff;
          font-weight: 600;
      }
    </style>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Dashboard</h1>
    </div>
    <div class="row d-flex justify-content-center">`;

        if (user.role === "admin") {
            dashboardHtml += `
        <div class="col-md-3">
          <div class="card card-box" data-link="#manage-users">
            <div class="card-header">Users</div>
            <div class="card-body">
              <p id="users-count">0</p>
            </div>
          </div>
        </div>`;
        }

        dashboardHtml += `
      <div class="col-md-3">
        <div class="card card-box" data-link="#maintenance" data-value="farmer">
         <div class="card-header">Farmers</div>
          <div class="card-body">
            <p id="farmers-count">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-box" data-link="#maintenance" data-value="barangay">
         <div class="card-header">Barangays</div>
          <div class="card-body">
            <p id="barangays-count">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-box" data-link="#maintenance" data-value="production">
        <div class="card-header">Records</div>
          <div class="card-body">
            <p id="records-count">0</p>
          </div>
        </div>
      </div>
    `;

        // Append new cards for Data Entries, Downloads, and Concerns only if user is admin
        if (user.role === "admin") {
            dashboardHtml += ` 
        <div class="col-md-3">
          <div class="card card-box" data-link="#data-entries">
          <div class="card-header">Data Entries</div>
            <div class="card-body">
              <p id="data-entries-count">0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-box no-link">
          <div class="card-header">Downloads</div>
            <div class="card-body">
              <p id="downloads-count">0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-box" data-link="#concerns">
          <div class="card-header">Concerns</div>
            <div class="card-body">
              <p id="concerns-count">0</p>
            </div>
          </div>
        </div>
    `;
        }

        dashboardHtml += `
      <div class="container-fluid mt-4">
        <div class="row">
          <div class="col-md-8">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <form class="form-row mb-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="season">Season</label>
                      <select id="season" class="form-control">
                        <option value="dry">Dry</option>
                        <option value="wet">Wet</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="type">Type</label>
                      <select id="type" class="form-control">
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="rice">Rice</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="crop">Crop</label>
                      <select id="crop" class="form-control">
                        <!-- Options will be dynamically added here -->
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="category">Category</label>
                      <select id="category" class="form-control">
                        <option value="usage_level">Production Usage Level</option>
                        <option value="production_volume">Average Production Volume</option>
                        <option value="price_income_per_hectare">Average Income</option>
                        <option value="profit_per_hectare">Average Profit</option>
                        <option value="area_planted">Average Area Planted</option>
                        <option value="price">Average Price</option>
                        <option value="pest_occurrence">Pest Occurrence</option>
                        <option value="disease_occurrence">Disease Occurrence</option>
                      </select>
                    </div>
                  </div>
                </form>
                <div class="row justify-content-center">
                  <div id="available" class="col y-trend text-center">
                    <canvas id="totalPerYearChart"></canvas>
                  </div>
                  <div id="unavailable" class="col text-center mb-5 d-none">
                    <p class="h4">We're sorry, but there is no data available at the moment.</p>
                  </div>
                </div>
             <div class="text-center mt-3">
              <a id="trendCropsA" href="../seasonal-trends" class="btn cta-btn w-100" target="_blank">
                <i class="fas fa-chart-line"></i> View Seasonal Trends
              </a>
              </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="form-group">
                  <label for="seasonSelect">Season</label>
                  <select class="form-control" id="seasonSelect">
                    <option value="Dry">Dry</option>
                    <option value="Wet">Wet</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="typeSelect">Type</label>
                  <select class="form-control" id="typeSelect">
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card shadow-sm">
              <div class="card-body p-2">
                <table class="table table-bordered table-striped table-hover table-sm" id="cropsTable">
                  <thead>
                    <tr id="dashboardTable">
                      <th colspan="2">
                        <a id="topCropsA" href="../top-crops" class="btn cta-btn w-100" target="_blank">
                          <i class="fas fa-seedling"></i> View Seasonal Top Crops
                        </a>
                      </th>
                    </tr>
                    <tr>
                      <th>Commodity</th>
                      <th>Variety</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Table rows will be dynamically added here -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;

        // Set the HTML content
        $("#main-content").html(dashboardHtml);
    });

    function populateCategoryOptions(type) {
        const categorySelect = document.getElementById("category");
        categorySelect.innerHTML = ""; // Clear existing options

        // Define all options
        const options = {
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

        // Filter options based on type
        let allowedOptions;
        if (type === "rice") {
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

    // Document ready function
    $(document).ready(async function () {
        initializeDashboard();

        // Function to adjust card heights
        function adjustCardHeights() {
            const rows = document.querySelectorAll(".row"); // Assuming the cards are inside .row containers

            rows.forEach((row) => {
                let maxHeight = 0;
                const cards = row.querySelectorAll(".card-box");

                // Find the maximum height
                cards.forEach((card) => {
                    maxHeight = Math.max(maxHeight, card.offsetHeight);
                });

                // Set all cards in the row to the maximum height
                cards.forEach((card) => {
                    card.style.height = maxHeight + "px";
                });
            });
        }

        // Adjust heights on load
        adjustCardHeights();

        // Adjust heights whenever the window is resized
        window.addEventListener("resize", adjustCardHeights);
        updateCropOptions().then(() => handleCategoryChange());

        // Attach event listener to #type element
        $("#type").on("change", function () {
            const selectedType = $(this).val();
            populateCategoryOptions(selectedType);
        });

        // Attach event listener to #type element
        $("#type").on("change", function () {
            updateCropOptions().then(() => handleCategoryChange());
        });

        // Attach event listener to #season element
        $("#season").on("change", function () {
            updateCropOptions().then(() => handleCategoryChange());
        });
        $("#category, #crop, #season").on("change", function () {
            handleCategoryChange();
        });
    });

    async function initializeDashboard() {
        try {
            const isAgriculturist = user.role === "agriculturist"; // Check if the user role is agriculturist

            // If the user is agriculturist, only fetch necessary data
            const dataToFetch = [
                isAgriculturist ? getBarangayCount() : getFarmerCount(),
                isAgriculturist ? getFarmerCount() : getBarangayCount(),
                getRecordCount(),
            ];

            const results = await Promise.allSettled(dataToFetch);

            // Destructure results for easier handling
            const [barangaysResult, farmersResult, recordsResult] = results;

            // Initialize dashboard data with default values
            const dashboardData = {
                users: 0,
                farmers: 0,
                barangays: 0,
                records: 0,
                dataEntries: 0,
                downloads: 0,
                concerns: 0,
            };

            // Helper function to extract value or set default
            const getValue = (result, defaultValue = 0) => {
                return result.status === "fulfilled"
                    ? result.value
                    : defaultValue;
            };

            // Populate dashboardData with fetched values or defaults
            dashboardData.barangays = getValue(
                barangaysResult,
                dashboardData.barangays
            );
            dashboardData.farmers = getValue(
                farmersResult,
                dashboardData.farmers
            );
            dashboardData.records = getValue(
                recordsResult,
                dashboardData.records
            );

            // Optionally, log or handle any rejected promises
            results.forEach((result, index) => {
                if (result.status === "rejected") {
                    console.warn(
                        `Fetch operation ${index + 1} failed:`,
                        result.reason
                    );
                    // You can display error messages or take other actions here
                }
            });

            // Update dashboard with the fetched data
            $("#farmers-count").text(dashboardData.farmers);
            $("#barangays-count").text(dashboardData.barangays);
            $("#records-count").text(dashboardData.records);

            // If the user is not agriculturist, fetch additional data
            if (!isAgriculturist) {
                const additionalResults = await Promise.allSettled([
                    getUserCount(),
                    getConcernCount(),
                    getDataEntriesCount(),
                    getDownloadCount(),
                ]);

                const [
                    usersResult,
                    concernsResult,
                    dataEntriesResult,
                    downloadResult,
                ] = additionalResults;

                // Populate remaining dashboardData with fetched values or defaults
                dashboardData.users = getValue(
                    usersResult,
                    dashboardData.users
                );
                dashboardData.concerns = getValue(
                    concernsResult,
                    dashboardData.concerns
                );
                dashboardData.dataEntries = getValue(
                    dataEntriesResult,
                    dashboardData.dataEntries
                );
                dashboardData.downloads = getValue(
                    downloadResult,
                    dashboardData.downloads
                );

                // Update additional data on dashboard
                $("#users-count").text(dashboardData.users);
                $("#data-entries-count").text(dashboardData.dataEntries);
                $("#downloads-count").text(dashboardData.downloads);
                $("#concerns-count").text(dashboardData.concerns);
            }

            if (user.role === "admin") {
                $(".card-box").click(function () {
                    // Check if the card has the no-link class
                    if (!$(this).hasClass("no-link")) {
                        var link = $(this).data("link");
                        var optionValue = $(this).data("value"); // Get the value from data-value attribute

                        if (link) {
                            // Define the value for fromDashboard
                            if (link === "#maintenance") {
                                var fromDashboard = true;
                                // Store values in sessionStorage
                                sessionStorage.setItem(
                                    "fromDashboard",
                                    fromDashboard
                                );
                                sessionStorage.setItem(
                                    "optionValue",
                                    optionValue
                                );
                            }

                            // Perform the redirection
                            window.location.href = link;
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error initializing dashboard:", error);
        }
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

    // Function to handle category change and display results
    async function handleCategoryChange() {
        const season = $("#season").val();
        const type = $("#type").val();
        const crop = $("#crop").val();
        const category = $("#category").val();

        let categoryText;
        let dataset = [];
        let data = [];
        let key = [];

        try {
            switch (category) {
                case "usage_level":
                    categoryText = "Production Usage Level (%)";
                    key = ["usageLevel", "totalProduction", "totalSold"];
                    data = await getProduction(crop, season);
                    dataset = stats.UsageLevelFrequency(data);
                    break;
                case "area_planted":
                    categoryText = "Area Planted (Hectare)";
                    key = ["areaPlanted"];
                    if (crop === "rice") {
                        data = await getRiceProduction(crop, season);
                        console.log(data);
                    } else {
                        data = await getProduction(crop, season);
                    }

                    dataset = stats.countAverageAreaPlanted(data);
                    break;
                case "production_volume":
                    categoryText = "Production Volume Per Hectare";
                    key = [
                        "volumeProductionPerHectare",
                        "totalVolume",
                        "totalArea",
                    ];
                    if (crop === "rice") {
                        data = await getRiceProduction(crop, season);
                        console.log(data);
                    } else {
                        data = await getProduction(crop, season);
                    }
                    dataset = stats.averageVolumeProduction(data);
                    console.log(dataset);
                    break;
                case "price":
                    categoryText = "Price";
                    key = ["price"];
                    data = await getPrice(crop, season);
                    dataset = stats.averagePrice(data);
                    break;
                case "pest_occurrence":
                    categoryText = "Pest Occurrence";
                    key = [
                        "totalOccurrence",
                        "pestOccurrences",
                        "totalAffected",
                        "totalPlanted",
                        "percentage",
                    ];
                    data = await getPest(crop, season);
                    dataset = stats.countPestOccurrence(data);
                    console.log(dataset);
                    break;
                case "disease_occurrence":
                    categoryText = "Disease Occurrence";
                    key = ["totalOccurrence", "diseaseOccurrences"];
                    data = await getDisease(crop, season);
                    dataset = stats.countDiseaseOccurrence(data);
                    break;
                case "price_income_per_hectare":
                    categoryText = "Price Income per Hectare";
                    key = ["incomePerHectare", "totalArea", "totalIncome"];
                    data = await getProduction(crop, season);
                    dataset = stats.priceIncomePerHectare(data);
                    console.log(dataset);
                    break;
                case "profit_per_hectare":
                    categoryText = "Profit per Hectare";
                    key = [
                        "profitPerHectare",
                        "totalArea",
                        "totalIncome",
                        "totalProductionCost",
                    ];
                    data = await getProduction(crop, season);
                    dataset = stats.profitPerHectare(data);
                    break;
                case "damages":
                    categoryText = "Damages Report";
                    key = [
                        "averageYieldLoss",
                        "totalFarmers",
                        "totalAreaAffected",
                        "totalGrandValue",
                    ];
                    data = await getDamages(crop, season);
                    dataset = stats.calculateDamages(data);
                    break;
                default:
                    categoryText = "Category not recognized";
            }

            // Clear the previous chart before generating a new one
            if (dataset.length !== 0) {
                $("#unavailable").hide();
                $("#available").show();
                const charts = generateTrends(dataset, categoryText, key);
                displayTrends(charts);
            } else {
                $("#available").hide();
                $("#unavailable").show();
            }
        } catch (error) {
            console.error("Error handling category change:", error);
        }
    }

    // Function to generate trends based on dataset
    function generateTrends(dataset, label, keys) {
        if (!dataset.length) {
            return { lineChartConfig: null }; // Return null configurations if the dataset is empty
        }

        // Extract unique seasons and years
        const uniqueSeasons = [
            ...new Set(dataset.map((entry) => entry.season)),
        ];
        const season = uniqueSeasons[0] || "Unknown"; // Use the first season from the dataset
        const uniqueYears = [
            ...new Set(dataset.map((entry) => entry.monthYear.split(" ")[1])),
        ].sort((a, b) => a - b);

        // Calculate averages per year for the bar chart
        const totalsPerYear = uniqueYears.map((year) => {
            // Filter entries for the current year
            const filteredEntries = dataset.filter((entry) =>
                entry.monthYear.endsWith(year)
            );

            // Calculate the sum and count of entries for each key
            const averages = keys.map((key) => {
                if (key === "totalOccurrence") {
                    // Calculate the total occurrences for the chart
                    const { sum, count } = filteredEntries.reduce(
                        (acc, entry) => {
                            acc.sum += entry[key] || 0; // Ensure we handle undefined or null values
                            acc.count += 1;
                            return acc;
                        },
                        { sum: 0, count: 0 }
                    );

                    // Return the average for total occurrences
                    return count > 0 ? sum / count : 0;
                } else if (key === "pestOccurrences") {
                    // Create a summary for pest occurrences
                    const occurrencesSummary = filteredEntries.flatMap(
                        (entry) =>
                            entry[key].map(
                                (item) => `${item.pestName}: ${item.occurrence}`
                            ) // Format occurrence
                    );

                    return occurrencesSummary.length > 0
                        ? occurrencesSummary.join(", ")
                        : "None"; // Return summary or "None"
                } else if (key === "diseaseOccurrences") {
                    // Create a summary for disease occurrences
                    const occurrencesSummary = filteredEntries.flatMap(
                        (entry) =>
                            entry[key].map(
                                (item) =>
                                    `${item.diseaseName}: ${item.occurrence}`
                            ) // Format occurrence
                    );

                    return occurrencesSummary.length > 0
                        ? occurrencesSummary.join(", ")
                        : "None"; // Return summary or "None"
                }

                // Calculate the sum and count for other numeric keys
                const { sum, count } = filteredEntries.reduce(
                    (acc, entry) => {
                        acc.sum += entry[key] || 0; // Ensure we handle undefined or null values
                        acc.count += 1;
                        return acc;
                    },
                    { sum: 0, count: 0 }
                );

                // Return the average for the current key
                return count > 0 ? sum / count : 0;
            });

            return averages; // Return an array of averages for each key
        });

        // Prepare data for the bar chart using the first key (totalOccurrence)
        const barChartData = {
            labels: uniqueYears,
            datasets: [
                {
                    label: "Total Occurrences", // Fixed label for total occurrences
                    data: totalsPerYear.map((yearTotals) => yearTotals[0] || 0), // Use the totalOccurrence's totals
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    borderWidth: 1,
                },
            ],
        };

        // Configure bar chart options
        const barChartConfig = {
            type: "bar",
            data: barChartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: `${label} Per Year (${season} Season)`,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const index = tooltipItem.dataIndex;
                                const year = uniqueYears[index];
                                const averages = totalsPerYear[index];

                                // Initialize the return array with the total occurrence message
                                const tooltipLabels = [
                                    `Average Total Occurrence for ${year}: ${averages[0].toFixed(
                                        2
                                    )}`, // Always include total occurrences
                                ];

                                const currentKey = keys[1]; // Get the current key being processed

                                // Check which key is being processed
                                if (currentKey === "pestOccurrences") {
                                    tooltipLabels.push(
                                        `Pest Occurrences: ${
                                            averages[1] || "None"
                                        }`
                                    ); // Show pest occurrences
                                } else if (
                                    currentKey === "diseaseOccurrences"
                                ) {
                                    tooltipLabels.push(
                                        `Disease Occurrences: ${
                                            averages[1] || "None"
                                        }`
                                    ); // Show disease occurrences
                                } else {
                                    // For other keys, simply add their average values
                                    keys.forEach((key, idx) => {
                                        if (key !== currentKey) {
                                            // Avoid including the current key
                                            tooltipLabels.push(
                                                `Average ${key}: ${
                                                    averages[idx]
                                                        ? averages[idx].toFixed(
                                                              2
                                                          )
                                                        : "None"
                                                }`
                                            );
                                        }
                                    });
                                }

                                return tooltipLabels; // Return the constructed labels array for the tooltip
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Year",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: label,
                        },
                    },
                },
            },
        };

        return {
            barChartConfig,
        };
    }
    // Function to display trends on the chart
    function displayTrends(chartConfigs) {
        const bar = Chart.getChart("totalPerYearChart");
        if (bar) {
            bar.destroy();
        }

        if (chartConfigs.barChartConfig) {
            // Set responsive options for the chart
            const options = {
                responsive: true,
                maintainAspectRatio: false,
            };

            // Merge the existing chart configuration with the new options
            const combinedConfig = {
                ...chartConfigs.barChartConfig,
                options: {
                    ...chartConfigs.barChartConfig.options, // Retain existing options if any
                    ...options, // Add new options
                },
            };

            // Create the new chart instance with the combined configuration
            new Chart(
                document.getElementById("totalPerYearChart"),
                combinedConfig
            );
        }
    }

    async function initializeCrops() {
        try {
            return await getCrop();
        } catch (error) {
            console.error("Failed to initialize crops:", error);
        }
    }

    class TopCrops {
        constructor(season, type) {
            this.season = season;
            this.type = type;
            this.initialize();
        }

        async initialize() {
            try {
                let cropData = await this.fetchCropData();
                const topCrops = this.generateTopCrops(cropData);
                this.displayTopCrops(topCrops);
            } catch (error) {
                console.error("Failed to initialize TopCrops:", error);
            }
        }

        async fetchCropData() {
            try {
                return await main(this.season, this.type);
            } catch (error) {
                console.error("Failed to fetch crop data:", error);
            }
        }

        generateTopCrops(cropData) {
            if (!Array.isArray(cropData)) {
                console.error("Expected input to be an array");
                return [];
            }

            // Define the weights for each metric (adjust these based on importance)
            const weights = {
                plantedWeight: 0.35,
                volumeWeight: 0.35,
                priceWeight: 0.1,
                pestWeight: -0.05, // Negative weight since higher pest occurrence is bad
                diseaseWeight: -0.05, // Negative weight since higher disease occurrence is bad
                incomeWeight: 0.1,
                profitWeight: 0.1,
            };

            // Process each crop entry
            const processedCrops = cropData.map((item) => {
                // Calculate composite score based on total values
                const compositeScore =
                    item.totalArea * weights.plantedWeight +
                    item.totalVolume * weights.volumeWeight +
                    item.price * weights.priceWeight +
                    item.pestOccurrence * weights.pestWeight +
                    item.diseaseOccurrence * weights.diseaseWeight +
                    item.totalIncome * weights.incomeWeight +
                    item.totalProfit * weights.profitWeight;

                return {
                    cropName: item.cropName,
                    variety: item.variety || "",
                    compositeScore: compositeScore,
                };
            });

            // Sort crops by composite score in descending order
            const sortedCrops = processedCrops.sort(
                (a, b) => b.compositeScore - a.compositeScore
            );

            // Optionally, filter or slice to get the top N crops
            return sortedCrops.slice(0, 5);
        }

        displayTopCrops(data) {
            const tableBody = $("#cropsTable tbody");
            tableBody.empty(); // Clear existing rows

            data.forEach((crop) => {
                const row = `<tr>
                <td>${crop.cropName}</td>
                <td>${crop.variety}</td>                
            </tr>`;
                tableBody.append(row);
            });
        }
    }

    $(document).ready(function () {
        new TopCrops("Dry", "Vegetables");

        $("#seasonSelect, #typeSelect").on("change", function () {
            const season = $("#seasonSelect").val();
            const type = $("#typeSelect").val();
            new TopCrops(season, type);
        });
    });

    async function main(season, type) {
        try {
            let crops = await initializeCrops();
            let production = await getProduction("", season);
            let price = await getPrice("", season);
            let pest = await getPest("", season);
            let disease = await getDisease("", season);

            production = production.map((entry) => ({ ...entry, type }));
            price = price.map((entry) => ({ ...entry, type }));
            pest = pest.map((entry) => ({ ...entry, type }));
            disease = disease.map((entry) => ({ ...entry, type }));

            return await stats.getCropData(
                production,
                price,
                pest,
                disease,
                crops,
                type
            );
        } catch (error) {
            console.error("An error occurred in the main function:", error);
        }
    }
}
