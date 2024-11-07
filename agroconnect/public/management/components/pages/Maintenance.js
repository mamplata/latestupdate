import{initializeMaintenanceMenu}from"./MaintenanceMenu.js";import{user}from"../HeaderSidebar.js";export default function initDashboard(){$(document).ready(function(){function e(){var e;if(user.role==="admin"){e=`
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
`}else if(user.role==="agriculturist"){e=`
  <option value="riceProduction">Rice Production Reports</option>
    <option value="hvcProduction">HVC Production Reports</option>
    <option value="price">HVC Crop Price Monitoring</option>
    <option value="pestDisease">HVC Pest and Disease Reports</option>
    <option value="damage">HVC Damage Reports</option>
    <option value="soilHealth">Soil Health Records</option>
`}$("#main-content").html(`
<div class="loader-overlay" id="loader">
    <div class="spinner"></div>
    <div class="progress-message text-center" id="progressMessage">Uploading 0-0/0</div>
</div>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <div>
        <select id="maintenance-option" class="form-select" name="role" required>
            ${e}
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
`);var o=sessionStorage.getItem("fromDashboard")==="true";var i=sessionStorage.getItem("optionValue");if(o){$("#maintenance-option").val(i);initializeMaintenanceMenu(i);sessionStorage.removeItem("fromDashboard");sessionStorage.removeItem("optionValue")}else{var n=$("#maintenance-option").val();initializeMaintenanceMenu(n)}$("#maintenance-option").change(function(){var e=$(this).val();initializeMaintenanceMenu(e)})}e()})}