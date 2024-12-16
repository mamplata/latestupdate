import { initializeMaintenanceMenu } from "./MaintenanceMenu.js";
import { user } from "../HeaderSidebar.js";

export default function initDashboard() {
    $(document).ready(function () {
        // Function to load options based on user role
        function loadOptions() {
            var options;
            if (user.role === "admin") {
                options = `
                    <option value="crop">Crop Records</option>
                    <option value="crop_variety">Crop Variety Records</option>
                    <option value="barangay">Barangay Records</option>
                    <option value="farmer">Farmer Records</option>
                    <option value="riceProduction">Rice Production Reports</option>
                    <option value="hvcProduction">HVC Production Reports</option>
                    <option value="price">HVC Crop Price Monitoring</option>
                    <option value="pestDisease">HVC Pest and Disease Reports</option>
                    <option value="damage">HVC Damage Reports</option>
                    <option value="soilHealth">Soil Health Records</option>
                `;
            } else if (user.role === "agriculturist") {
                options = `
                    <option value="riceProduction">Rice Production Reports</option>
                    <option value="hvcProduction">HVC Production Reports</option>
                    <option value="price">HVC Crop Price Monitoring</option>
                    <option value="pestDisease">HVC Pest and Disease Reports</option>
                    <option value="damage">HVC Damage Reports</option>
                    <option value="soilHealth">Soil Health Records</option>
                `;
            }
            return options;
        }

        // Inject the HTML structure for the dashboard
        $("#main-content").html(`
            <div class="loader-overlay" id="loader">
                <div class="spinner"></div>
                <div class="progress-message text-center" id="progressMessage">Uploading 0-0/0</div>
            </div>

            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div>
                    <select id="maintenance-option" class="form-select" name="role" required>
                        ${loadOptions()}
                    </select>
                </div>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text border-0 bg-transparent"><i class="fas fa-search"></i></span>
                    </div>
                    <input placeholder="Search name..." type="text" class="form-control rounded-pill" id="search" name="search">
                </div>
            </div>
            <div id="maintenance-content">
                <!-- Content for the selected maintenance option will be dynamically loaded here -->
            </div>
        `);

        var fromDashboard = sessionStorage.getItem("fromDashboard") === "true";
        var optionValue = sessionStorage.getItem("optionValue");

        if (fromDashboard) {
            $("#maintenance-option").val(optionValue);
            initializeMaintenanceMenu(optionValue);
            sessionStorage.removeItem("fromDashboard");
            sessionStorage.removeItem("optionValue");
        } else {
            var selectedOption = $("#maintenance-option").val();
            initializeMaintenanceMenu(selectedOption);
        }

        $("#maintenance-option").change(function () {
            // Clear the search input when the dropdown changes
            $("#search").val("");

            var selectedOption = $(this).val();
            initializeMaintenanceMenu(selectedOption); // Load content for selected option

            // Reset search functionality for the newly selected content
            resetSearch(selectedOption);
        });

        // Function to reset the search functionality for the selected option
        function resetSearch(selectedOption) {
            // Re-attach search functionality when the page content changes
            $("#search").on("input", function () {
                var searchTerm = $(this).val().toLowerCase();
                // Get the current content section based on the selected option
                var content = $("#maintenance-content").find(
                    `.content-${selectedOption}`
                );

                // Hide all content and only show matching results
                content.each(function () {
                    var contentText = $(this).text().toLowerCase();
                    if (contentText.indexOf(searchTerm) !== -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        }
    });
}
