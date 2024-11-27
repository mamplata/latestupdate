import Dialog from "../helpers/Dialog.js";
import { getCrop } from "../../../js/fetch.js";

// CropVariety.js
let cropVarieties = [];

class CropVariety {
    constructor(
        varietyId,
        cropId,
        varietyName,
        color,
        size,
        flavor,
        growthConditions,
        pestDiseaseResistance,
        recommendedPractices,
        cropImg
    ) {
        this.varietyId = varietyId; // Unique identifier for the crop variety
        this.cropId = cropId; // Foreign key linking to the Crop model
        this.varietyName = varietyName; // Name of the specific crop variety
        this.color = color; // Color characteristic of the crop variety
        this.size = size; // Size characteristic of the crop variety
        this.flavor = flavor; // Flavor profile of the variety
        this.growthConditions = growthConditions; // Conditions required for optimal growth
        this.pestDiseaseResistance = pestDiseaseResistance; // Resistance to pests/diseases
        this.recommendedPractices = recommendedPractices; // Recommended farming practices
        this.cropImg = cropImg; // Image of the crop
    }

    async createCropVariety(cropVariety) {
        // Check for duplicates based on varietyName
        const existingVariety = cropVarieties.find(
            (c) =>
                c.varietyName === cropVariety.varietyName &&
                c.cropId === cropVariety.cropId
        );
        if (existingVariety) {
            alert("Crop variety with the same name already exists");
            return;
        }

        // Show the static uploading message
        $("#progressMessage").text("Uploading...");
        $("#loader").show(); // Show the loader
        $("body").addClass("no-scroll"); // Optional: Add a class to disable scrolling

        try {
            await $.ajax({
                url: "/api/crop-varieties",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(cropVariety),
            });

            getCropVarieties();

            toastr.success("Crop variety added successfully!", "Success", {
                timeOut: 5000, // 5 seconds
                positionClass: "toast-top-center",
                toastClass: "toast-success-custom",
            });
        } catch (error) {
            console.error("Error:", error);
            toastr.error(
                "Failed to add crop variety. Please try again.",
                "Error",
                {
                    timeOut: 5000, // 5 seconds
                    positionClass: "toast-top-center",
                    toastClass: "toast-error-custom",
                }
            );
        } finally {
            // Hide the loader and re-enable user interaction
            $("#loader").hide();
            $("body").removeClass("no-scroll"); // Remove the class to re-enable scrolling
            $("#progressMessage").text(""); // Clear the progress message
        }
    }

    updateCropVariety(updatedCropVariety) {
        // Check for duplicates based on varietyName, excluding the current crop variety
        const existingVariety = cropVarieties.find(
            (c) =>
                c.varietyName === updatedCropVariety.varietyName &&
                c.varietyId !== updatedCropVariety.varietyId
        );
        if (existingVariety) {
            alert("Crop variety with the same name already exists");
            return;
        }

        // Update the crop variety in the local cropVarieties array
        cropVarieties = cropVarieties.map((variety) =>
            variety.varietyId === updatedCropVariety.varietyId
                ? { ...variety, ...updatedCropVariety }
                : variety
        );

        fetch(`/api/crop-varieties/${updatedCropVariety.varietyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCropVariety),
        })
            .then((response) => response.json())
            .then((data) => {
                getCropVarieties();

                toastr.success(
                    "Crop variety updated successfully!",
                    "Success",
                    {
                        timeOut: 5000, // 5 seconds
                        positionClass: "toast-top-center",
                        toastClass: "toast-success-custom",
                    }
                );
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    removeCropVariety(varietyId) {
        fetch(`/api/crop-varieties/${varietyId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    cropVarieties = cropVarieties.filter(
                        (variety) => variety.varietyId !== varietyId
                    );

                    getCropVarieties();
                } else if (response.status === 404) {
                    console.error(
                        `Crop variety with ID ${varietyId} not found.`
                    );
                } else {
                    console.error(
                        `Failed to delete crop variety with ID ${varietyId}.`
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

function getCropVarieties() {
    // Fetch crops from Laravel backend
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Fetch crops from Laravel backend
    $.ajax({
        url: "/api/crop-varieties", // Endpoint to fetch crops
        method: "GET",
        success: function (response) {
            // Assuming response is an array of crops
            let cropVariety = response;

            cropVarieties = cropVariety;
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crops:", error);
        },
    });
}

getCropVarieties();

function searchCropVariety(varietyName) {
    const foundCropVarieties = cropVarieties.filter((variety) =>
        variety.varietyName.toLowerCase().includes(varietyName.toLowerCase())
    );
    return foundCropVarieties;
}

function initializeMethodsCropVariety() {
    var selectedRow = null;
    var pageSize = 5;
    var currentPage = 1;
    var isEdit = false;
    var variety = null;

    async function displayCropVarieties(varietyName = null) {
        try {
            // Construct query parameters
            let query = `?page=${currentPage}&pageSize=${pageSize}`;
            if (varietyName) {
                query += `&varietyName=${encodeURIComponent(varietyName)}`;
            }

            // Fetch crop varieties from the server
            const response = await fetch(`/api/crop-varieties${query}`);
            const data = await response.json();
            console.log(cropVarieties);

            cropVarieties = data.data;

            // Fetch crop names for mapping
            const cropsResponse = await fetch(`/api/crops`);
            const cropsData = await cropsResponse.json();

            // Create a map of cropId to cropName for easy lookup
            const cropMap = cropsData.reduce((map, crop) => {
                map[crop.cropId] = crop.cropName;
                return map;
            }, {});

            // Clear the table body
            $("#cropVarietyTableBody").empty();

            if (data.data.length > 0) {
                // Populate the table with fetched data
                data.data.forEach((variety) => {
                    const cropName = cropMap[variety.cropId] || "Unknown Crop"; // Get cropName or fallback to 'Unknown Crop'
                    $("#cropVarietyTableBody").append(`
                        <tr data-index="${variety.varietyId}" class="text-center">
                            <td style="display: none;">${variety.varietyId}</td>
                            <td><img src="${variety.cropImg}" alt="${variety.varietyName}" class="img-thumbnail" width="50" height="50"></td>
                            <td>${variety.varietyName}</td>
                            <td>${cropName}</td> <!-- Display the associated cropName -->
                            <td class="crop-cell" title="${variety.color}">${variety.color}</td>
                            <td class="crop-cell" title="${variety.size}">${variety.size}</td>
                            <td class="crop-cell" title="${variety.flavor}">${variety.flavor}</td>
                            <td class="crop-cell" title="${variety.growthConditions}">${variety.growthConditions}</td>
                            <td class="crop-cell" title="${variety.pestDiseaseResistance}">${variety.pestDiseaseResistance}</td>
                            <td class="crop-cell" title="${variety.recommendedPractices}">${variety.recommendedPractices}</td>
                        </tr>
                    `);
                });
            } else {
                // Handle case where no varieties are found
                $("#cropVarietyTableBody").append(`
                    <tr>
                        <td colspan="10">No crop varieties found!</td>
                    </tr>
                `);
            }

            // Update pagination info
            const totalPages = data.last_page || 1; // Total pages from API response
            $("#paginationInfo").text(`${data.current_page}/${totalPages}`);

            // Enable/disable pagination buttons based on the current page
            $("#prevBtn").prop("disabled", data.prev_page_url === null);
            $("#nextBtn").prop("disabled", data.next_page_url === null);
        } catch (error) {
            console.error("Error fetching crop varieties:", error);
            $("#cropVarietyTableBody").append(`
                <tr>
                    <td colspan="10">Error loading crop varieties.</td>
                </tr>
            `);
        }
    }

    // Event listener for search input
    $("#search").on("input", function () {
        let varietyName = $(this).val();
        currentPage = 1; // Reset to the first page when searching
        displayCropVarieties(varietyName);
    });

    // Pagination: Previous button click handler
    $("#prevBtn").click(function () {
        if (currentPage > 1) {
            currentPage--;
            const varietyName = $("#search").val();
            displayCropVarieties(varietyName);
        }
    });

    // Pagination: Next button click handler
    $("#nextBtn").click(function () {
        currentPage++;
        const varietyName = $("#search").val();
        displayCropVarieties(varietyName);
    });

    // Display initial crop varieties
    displayCropVarieties();

    let prevCropVarietyImg = "";

    $("#submitBtn").click(function (event) {
        event.preventDefault();

        const form = document.getElementById("cropVarietyForm");

        // Check if form is valid
        if (!form.checkValidity()) {
            // If form is invalid, show the built-in validation messages
            form.reportValidity();
            return;
        }

        var varietyId = Number($("#varietyId").val());
        var cropId = Number($("#cropId").val()); // Assuming cropId is still needed to associate the variety
        var varietyName = $("#varietyName").val();
        var color = $("#color").val(); // New input field for color
        var size = $("#size").val(); // New input field for size
        var flavor = $("#flavor").val(); // New input field for flavor profile
        var growthConditions = $("#growthConditions").val(); // New input field for growth conditions
        var pestDiseaseResistance = $("#pestDiseaseResistance").val(); // New input field for pest/disease resistance
        var recommendedPractices = $("#recommendedPractices").val(); // New input field for recommended practices

        // Get the file input element and the selected file
        var cropImgFile = document.getElementById("cropImg").files[0];
        var cropImgBase64 = null; // Initialize as null

        if (cropImgFile) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var img = new Image();
                img.src = reader.result;

                img.onload = function () {
                    // Create a canvas to draw the image on
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");

                    // Set the canvas size to the image size
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0);

                    // Convert the canvas image to WebP format (quality can be adjusted)
                    cropImgBase64 = canvas.toDataURL("image/webp", 0.8); // 0.8 is the quality factor

                    // Create the CropVariety object with the WebP base64 image string
                    let variety = new CropVariety(
                        varietyId,
                        cropId,
                        varietyName,
                        color,
                        size,
                        flavor,
                        growthConditions,
                        pestDiseaseResistance,
                        recommendedPractices,
                        cropImgBase64
                    );

                    if (selectedRow !== null && isEdit) {
                        variety.updateCropVariety(variety);
                        selectedRow = null;
                        $("#submitBtn").text("Add Crop Variety");
                        $("#cancelBtn").hide();
                        isEdit = false;
                    } else {
                        variety.createCropVariety(variety);
                    }

                    getCropVarieties(); // Ensure this function is defined for getting varieties
                    displayCropVarieties(); // Call the function to display varieties

                    // Clear form fields after submission
                    $("#cropVarietyForm")[0].reset();
                    $("#cropVarietyTableBody tr").removeClass("selected-row");
                };
            };

            // Read the image file as a data URL (base64)
            reader.readAsDataURL(cropImgFile);
        } else {
            // Handle form submission without a new image
            // Use null for image when no new image is provided during update
            if (selectedRow !== null && isEdit) {
                let variety = new CropVariety(
                    varietyId,
                    cropId,
                    varietyName,
                    color,
                    size,
                    flavor,
                    growthConditions,
                    pestDiseaseResistance,
                    recommendedPractices,
                    prevCropVarietyImg
                );
                variety.updateCropVariety(variety);
                selectedRow = null;
                $("#submitBtn").text("Add Crop Variety");
                $("#cancelBtn").hide();
                isEdit = false;
            } else {
                let variety = new CropVariety(
                    varietyId,
                    cropId,
                    varietyName,
                    color,
                    size,
                    flavor,
                    growthConditions,
                    pestDiseaseResistance,
                    recommendedPractices,
                    null
                );
                variety.createCropVariety(variety);
            }

            getCropVarieties(); // Ensure this function is defined for getting varieties
            displayCropVarieties(); // Call the function to display varieties
            prevCropVarietyImg = "";

            // Clear form fields after submission
            $("#cropVarietyForm")[0].reset();
            $("#lblCropImg").val("Upload Image:");
            $("#cropVarietyTableBody tr").removeClass("selected-row");
            $("#editBtn").prop("disabled", true);
            $("#deleteBtn").prop("disabled", true);
        }
    });

    function resetFields() {
        // Reset UI states
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
        selectedRow = null;
        $("#cropVarietyTableBody tr").removeClass("selected-row");
    }

    $("#editBtn").click(async function () {
        // Open the confirmation dialog
        const result = await Dialog.confirmDialog(
            "Confirm Edit",
            "Are you sure you want to edit this crop variety's details?"
        );

        // Check if the user clicked OK
        if (result.operation === 1) {
            $("#editModal").modal("hide");
            $("#cancelBtn").show();

            // Assuming `variety` is the selected CropVariety object
            $("#varietyId").val(variety.varietyId); // Add varietyId field
            $("#cropId").val(variety.cropId); // Assuming this field is still needed
            $("#varietyName").val(variety.varietyName);
            $("#color").val(variety.color); // New input for color
            $("#size").val(variety.size); // New input for size
            $("#flavor").val(variety.flavor); // New input for flavor
            $("#growthConditions").val(variety.growthConditions); // New input for growth conditions
            $("#pestDiseaseResistance").val(variety.pestDiseaseResistance); // New input for pest/disease resistance
            $("#recommendedPractices").val(variety.recommendedPractices); // New input for recommended practices

            prevCropVarietyImg = variety.cropImg; // Store the previous image for updates
            $("#lblCropImg").text("Upload New Image (Optional):");
            isEdit = true;

            $("#submitBtn").text("Update Variety");
        }
        $("#cropVarietyTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    // Cancel button click handler
    $("#cancelEdit").click(function () {
        resetFields();
        $("#cropVarietyTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    // Cancel button click handler
    $("#cancelBtn").click(function () {
        selectedRow = null;
        $("#cropVarietyForm")[0].reset();
        $("#submitBtn").text("Add Crop Variety");
        $("#cancelBtn").hide();
        $("#cropVarietyTableBody tr").removeClass("selected-row");
        $("#editBtn").prop("disabled", true);
        $("#deleteBtn").prop("disabled", true);
    });

    // Delete button click handler
    $("#deleteBtn").click(async function () {
        // Open the confirmation dialog
        const result = await Dialog.confirmDialog(
            "Confirm Deletion",
            "Are you sure you want to delete this crop variety?"
        );

        // Check if the user clicked OK
        if (result.operation === 1) {
            let varietyToDelete = new CropVariety();
            varietyToDelete.removeCropVariety(variety.varietyId);
            getCropVarieties();
            displayCropVarieties();
            resetFields();
        } else {
            // If Cancel is clicked, do nothing or add additional handling if needed

            $("#cropVarietyTableBody tr").removeClass("selected-row");
            $("#editBtn").prop("disabled", true);
            $("#deleteBtn").prop("disabled", true);
        }
    });

    // Row click handler (for selecting rows)
    $("#cropVarietyTableBody").on("click", "tr", function () {
        var $this = $(this);
        var varietyId = $this.data("index");
        variety = cropVarieties.find((u) => u.varietyId === varietyId);
        selectedRow = varietyId;
        // Highlight selected row
        if (selectedRow !== null) {
            $("#cropVarietyTableBody tr").removeClass("selected-row");
            $("#cropVarietyTableBody tr")
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
            $("#cropVarietyTableBody tr").removeClass("selected-row");
        }
    });
}

export {
    CropVariety,
    getCropVarieties,
    searchCropVariety,
    initializeMethodsCropVariety,
    cropVarieties,
};
