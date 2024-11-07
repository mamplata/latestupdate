import{getCrop,getProduction,getPrice,getPest,getDisease,getProductions,getFarmer,getDataEntries,getRecord,getUsers,getBarangay,getConcerns,getDownloadCount,getUniqueCropNames}from"../../../js/fetch.js";import*as stats from"../../../js/statistics.js";import{user}from"../HeaderSidebar.js";export default function initDashboard(){$(document).ready(function(){var e=`
  <style>
     thead #dashboardTable {
        background-color: #fff !important;
     }
    .card-box {
      border-radius: 1em;
      margin-bottom: 2em;
      color: white;
      background-color: #008000; /* Green background for cards */
      cursor: pointer; /* Pointer cursor for indicating clickability */
    }
    .card-box .card-body {
      font-size: 1.5em;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: around;
      height: 5em;
      flex-direction: column;
    }
    .card-title {
      margin-bottom: 1em;
      font-size: 0.7em;
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
  <div class="row d-flex justify-content-center">`;if(user.role==="admin"){e+=`
    <div class="col-md-3">
        <div class="card card-box" data-link="#manage-users">
          <div class="card-body">
            <h5 class="card-title">Users</h5>
            <p id="users-count">0</p>
          </div>
        </div>
      </div>`}e+=`
    <div class="col-md-3">
      <div class="card card-box" data-link="#maintenance" data-value="farmer">
        <div class="card-body">
          <h5 class="card-title">Farmers</h5>
          <p id="farmers-count">0</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card card-box" data-link="#maintenance" data-value="barangay">
        <div class="card-body">
          <h5 class="card-title">Barangays</h5>
          <p id="barangays-count">0</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card card-box" data-link="#maintenance" data-value="production">
        <div class="card-body">
          <h5 class="card-title">Records</h5>
          <p id="records-count">0</p>
        </div>
      </div>
    </div>
  `;if(user.role==="admin"){e+=` 
      <div class="col-md-3">
        <div class="card card-box" data-link="#data-entries">
          <div class="card-body">
            <h5 class="card-title">Data Entries</h5>
            <p id="data-entries-count">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-box no-link">
          <div class="card-body">
            <h5 class="card-title">Downloads</h5>
            <p id="downloads-count">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-box" data-link="#concerns">
          <div class="card-body">
            <h5 class="card-title">Concerns & Issues</h5>
            <p id="concerns-count">0</p>
          </div>
        </div>
      </div>
  `}e+=`
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
                <div id="available" class="col text-center">
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
                  <option value="Rice">Rice</option>
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
    `;$("#main-content").html(e)});$(document).ready(async function(){e();t().then(()=>a());$("#type").on("change",function(){t().then(()=>a())});$("#season").on("change",function(){t().then(()=>a())});$("#category, #crop, #season").on("change",function(){a()})});async function e(){try{let[e,t,a,o,r,c,s]=await Promise.all([getFarmer(),getRecord(),getUsers(),getBarangay(),getConcerns(),getDataEntries(),getDownloadCount()]);var n={users:a.length,farmers:e.length,barangays:o.length,records:t.length,dataEntries:c,downloads:s,concerns:r.length};$("#users-count").text(n.users);$("#farmers-count").text(n.farmers);$("#barangays-count").text(n.barangays);$("#records-count").text(n.records);$("#data-entries-count").text(n.dataEntries);$("#downloads-count").text(n.downloads);$("#concerns-count").text(n.concerns);if(user.role==="admin"){$(".card-box").click(function(){if(!$(this).hasClass("no-link")){var e=$(this).data("link");var t=$(this).data("value");if(e){if(e==="#maintenance"){var a=true;sessionStorage.setItem("fromDashboard",a);sessionStorage.setItem("optionValue",t)}window.location.href=e}}})}}catch(e){console.error("Error initializing dashboard:",e)}}async function t(){const e=$("#type").val().toLowerCase();const t=$("#season").val().toLowerCase();let a="";try{const r=await getUniqueCropNames(t,e);if(r.length>0){a=r.length>0?r.map(e=>`<option value="${e}">${e.charAt(0).toUpperCase()+e.slice(1)}</option>`).join(""):'<option value="">No crops available</option>'}else{a='<option value="">No crops available</option>'}}catch(o){console.error("Failed to update crop options:",o);a='<option value="">Error loading crops</option>'}$("#crop").html(a)}async function a(){const e=$("#season").val();const t=$("#type").val();const a=$("#crop").val();const o=$("#category").val();let r;let c=[];let s=[];let n=[];try{switch(o){case"usage_level":r="Production Usage Level (%)";n=["usageLevel","totalProduction","totalSold"];s=await getProduction(a,e);c=stats.UsageLevelFrequency(s);break;case"area_planted":r="Area Planted (Hectare)";n=["areaPlanted"];s=await getProduction(a,e);c=stats.countAverageAreaPlanted(s);break;case"production_volume":r="Production Volume Per Hectare";n=["volumeProductionPerHectare","totalVolume","totalArea"];s=await getProduction(a,e);c=stats.averageVolumeProduction(s);break;case"price":r="Price";n=["price"];s=await getPrice(a,e);c=stats.averagePrice(s);break;case"pest_occurrence":r="Pest Occurrence";n=["totalOccurrence","pestOccurrences"];s=await getPest(a,e);c=stats.countPestOccurrence(s);break;case"disease_occurrence":r="Disease Occurrence";n=["totalOccurrence","diseaseOccurrences"];s=await getDisease(a,e);c=stats.countDiseaseOccurrence(s);break;case"price_income_per_hectare":r="Price Income per Hectare";n=["incomePerHectare","totalArea","totalIncome"];s=await getProduction(a,e);c=stats.priceIncomePerHectare(s);break;case"profit_per_hectare":r="Profit per Hectare";n=["profitPerHectare","totalArea","totalIncome","totalProductionCost"];s=await getProduction(a,e);c=stats.profitPerHectare(s);break;default:r="Category not recognized"}if(c.length!==0){$("#unavailable").hide();$("#available").show();const l=d(c,r,n);p(l)}else{$("#available").hide();$("#unavailable").show()}}catch(i){console.error("Error handling category change:",i)}}function d(a,e,s){if(!a.length){return{lineChartConfig:null}}const t=[...new Set(a.map(e=>e.season))];const o=t[0]||"Unknown";const n=[...new Set(a.map(e=>e.monthYear.split(" ")[1]))].sort((e,t)=>e-t);const i=n.map(t=>{const r=a.filter(e=>e.monthYear.endsWith(t));const e=s.map(a=>{if(a==="totalOccurrence"){const{sum:e,count:t}=r.reduce((e,t)=>{e.sum+=t[a]||0;e.count+=1;return e},{sum:0,count:0});return t>0?e/t:0}else if(a==="pestOccurrences"){const o=r.flatMap(e=>e[a].map(e=>`${e.pestName}: ${e.occurrence}`));return o.length>0?o.join(", "):"None"}else if(a==="diseaseOccurrences"){const o=r.flatMap(e=>e[a].map(e=>`${e.diseaseName}: ${e.occurrence}`));return o.length>0?o.join(", "):"None"}const{sum:e,count:t}=r.reduce((e,t)=>{e.sum+=t[a]||0;e.count+=1;return e},{sum:0,count:0});return t>0?e/t:0});return e});const r={labels:n,datasets:[{label:"Total Occurrences",data:i.map(e=>e[0]||0),backgroundColor:"#007bff",borderColor:"#007bff",borderWidth:1}]};const c={type:"bar",data:r,options:{responsive:true,plugins:{legend:{position:"top"},title:{display:true,text:`${e} Per Year (${o} Season)`},tooltip:{callbacks:{label:function(e){const t=e.dataIndex;const a=n[t];const o=i[t];const r=[`Average Total Occurrence for ${a}: ${o[0].toFixed(2)}`];const c=s[1];if(c==="pestOccurrences"){r.push(`Pest Occurrences: ${o[1]||"None"}`)}else if(c==="diseaseOccurrences"){r.push(`Disease Occurrences: ${o[1]||"None"}`)}else{s.forEach((e,t)=>{if(e!==c){r.push(`Average ${e}: ${o[t]?o[t].toFixed(2):"None"}`)}})}return r}}}},scales:{x:{title:{display:true,text:"Year"}},y:{title:{display:true,text:e}}}}};return{barChartConfig:c}}function p(e){const t=Chart.getChart("totalPerYearChart");if(t){t.destroy()}if(e.barChartConfig){const a={responsive:true,maintainAspectRatio:false};const o={...e.barChartConfig,options:{...e.barChartConfig.options,...a}};new Chart(document.getElementById("totalPerYearChart"),o)}}async function n(){try{return await getCrop()}catch(e){console.error("Failed to initialize crops:",e)}}class o{constructor(e,t){this.season=e;this.type=t;this.initialize()}async initialize(){try{let e=await this.fetchCropData();const t=this.generateTopCrops(e);this.displayTopCrops(t)}catch(e){console.error("Failed to initialize TopCrops:",e)}}async fetchCropData(){try{return await r(this.season,this.type)}catch(e){console.error("Failed to fetch crop data:",e)}}generateTopCrops(e){if(!Array.isArray(e)){console.error("Expected input to be an array");return[]}const a={plantedWeight:.35,volumeWeight:.35,priceWeight:.1,pestWeight:-.05,diseaseWeight:-.05,incomeWeight:.1,profitWeight:.1};const t=e.map(e=>{const t=e.totalArea*a.plantedWeight+e.totalVolume*a.volumeWeight+e.price*a.priceWeight+e.pestOccurrence*a.pestWeight+e.diseaseOccurrence*a.diseaseWeight+e.totalIncome*a.incomeWeight+e.totalProfit*a.profitWeight;return{cropName:e.cropName,variety:e.variety||"",compositeScore:t}});const o=t.sort((e,t)=>t.compositeScore-e.compositeScore);return o.slice(0,5)}displayTopCrops(e){const a=$("#cropsTable tbody");a.empty();e.forEach(e=>{const t=`<tr>
              <td>${e.cropName}</td>
              <td>${e.variety}</td>                
          </tr>`;a.append(t)})}}$(document).ready(function(){new o("Dry","Vegetables");$("#seasonSelect, #typeSelect").on("change",function(){const e=$("#seasonSelect").val();const t=$("#typeSelect").val();new o(e,t)})});async function r(c,s){try{let e=await n();let t=await getProduction("",c);let a=await getPrice("",c);let o=await getPest("",c);let r=await getDisease("",c);t=t.map(e=>({...e,type:s}));a=a.map(e=>({...e,type:s}));o=o.map(e=>({...e,type:s}));r=r.map(e=>({...e,type:s}));return await stats.getCropData(t,a,o,r,e,s)}catch(e){console.error("An error occurred in the main function:",e)}}}