import{initializeDataEntriesMenu}from"./DataEntriesMenu.js";import{getProduction}from"../classes/Production.js";export default function initDashboard(){$(document).ready(function(){function e(){$("#main-content").html(`
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div>
            <select id="entries-option" class="form-select" name="role" required>
             <option value="riceProductions">Rice Productions</option>
                <option value="productions">HVC Productions</option>
                <option value="prices">HVC Prices</option>
                <option value="pests">HVC Pests</option>
                <option value="diseases">HVC Diseases</option>
                 <option value="damages">HVC Damages</option>
                <option value="soil_healths">Soil Healths</option>
            </select>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text border-0 bg-transparent"><i class="fas fa-search"></i></span>
            </div>
            <input placeholder="Search query..." type="text" class="form-control rounded-pill" id="search" name="search">
        </div>
    </div>
    <div id="entries-content">
        <!-- Content for the selected entries option will be dynamically loaded here -->
    </div>
`);$("#entries-option").change(function(){var e=$(this).val();initializeDataEntriesMenu(e)});var e=$("#entries-option").val();initializeDataEntriesMenu(e)}e()})}