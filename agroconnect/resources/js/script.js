function generateTrends() {
    // Placeholder for actual data generation logic
    const trends = [
        {
            season: "Dry",
            year: 2023,
            productionVolume: Math.floor(Math.random() * 1000),
        },
        {
            season: "Wet",
            year: 2023,
            productionVolume: Math.floor(Math.random() * 1000),
        },
    ];
    console.log("Seasonal Trends:", trends);
    alert("Trends generated! Check console for data.");
}

// Event listener for button click
document
    .getElementById("generateTrendsBtn")
    .addEventListener("click", generateTrends);

// Function to handle feedback submission
$(document).ready(function () {
    $("#feedbackForm").on("submit", function (e) {
        e.preventDefault();
        const feedbackMessage = $("#feedbackMessage").val();
        console.log("Feedback submitted:", feedbackMessage);
        alert("Feedback submitted! Thank you!");
        $("#feedbackModal").modal("hide");
        $(this).trigger("reset"); // Reset the form
    });
});
