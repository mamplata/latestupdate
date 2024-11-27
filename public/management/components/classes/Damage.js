import Dialog from "../helpers/Dialog.js";
import { addDownload, getYearRange } from "../../../js/fetch.js";
let damages = [];

class Damage {
    constructor(
        recordId,
        barangay,
        cropName,
        variety,
        numberOfFarmers,
        areaAffected,
        yieldLoss,
        grandTotalValue,
        season,
        monthYear
    ) {
        this.recordId = recordId;
        this.barangay = barangay;
        this.cropName = cropName;
        this.variety = variety;
        this.numberOfFarmers = numberOfFarmers;
        this.areaAffected = areaAffected;
        this.yieldLoss = yieldLoss;
        this.grandTotalValue = grandTotalValue;
        this.season = season;
        this.monthYear = monthYear;
    }

    async addDamage(damages) {
        function chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        }

        const batchSize = 20; // Size of each batch
        const totalRows = damages.length;
        const damageBatches = chunkArray(damages, batchSize);

        let processedRows = 0; // Keep track of the number of processed rows

        // Function to update progress message
        const updateProgressMessage = (start, end) => {
            $("#progressMessage").text(
                `Uploading ${start}-${end}/${totalRows}`
            );
        };

        // Show the loader and disable user interaction
        $("#loader").show();
        $("body").addClass("no-scroll"); // Optional: Add a class to disable scrolling

        for (const [index, batch] of damageBatches.entries()) {
            const start = processedRows + 1;
            const end = start + batch.length - 1;
            updateProgressMessage(start, end);

            try {
                await $.ajax({
                    url: "/api/damages-batch",
                    method: "POST",
                    data: {
                        damageData: batch, // Custom key for data
                        _token: $('meta[name="csrf-token"]').attr("content"),
                    },
                });

                processedRows += batch.length;
            } catch (xhr) {
                console.error(
                    `Error sending batch ${index + 1}:`,
                    xhr.responseText
                );
                // Optionally handle the error or retry
            }
        }

        // Hide the loader and re-enable user interaction
        $("#loader").hide();
        $("body").removeClass("no-scroll"); // Remove the class to re-enable scrolling
        toastr.success("Damage data uploaded successfully!", "Success", {
            timeOut: 5000, // 5 seconds
            positionClass: "toast-top-center",
            toastClass: "toast-success-custom",
        });

        getDamages(); // Call to refresh the damages data
    }

    updateDamage(updatedDamage) {
        const existingDamage = damages.find(
            (p) => p.recordId === updatedDamage.recordId
        );

        if (
            existingDamage &&
            existingDamage.recordId !== updatedDamage.recordId
        ) {
            alert("Damage ID already exists");
            return;
        }

        damages = damages.map((damage) =>
            damage.recordId === updatedDamage.recordId
                ? { ...damage, ...updatedDamage }
                : damage
        );

        fetch(`/api/damages/${updatedDamage.recordId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDamage),
        })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
                console.error("Error:", error);
            });
        getDamages();
    }

    removeDamage(damages) {
        $.ajax({
            url: "/api/damagesByRecords",
            method: "DELETE",
            data: {
                damageData: damages, // Custom key for data
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {},
            error: function (xhr) {
                console.error(xhr.responseText);
            },
        });
        getDamages();
    }
}

function getDamages() {
    // Fetch damages from Laravel backend
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $.ajax({
        url: "/api/damages",
        method: "GET",
        success: function (response) {
            // Assuming response is an array of damages [{...fields...}, ...]
            damages = response;
        },
        error: function (xhr, status, error) {
            console.error("Error fetching damages:", error);
        },
    });
}

function initializeMethodsDamage() {
    $(document).ready(function () {
        // Function to display damages
        var pageSize = 5;
        var currentPage = 1;
        async function displayDamage(searchTerm = null) {
            // Simulate a delay of 1 second (optional, can be removed if not needed)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Clear the table body
            $("#damageTableBody").empty();

            // Construct query parameters for pagination and search
            let query = `?page=${currentPage}&pageSize=${pageSize}`;
            if (searchTerm) {
                query += `&search=${encodeURIComponent(searchTerm)}`;
            }

            // Fetch damage data from the server
            try {
                const response = await fetch(`/api/damages${query}`);
                const data = await response.json();

                // Check if there are results
                if (data.data && data.data.length > 0) {
                    data.data.forEach(function (damage) {
                        // Append each row to the table body
                        $("#damageTableBody").append(`
                  <tr data-index=${damage.damageId}>
                      <td>${damage.barangay}</td>
                      <td>${damage.cropName}</td>
                      <td>${damage.variety}</td>
                      <td>${damage.numberOfFarmers}</td>
                      <td>${damage.areaAffected}</td>
                      <td>${(damage.yieldLoss * 100).toFixed(2)}%</td>
                      <td>₱${damage.grandTotalValue}</td>
                      <td>${damage.season}</td>
                      <td>${damage.monthYear}</td>
                  </tr>
              `);
                    });
                } else {
                    // If no results found, display a message
                    $("#damageTableBody").append(`
              <tr>
                  <td colspan="9">No results found!</td>
              </tr>
          `);
                }

                // Update pagination info
                const totalPages = data.last_page || 1; // Total pages from API response
                $("#paginationInfo").text(`${data.current_page}/${totalPages}`);

                // Enable/disable pagination buttons based on the current page
                $("#firstBtn").prop("disabled", data.current_page === 1);
                $("#prevBtn").prop("disabled", data.prev_page_url === null);
                $("#nextBtn").prop("disabled", data.next_page_url === null);
                $("#lastBtn").prop(
                    "disabled",
                    data.current_page === totalPages
                );

                // Reinitialize tablesorter after adding rows
                $("#damageTable").trigger("update");
            } catch (error) {
                console.error("Error fetching damage data:", error);
                $("#damageTableBody").append(`
          <tr>
              <td colspan="9">Error loading damage data.</td>
          </tr>
      `);
            }
        }

        // Initialize tablesorter
        $("#damageTable").tablesorter();

        // Search input handler
        $("#search").on("input", function () {
            let searchTerm = $("#search").val();
            displayDamage(searchTerm);
        });

        // Pagination buttons click handlers
        $("#firstBtn").click(function () {
            currentPage = 1;
            const searchTerm = $("#search").val();
            displayDamage(searchTerm);
        });

        $("#prevBtn").click(function () {
            if (currentPage > 1) {
                currentPage--;
                const searchTerm = $("#search").val();
                displayDamage(searchTerm);
            }
        });

        $("#nextBtn").click(function () {
            currentPage++;
            const searchTerm = $("#search").val();
            displayDamage(searchTerm);
        });

        $("#lastBtn").click(function () {
            const totalPages = $("#paginationInfo").text().split("/")[1]; // Get total pages
            currentPage = parseInt(totalPages);
            const searchTerm = $("#search").val();
            displayDamage(searchTerm);
        });

        // Initial load
        displayDamage();
    });

    $(document).ready(function () {
        $(".download-btn").click(function () {
            // Call the downloadDialog method and handle the promise
            Dialog.downloadDialog()
                .then((format) => {
                    download(format, damages);
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle any errors that occur
                });
        });
    });

    let yearRange = "";

    // Fetch year range once and store it
    async function initializeYearRange() {
        yearRange = await getYearRange("DamageReport");
    }

    // Call this function when your app or page loads
    initializeYearRange();

    // Modified download function that uses the stored yearRange
    function download(format, data) {
        // Construct the filename using the stored yearRange
        const filename = `Damages Report ${yearRange}`;

        // Call the appropriate download function based on the format
        if (format === "csv") {
            downloadCSV(filename, data);
        } else if (format === "xlsx") {
            downloadExcel(filename, data);
        } else if (format === "pdf") {
            downloadPDF(filename, data);
        }
    }

    function downloadCSV(filename, data) {
        // Define the header mapping for damage data
        const headerMap = {
            barangay: "Barangay",
            cropName: "Commodity",
            variety: "Variety",
            numberOfFarmers: "Number of Farmers Affected",
            areaAffected: "Total Area Affected (ha)",
            yieldLoss: "Yield Loss (%)",
            grandTotalValue: "Grand Total Value",
            season: "Season",
            monthYear: "Month Year",
        };

        // Define the order of headers
        const headersToInclude = [
            "barangay",
            "cropName",
            "variety",
            "numberOfFarmers",
            "areaAffected",
            "yieldLoss",
            "grandTotalValue",
            "season",
            "monthYear",
        ];

        // Map headers to the desired names
        const headers = headersToInclude.map((key) => headerMap[key]);

        // Helper function to escape CSV values
        function escapeCSVValue(value) {
            if (value === undefined || value === null) return "";
            if (
                typeof value === "string" &&
                (value.includes(",") ||
                    value.includes('"') ||
                    value.includes("\n"))
            ) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }

        // Filter data to match the new headers and format values
        const csvRows = [
            headers.join(","),
            ...data.map((row) =>
                headersToInclude
                    .map((key) => {
                        let value = row[key] !== undefined ? row[key] : ""; // Ensure non-null values

                        // Format specific columns with peso sign
                        if (key === "grandTotalValue") {
                            return value
                                ? `₱${parseFloat(value).toFixed(2)}`
                                : "";
                        }
                        return escapeCSVValue(value);
                    })
                    .join(",")
            ),
        ].join("\n");

        // Create a Blob and trigger download
        const blob = new Blob([csvRows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Optional: Log download action
        addDownload(filename, "CSV");
    }

    function downloadExcel(filename, data) {
        // Define the header mapping for damage data
        const headerMap = {
            barangay: "Barangay",
            cropName: "Commodity",
            variety: "Variety",
            numberOfFarmers: "Number of Farmers Affected",
            areaAffected: "Total Area Affected (ha)",
            yieldLoss: "Yield Loss (%)",
            grandTotalValue: "Grand Total Value",
            season: "Season",
            monthYear: "Month Year",
        };

        // Define the order of headers
        const headersToInclude = [
            "barangay",
            "cropName",
            "variety",
            "numberOfFarmers",
            "areaAffected",
            "yieldLoss",
            "grandTotalValue",
            "season",
            "monthYear",
        ];

        // Map headers to the desired names
        const mappedHeaders = headersToInclude.map((key) => headerMap[key]);

        // Filter data to match the new headers
        const filteredData = data.map((row) => {
            const filteredRow = {};
            headersToInclude.forEach((key) => {
                filteredRow[headerMap[key]] = row[key];
            });
            return filteredRow;
        });

        // Create a new workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(filename);

        // Add filtered data to the worksheet
        worksheet.addRow(mappedHeaders);
        filteredData.forEach((row) => {
            worksheet.addRow(
                headersToInclude.map((header) => {
                    const value = row[headerMap[header]];
                    // Format specific columns with peso sign
                    if (header === "grandTotalValue") {
                        return value ? `₱${parseFloat(value).toFixed(2)}` : "";
                    }
                    return value;
                })
            );
        });

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
                fgColor: { argb: "203764" },
            },
            alignment: { horizontal: "center", vertical: "middle" },
            border: {
                top: { style: "thin", color: { argb: "FF000000" } }, // Black border
                right: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
            },
        };

        const dataStyle = {
            font: {
                name: "Calibri",
                size: 11,
            },
            alignment: {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
            },
            border: {
                top: { style: "thin", color: { argb: "FF000000" } }, // Black border
                right: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
            },
        };

        // Apply style to header row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.style = headerStyle;
        });
        headerRow.height = 20; // Set header row height

        // Apply style to data rows
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber > 1) {
                // Skip header row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.style = dataStyle;
                });
            }
        });

        // Set column widths with padding to prevent overflow
        worksheet.columns = mappedHeaders.map((header) => ({
            width: Math.max(header.length, 10) + 5, // Ensure minimum width
        }));

        // Write workbook to browser
        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        });
        addDownload(filename, "XLSX");
    }

    function downloadPDF(filename, data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("landscape"); // Specify landscape orientation

        // Extract all unique keys from the data
        const allKeys = [...new Set(data.flatMap(Object.keys))];

        // Filter out keys containing "id" and the last two keys
        const filteredKeys = allKeys.filter(
            (key) => !key.toLowerCase().includes("id")
        );
        const columns = filteredKeys.slice(0, filteredKeys.length - 2);

        // Format headers
        const headers = columns.map(formatHeader);

        // Function to format numerical values
        const formatValue = (value) => {
            if (typeof value === "number") {
                return value.toFixed(2); // Format numbers to 2 decimal places
            }
            return value;
        };

        // Create the table using all columns and formatted values
        doc.autoTable({
            head: [headers],
            body: data.map((row) =>
                columns.map((key) => {
                    let value = row[key];
                    return formatValue(value);
                })
            ),
            theme: "striped",
        });

        // Save the PDF
        doc.save(filename);
        addDownload(filename, "PDF");
    }

    function formatHeader(header) {
        return header
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before each capital letter
            .replace(/_/g, " ") // Replace underscores with spaces if any
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    getDamages();
}

// Function to check if the data is numeric or a valid range
function isNumeric(data) {
    // Check if the data is a single number
    if (!isNaN(data) && !isNaN(parseFloat(data))) {
        return true;
    }

    // Check if the data is a range in the format 'number-number'
    const rangePattern = /^\d+-\d+$/;
    if (rangePattern.test(data)) {
        const [start, end] = data.split("-").map(Number);
        // Ensure both parts of the range are valid numbers and the range is valid
        if (!isNaN(start) && !isNaN(end) && start <= end) {
            return true;
        }
    }

    // If neither check passed, return false
    return false;
}

// Function to build and return table rows as an array of Damage instances
async function processDamageData(
    workbook,
    cellMappings,
    id,
    season,
    monthYear
) {
    // Select the sheet you want to read from
    var sheetName = workbook.SheetNames[0]; // Assuming the first sheet
    var worksheet = workbook.Sheets[sheetName];

    // Find the column index for 'Damage' in cellMappings
    var damageColumn = getKeyBySubstring(cellMappings, "Grand Total Value");

    // Decode the range of the worksheet
    var range = XLSX.utils.decode_range(worksheet["!ref"]);
    let damageDatas = [];

    // Loop through rows starting from the first row after the header
    for (var rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        // Check if the corresponding row in column 'Damage' has a numeric value or valid range
        var cellAddressDamage = damageColumn.charAt(0) + (rowNum + 1); // Dynamically construct column 'Damage' cell address
        var cellValueDamage = worksheet[cellAddressDamage]
            ? worksheet[cellAddressDamage].v
            : "";

        // Check if the value is numeric or a valid range
        if (!isNumeric(cellValueDamage)) {
            continue; // Skip this row if it doesn't meet the filter criteria
        }

        // Read values based on the defined cell mappings
        var damageData = {};
        Object.keys(cellMappings).forEach(function (key) {
            var cellAddress = cellMappings[key].charAt(0) + (rowNum + 1); // Dynamically construct cell address based on key

            var cellValue = worksheet[cellAddress]
                ? worksheet[cellAddress].v
                : "";

            if (key === "Yield Loss (%)") {
                if (cellValue > 1) {
                    cellValue /= 100;
                }
            }
            damageData[key] = cellValue; // Store value for the current key in damageData
        });

        // Create a new Damage instance
        var damage = new Damage(
            id,
            getKeyBySubstring(damageData, "Barangay"),
            getKeyBySubstring(damageData, "Commodity"),
            getKeyBySubstring(damageData, "Variety"),
            getKeyBySubstring(damageData, "Number of Farmers Affected"),
            getKeyBySubstring(damageData, "Total Area Affected"),
            getKeyBySubstring(damageData, "Yield Loss"),
            getKeyBySubstring(damageData, "Grand Total Value"),
            season,
            monthYear
        );

        // Add the new damage instance to damageDatas array using addDamage method
        damageDatas.push(damage);
    }

    // Check if the record ID already exists in the damageDatas array
    var existingDamage = damages.find(
        (p) => p.recordId === damageDatas[0].recordId
    );

    if (existingDamage) {
        // Remove existing damage before adding the new one
        await damageDatas[0].removeDamage(damageDatas);
    }

    damageDatas[0].addDamage(damageDatas);
    return damages;
}

// Function to find a key in object containing a substring (case-insensitive and trims extra spaces)
function getKeyBySubstring(obj, substr) {
    // Convert substring to lowercase and trim any extra spaces
    const lowerSubstr = substr.trim().toLowerCase();

    for (let key in obj) {
        // Convert key to lowercase and trim any extra spaces
        if (key.trim().toLowerCase().includes(lowerSubstr)) {
            return obj[key];
        }
    }

    return null;
}

export {
    Damage,
    getDamages,
    damages,
    initializeMethodsDamage,
    processDamageData,
};
