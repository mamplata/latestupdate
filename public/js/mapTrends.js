import{getCrop,getProduction,getPest,getDisease,getProductions,getBarangay,getYearRange,addDownload,getUniqueCropNames,getDamages,getRiceProduction}from"./fetch.js";import*as stats from"./statistics.js";import Dialog from"../management/components/helpers/Dialog.js";let barangays=[];let globalMap=null;let downloadData;let downloadYR;let printDataMap;let markers=[];let currentType;$(document).ready(function(){$("#infoBtn").click(function(){let e=`
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
    `;Dialog.showInfoModal(e)})});async function initializeBarangays(){try{barangays=await getBarangay()}catch(e){console.error("Failed to initialize barangays:",e)}}function initializeGlobalMap(){if(!globalMap){globalMap=L.map("map",{renderer:L.canvas()}).setView([14.27,121.126],11);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(globalMap);globalMap.whenReady(()=>globalMap.invalidateSize())}}class MapTrends{constructor(e,a,t,o){this.season=e.charAt(0).toUpperCase()+e.slice(1).toLowerCase();this.type=a;this.crop=t.charAt(0).toUpperCase()+t.slice(1);this.category=o}generateMapTrends(e,t,o,a){$("title").empty();$("#title").html(`<p>${a}</p>`);$(".label-box").empty();e.forEach(a=>{if(!t.find(e=>e.barangayName===a.barangayName)){t.push({barangay:a.barangayName,cropName:this.crop,season:this.season,[o]:0})}});t.forEach(e=>{e[o]=parseFloat(e[o])});const n=t.map(e=>e[o]);const r=n.reduce((e,a)=>e+a,0)/n.length;const i=Math.sqrt(n.map(e=>Math.pow(e-r,2)).reduce((e,a)=>e+a,0)/n.length);t.forEach(e=>{e.zScore=(e[o]-r)/i});function s(e){if(e>1.5)return"#008000";if(e>=.5)return"#FFA500";return"#FF0000"}return{barangays:e,data:t,getColor:s}}displayMapTrends(e,a,i,t,s){let l=L.layerGroup().addTo(globalMap);globalMap.eachLayer(e=>{if(e instanceof L.CircleMarker&&e.isPopupOpen()){e.closePopup()}});const{barangays:o,data:c,getColor:d}=this.generateMapTrends(e,a,i,t);setTimeout(()=>{l.clearLayers();o.forEach(a=>{const{lat:e,lon:t}=getLatLon(a.coordinates);const o=c.find(e=>e.barangay===a.barangayName);if(o){const r=d(o.zScore);var n=L.circleMarker([e,t],{radius:8,color:"black",fillColor:r,fillOpacity:1}).bindPopup(`<strong>${a.barangayName}:</strong><br>${s}: ${o[i]}`).on("popupopen",function(){globalMap.panTo(n.getLatLng())});l.addLayer(n);markers.push({lat:e,lon:t,color:r,popupText:`<strong>${a.barangayName}:</strong><br>${s}: ${o[i]}`})}});interpret(c,i,s)},500)}}function interpret(e,a,t){if(e.length===0){return`
        <div class="alert alert-warning" role="alert">
            No data available.
        </div>
    `}const o=e[0].cropName;const n=aggregateProduction(e,a);const r=n.filter(e=>e.total!==0);const i=n.filter(e=>e.total===0);if(r.length===0){return`
        <div class="alert alert-warning" role="alert">
            No productive data available for ${o}.
        </div>
    `}const s=[...r].sort((e,a)=>a.total-e.total);const l=s.map(e=>e.barangay);const c=s.map(e=>e.total);const d=s.map((e,a)=>`
    <li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: #f9f9f9;">
        <span>${a+1}. ${e.barangay}</span>
        <span class="badge" style="background-color: #4CAF50; color: white;">${e.total}</span>
    </li>
`).join("");const p=i.length>0?`<p class="text-danger">Data not available for: ${i.map(e=>e.barangay).join(", ")}.</p>`:"";const g=`
    <canvas id="pieChart" style="max-height: 50rem;"></canvas>
`;let u=`
    <div class="container mt-5">
        <h3 class="text-success" style="font-size: 1.8rem;">
            ${t.replace(/\b\w/g,e=>e.toUpperCase())} for <strong>${o}</strong>
        </h3>
        <p class="text-muted">
            This analysis is about ${o}'s performance in the barangay, aiding in resource allocation metrics and decision-making based on trends and growth rates.
        </p>

        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="card" style="background-color: #e9f5e9;">
                    <div class="card-body">
                        ${g}
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card" style="background-color: #e0f7fa;">
                    <div class="card-header" style="background-color: #4CAF50; color: white;">
                        <h5 class="mb-0">Ranking</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${d}
                    </ul>
                    <div class="card-body">
                        ${p}
                    </div>
                </div>
            </div>
        </div>
        <small class="text-muted">Note: Findings are based on available data only.</small>
    </div>
`;$("#interpretation").html(u);const h=document.getElementById("pieChart").getContext("2d");new Chart(h,{type:"pie",data:{labels:l,datasets:[{label:`Total ${formatKey(a)}`,data:c,backgroundColor:generateColors(c.length),borderColor:"#fff",borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(e){return`${e.label}: ${e.raw}`}}},datalabels:{color:"white"}}},plugins:[ChartDataLabels]});printDataMap={markers:markers,interpretation:u,pieData:c,pieLabels:l,key:a}}function generateColors(a){const t=[];for(let e=0;e<a;e++){t.push(`hsl(${e*360/a}, 70%, 50%)`)}return t}function formatKey(e){const a=e.replace(/([A-Z])/g," $1").trim();return a.charAt(0).toUpperCase()+a.slice(1)}function aggregateProduction(e,o){const n={};e.forEach(e=>{const a=e.barangay;const t=e[o]||0;if(!n[a]){n[a]={barangay:a,total:0}}n[a].total+=t});return Object.values(n)}async function updateCropOptions(){const e=$("#type").val().toLowerCase();const a=$("#season").val().toLowerCase();let t="";try{if(e==="rice"){t='<option value="rice">Rice</option>'}else{const n=await getUniqueCropNames(a,e);t=n.length>0?n.map(e=>`<option value="${e}">${e.charAt(0).toUpperCase()+e.slice(1)}</option>`).join(""):'<option value="">No crops available</option>'}}catch(o){console.error("Failed to update crop options:",o);t='<option value="">Error loading crops</option>'}$("#crop").html(t)}async function handleCategoryChange(){const e=$("#season").val();const a=$("#type").val();const t=$("#crop").val();const o=$("#category").val();if(!t){$(".available").hide();$("#unavailable").show();$("#interpretation").hide();return}else{}let n,r=[],i=[],s,l,c;l=await getYearRange();downloadYR=l;switch(o){case"area_planted":s="areaPlanted";if(t==="rice"){i=await getRiceProduction(t,e);}else{i=await getProduction(t,e)}n=`Area Planted Per Barangay (${l})`;r=stats.countAverageAreaPlantedBarangay(i);c="area planted";break;case"production_volume":s="volumeProductionPerHectare";if(t==="rice"){i=await getRiceProduction(t,e);}else{i=await getProduction(t,e)}n=`Production Volume per Hectare Per Barangay (${l})`;r=stats.averageVolumeProductionBarangay(i);c="production volume per hectare";break;case"pest_occurrence":s="pestOccurrence";i=await getPest(t,e);n=`Pest Occurrence Per Barangay (${l})`;r=stats.countPestOccurrenceBarangay(i);c="pest occurrence";break;case"disease_occurrence":s="diseaseOccurrence";i=await getDisease(t,e);n=`Disease Occurrence Per Barangay (${l})`;r=stats.countDiseaseOccurrenceBarangay(i);c="disease occurrence";break;case"price_income_per_hectare":s="incomePerHectare";i=await getProduction(t,e);n=`Price Income per Hectare Per Barangay (${l})`;r=stats.priceIncomePerHectareBarangay(i);c="price income per hectare";break;case"profit_per_hectare":s="profitPerHectare";i=await getProduction(t,e);n=`Profit per Hectare Per Barangay (${l})`;r=stats.profitPerHectareBarangay(i);c="profit per hectare";break;case"damages":n=`Damages Report (${l})`;s="damagePercentage";i=await getDamages(t,e);r=stats.calculateDamagePerBarangay(i);c="damage percentage";break;default:n="Category not recognized"}if(r.length!==0&&t!==null){$("#unavailable").hide();$(".available").show();$("#interpretation").show();const g=new MapTrends(e,a,t,n);g.displayMapTrends(barangays,r,s,n,c);currentType=s}else{$(".available").hide();$("#interpretation").hide();$("#unavailable").show()}downloadData=r;const d=downloadData[0]?Object.keys(downloadData[0]):[];function p(a){return d.every(e=>a.hasOwnProperty(e))}downloadData=downloadData.filter(p)}function populateCategoryOptions(e){const t=document.getElementById("category");t.innerHTML="";const o={production_volume:"Average Production Volume",price_income_per_hectare:"Average Income",profit_per_hectare:"Average Profit",area_planted:"Average Area Planted",price:"Average Price",pest_occurrence:"Pest Occurrence",disease_occurrence:"Disease Occurrence",damages:"Damages Report"};let a;if(e==="Rice"){a=["production_volume","area_planted"]}else{a=Object.keys(o)}a.forEach(e=>{const a=document.createElement("option");a.value=e;a.textContent=o[e];t.appendChild(a)})}$(document).ready(async function(){await initializeGlobalMap();await initializeBarangays();await updateCropOptions();await handleCategoryChange();$("#type").on("change",function(){const e=$(this).val();populateCategoryOptions(e);updateCropOptions().then(()=>handleCategoryChange())});$("#season").on("change",function(){updateCropOptions().then(()=>handleCategoryChange())});$("#category, #crop").on("change",handleCategoryChange);$(document).ready(function(){$(".download-btn").click(function(){Dialog.downloadDialog().then(e=>{download(e,currentType,downloadData)})["catch"](e=>{console.error("Error:",e)})})})});function getLatLon(e){const[a,t]=e.split(",").map(parseFloat);return{lat:a,lon:t}}async function download(e,a,t){const o=`${a.toLowerCase()}.${e}`;if(e==="csv"){downloadCSV(t)}else if(e==="xlsx"){downloadExcel(t)}else if(e==="pdf"){downloadPDF(o)}}function formatHeader(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}function formatWithPesoSign(e,a){const t=["incomePerHectare","profitPerHectare","price","totalIncome","totalProductionCost"];if(t.includes(e)){return a?`₱${parseFloat(a).toFixed(2)}`:""}return a}function downloadCSV(e){if(!e||e.length===0){console.error("No data available to download.");return}function n(e){if(e===undefined||e===null)return"";if(typeof e==="string"&&(e.includes(",")||e.includes('"')||e.includes("\n"))){e=`"${e.replace(/"/g,'""')}"`}return e}const a=Object.keys(e[0]);const t=[a.join(","),...e.map(o=>a.map(e=>{const a=o[e];const t=formatWithPesoSign(e,a);return t||n(a)}).join(","))].join("\n");const o=`Map Trends Crops Data Barangay.csv`;const r=new Blob([t],{type:"text/csv"});const i=URL.createObjectURL(r);const s=document.createElement("a");s.href=i;s.download=o;document.body.appendChild(s);s.click();document.body.removeChild(s);URL.revokeObjectURL(i);addDownload(o,"CSV")}function downloadExcel(e){if(!e||e.length===0){console.error("No data available to download.");return}const o=Object.keys(e[0]);const a=new ExcelJS.Workbook;const t={font:{name:"Calibri",size:12,bold:true,color:{argb:"FFFFFFFF"}},fill:{type:"pattern",pattern:"solid",fgColor:{argb:"B1BA4D"}},alignment:{horizontal:"center",vertical:"middle"},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const n=a.addWorksheet("Map Trends Crops Data");n.addRow(["Crops Data"]).font={bold:true};const r=n.addRow(o);r.eachCell(e=>{e.style=t});e.forEach(t=>{const e=o.map(e=>{const a=t[e];return formatWithPesoSign(e,a)||a});const a=n.addRow(e);a.eachCell(e=>{e.border={top:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}}}})});n.columns.forEach(e=>{e.width=20});const i=`Map Trends Crops Data Barangay.xlsx`;a.xlsx.writeBuffer().then(e=>{const a=new Blob([e],{type:"application/octet-stream"});const t=URL.createObjectURL(a);const o=document.createElement("a");o.href=t;o.download=i;document.body.appendChild(o);o.click();document.body.removeChild(o);URL.revokeObjectURL(t)});addDownload(i,"XLSX")}function downloadPDF(e){sessionStorage.setItem("printDataMap",JSON.stringify(printDataMap));const a=window.open("/print-map-trends","_blank");addDownload(e,"PDF")}