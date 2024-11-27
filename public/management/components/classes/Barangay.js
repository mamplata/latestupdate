import Dialog from "../helpers/Dialog.js";

// Barangay.js
let barangays = [];

class Barangay {
    constructor(barangayId, barangayName, coordinates) {
        this.barangayId = barangayId;
        this.barangayName = barangayName;
        //get from leaflet
        this.coordinates = coordinates;
    }

    createBarangay(barangay) {
        const existingBarangay = barangays.find(
            (b) => b.barangayName === barangay.barangayName
        );
        if (existingBarangay) {
            alert("Barangay already exists");
            return;
        }

        fetch("/api/barangays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(barangay),
        })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    updateBarangay(updatedBarangay) {
        const existingBarangay = barangays.find(
            (b) => b.barangayName === updatedBarangay.barangayName
        );

        if (
            existingBarangay &&
            existingBarangay.barangayId !== updatedBarangay.barangayId
        ) {
            alert("Barangay already exists");
            return;
        }

        barangays = barangays.map((barangay) =>
            barangay.barangayId === updatedBarangay.barangayId
                ? { ...barangay, ...updatedBarangay }
                : barangays
        );

        fetch(`/api/barangays/${updatedBarangay.barangayId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBarangay),
        })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    removeBarangay(barangayId) {
        fetch(`/api/barangays/${barangayId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    barangays = barangays.filter(
                        (barangay) => barangay.barangayId !== barangay
                    );
                } else if (response.status === 404) {
                    console.error(`Barangay with ID ${barangayId} not found.`);
                } else {
                    console.error(
                        `Failed to delete barangay with ID ${barangayId}.`
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

function getBarangay() {
    // Fetch barangays from Laravel backend
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Fetch barangays from Laravel backend
    $.ajax({
        url: "/api/barangays", // Endpoint to fetch barangays
        method: "GET",
        success: function (response) {
            // Assuming response is an array of barangays
            let barangay = response;

            barangays = barangay;
        },
        error: function (xhr, status, error) {
            console.error("Error fetching barangays:", error);
        },
    });
}

getBarangay();

async function fetchCoordinates(locationName) {
    locationName = `${locationName}, Cabuyao, Laguna, Philippines`;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationName
        )}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
}

async function getCoordinates(locationName) {
    const coordinates = await fetchCoordinates(locationName);
    if (coordinates) {
        const formattedCoordinates = `${coordinates[0]},${coordinates[1]}`;

        return formattedCoordinates;
    } else {
        return "Location not found.";
    }
}

function searchBarangay(barangayName) {
    const foundBarangays = barangays.filter((barangay) =>
        barangay.barangayName.toLowerCase().includes(barangayName.toLowerCase())
    );
    return foundBarangays;
}

function initializeMethodsBarangay() {
    var selectedRow = null;
    var pageSize = 5;
    var currentPage = 1;
    var barangay = null;
    var isEdit = false;

    async function displayBarangays(barangayName = null) {
        try {
            // Construct query parameters
            let query = `?page=${currentPage}&pageSize=${pageSize}`;
            if (barangayName) {
                query += `&barangayName=${encodeURIComponent(barangayName)}`;
            }

            // Fetch barangays from the server
            const response = await fetch(`/api/barangays${query}`);
            const data = await response.json();

            barangays = data.data;

            $("#barangayTableBody").empty();

            if (data.data && data.data.length > 0) {
                // Populate the table with fetched data
                data.data.forEach((barangay) => {
                    $("#barangayTableBody").append(`
                        <tr data-index=${barangay.barangayId}>
                            <td style="display: none;">${barangay.barangayId}</td>
                            <td>${barangay.barangayName}</td>
                            <td>${barangay.coordinates}</td>
                        </tr>
                    `);
                });
            } else {
                // Handle case where no barangays are found
                $("#barangayTableBody").append(`
                    <tr>
                        <td colspan="3">Barangay not found!</td>
                    </tr>
                `);
            }

            // Update pagination info
            const totalPages = data.last_page || 1; // Total pages from API response
            $("#paginationInfo").text(`${data.current_page}/${totalPages}`);

            // Enable/disable pagination buttons
            $("#prevBtn").prop("disabled", data.prev_page_url === null);
            $("#nextBtn").prop("disabled", data.next_page_url === null);
        } catch (error) {
            console.error("Error fetching barangays:", error);
            $("#barangayTableBody").append(`
                <tr>
                    <td colspan="3">Error loading barangays.</td>
                </tr>
            `);
        }
    }

    // Event listener for search input
    $("#search").on("input", function () {
        let barangayName = $(this).val();
        currentPage = 1; // Reset to the first page when searching
        displayBarangays(barangayName);
    });

    // Pagination: Previous button click handler
    $("#prevBtn").click(function () {
        if (currentPage > 1) {
            currentPage--;
            const barangayName = $("#search").val();
            displayBarangays(barangayName);
        }
    });

    // Pagination: Next button click handler
    $("#nextBtn").click(function () {
        currentPage++;
        const barangayName = $("#search").val();
        displayBarangays(barangayName);
    });

    // Display initial barangays
    displayBarangays();

    // Form submission handler (Add or Update barangay)
    $("#submitBtn").click(function (event) {
        event.preventDefault();

        const form = document.getElementById("barangayForm");

        // Check if form is valid
        if (!form.checkValidity()) {
            // If form is invalid, show the built-in validation messages
            form.reportValidity();
            return;
        }

        var barangayId = Number($("#barangayId").val());
        var barangayName = $("#barangayName").val();
        if (selectedRow !== null && isEdit) {
            // Update existing barangay
            getCoordinates(barangayName).then((result) => {
                coordinates = result;
                if (coordinates === "Location not found.") {
                    toastr.success("Unknown Location in Cabuyao", "Invalid", {
                        timeOut: 5000, // 5 seconds
                        positionClass: "toast-top-center",
                        toastClass: "toast-warning",
                    });
                    return;
                }
                let barangay = new Barangay(
                    barangayId,
                    barangayName,
                    coordinates
                );
                barangay.updateBarangay(barangay);
                getBarangay();
                displayBarangays();
            });
            selectedRow = null;
            $("#submitBtn").text("Add barangay");
            $("#cancelBtn").hide();
            resetFields();
            isEdit = false;
        } else {
            var coordinates = "";
            getCoordinates(barangayName).then((result) => {
                coordinates = result;
                if (coordinates === "Location not found.") {
                    toastr.success("Unknown Location in Cabuyao", "Invalid", {
                        timeOut: 5000, // 5 seconds
                        positionClass: "toast-top-center",
                        toastClass: "toast-warning",
                    });
                    return;
                }
                let barangay = new Barangay(
                    barangayId,
                    barangayName,
                    coordinates
                );
                barangay.createBarangay(barangay);
                getBarangay();
                displayBarangays();
            });
        }

        // Clear form fields after submission
        $("#barangayForm")[0].reset();
        selectedRow = null;
        $("#barangayTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    function resetFields() {
        // Reset UI states
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
        selectedRow = null;
        $("#barangayTableBody tr").removeClass("selected-row");
    }

    $("#editBtn").click(async function () {
        // Open the confirmation dialog
        const result = await Dialog.confirmDialog(
            "Confirm Edit",
            "Are you sure you want to edit this barangay's details?"
        );

        // Check if the user clicked OK
        if (result.operation === 1) {
            $("#editModal").modal("hide");
            $("#cancelBtn").show();
            $("#barangayId").val(barangay.barangayId);
            $("#barangayName").val(barangay.barangayName);
            $("#submitBtn").text("Update Barangay");
            isEdit = true;
        }
        $("#barangayTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    // Cancel button click handler
    $("#cancelEdit").click(function () {
        resetFields();
    });

    // Cancel button click handler
    $("#cancelBtn").click(function () {
        selectedRow = null;
        $("#barangayForm")[0].reset();
        $("#submitBtn").text("Add Barangay");
        $("#cancelBtn").hide();
        $("#barangayTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    // Delete button click handler
    $("#deleteBtn").click(async function () {
        // Open the confirmation dialog
        const result = await Dialog.confirmDialog(
            "Confirm Deletion",
            "Are you sure you want to delete this barangay?"
        );

        // Check if the user clicked OK
        if (result.operation === 1) {
            // Close the modal
            $("#deleteModal").modal("hide");

            // Proceed with deletion
            let barangayToDelete = new Barangay();
            barangayToDelete.removeBarangay(barangay.barangayId);
            getBarangay();
            displayBarangays();
            resetFields();
        } else {
            // If Cancel is clicked, do nothing or add additional handling if needed

            $("#editBtn").prop("disabled", true);
            $("#deleteBtn").prop("disabled", true);
        }
    });

    $("#cancelDelete").click(function () {
        resetFields();
    });

    // Row click handler (for selecting rows)
    $("#barangayTableBody").on("click", "tr", function () {
        var $this = $(this);
        var barangayId = $this.data("index");
        barangay = barangays.find((u) => u.barangayId === barangayId);
        selectedRow = barangayId;
        // Highlight selected row
        if (selectedRow !== null) {
            $("#barangayTableBody tr").removeClass("selected-row");
            $("#barangayTableBody tr")
                .filter(function () {
                    return (
                        parseInt($(this).find("td:eq(0)").text(), 10) ===
                        selectedRow
                    );
                })
                .addClass("selected-row");
            $("#editBtn").prop("disabled", false);
            $("#deleteBtn").prop("disabled", false);
        } else {
            $("#barangayTableBody tr").removeClass("selected-row");
        }
    });
}

export {
    Barangay,
    getBarangay,
    searchBarangay,
    barangays,
    initializeMethodsBarangay,
};
