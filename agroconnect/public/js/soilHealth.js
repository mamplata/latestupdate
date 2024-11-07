import{addDownload,getYearRange}from"./fetch.js";import Dialog from"../management/components/helpers/Dialog.js";$(document).ready(function(){let t,o,a;let n;let p;let d=[];$(document).ready(function(){$("#infoBtn").click(function(){let e=`
    <p>Welcome to the Soil Health Monitoring page. This tool allows you to monitor and analyze the average soil health in Cabuyao by tracking key soil parameters. Follow these instructions to use the tool effectively:</p>

    <ol>
      <li><strong>Monitor Soil Health:</strong><br>
      This page provides an overview of soil health based on data collected from soil test kits provided to local farmers. Key parameters monitored include:
        <ul>
          <li><strong>Nitrogen (N):</strong> The amount of nitrogen in the soil, which is essential for plant growth.</li>
          <li><strong>Phosphorus (P):</strong> The amount of phosphorus present, which supports root development and energy transfer.</li>
          <li><strong>Potassium (K):</strong> The amount of potassium, which helps in disease resistance and overall plant health.</li>
          <li><strong>pH Levels:</strong> The acidity or alkalinity of the soil, affecting nutrient availability and microbial activity.</li>
          <li><strong>General Rating:</strong> An overall rating of soil fertility based on the combined results of NPK and pH levels.</li>
        </ul>
      </li>

      <li><strong>View Average Soil Health:</strong><br>
      The page displays average values for NPK, pH, and general rating across different fields and areas within Cabuyao. This helps in understanding the overall soil health in the city.</li>

      <li><strong>Update Soil Health Records:</strong><br>
      Regular updates are made based on new soil test results. Farmers are encouraged to submit their soil test data to ensure continuous monitoring and accurate assessments.</li>

      <li><strong>Download Soil Health Data:</strong><br>
      You can download the soil health data in various formats for offline review and analysis:
        <ul>
          <li><strong>CSV:</strong> Download raw soil health data in CSV format for use in data analysis tools.</li>
          <li><strong>Excel:</strong> Download the data in Excel format, including formatted tables for easy review and manipulation.</li>
          <li><strong>PDF:</strong> Download a summary of soil health data through a table, in PDF format for sharing or reporting.</li>
        </ul>
      </li>
    </ol>

    <p>This tool is designed to provide comprehensive monitoring of soil health in Cabuyao. By utilizing the provided data and download options, you can keep track of soil conditions and make informed decisions to maintain and improve soil fertility in the area.</p>
    `;Dialog.showInfoModal(e)})});async function e(){try{p=await getYearRange();}catch(e){console.error("Error fetching year range:",e)}}e();fetch("api/soilhealths").then(e=>e.json()).then(e=>{t=e.filter(e=>e.fieldType==="Vegetables");o=e.filter(e=>e.fieldType==="Rice");a=e.filter(e=>e.fieldType==="Fruit Trees");r("vegetables",t);r("rice",o);r("fruits",a);$(document).ready(function(){$(".download-btn").click(function(){Dialog.downloadDialog().then(e=>{n=$(this).data("type");if(n==="vegetables"){c(e,"Vegetables",t)}else if(n==="rice"){c(e,"Rice",o)}else if(n==="fruits"){c(e,"Fruits",a)}})["catch"](e=>{console.error("Error:",e)})})})})["catch"](e=>console.error("Error fetching data:",e));function r(t,o){if(o.length===0){$(`#${t}-body`).html('<p class="h3">Data is not available for now.</p>');$(`.download-btn[data-type="${t}"]`).hide()}else{let a=g(o);$(`#${t}-phosphorus`).html(`${a.phosphorus.value} <br>(${a.phosphorus.percentage}%)`);$(`#${t}-nitrogen`).html(`${a.nitrogen.value} <br>(${a.nitrogen.percentage}%)`);$(`#${t}-potassium`).html(`${a.potassium.value} <br> (${a.potassium.percentage}%)`);$(`#${t}-ph`).html(`${a.ph.value} <br>(${a.ph.percentage}%)`);$(`#${t}-general`).html(`${a.generalRating.value} <br> (${a.generalRating.percentage}%)`);const r={labels:["Phosphorus","Nitrogen","Potassium","pH","General Rating"],datasets:[{label:"Average Nutrient Levels",data:[a.phosphorus.percentage,a.nitrogen.percentage,a.potassium.percentage,a.ph.percentage,a.generalRating.percentage],backgroundColor:["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#FF9F40"],hoverBackgroundColor:["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#FF9F40"]}]};const s={type:"doughnut",data:r,options:{responsive:true,plugins:{legend:{position:"top"},title:{display:true,text:"Nutrient Averages"},tooltip:{callbacks:{label:function(e){const t=e.chart.data.labels[e.dataIndex];let o;switch(t){case"Phosphorus":o=a.phosphorus.value;break;case"Nitrogen":o=a.nitrogen.value;break;case"Potassium":o=a.potassium.value;break;case"pH":o=a.ph.value;break;case"General Rating":o=a.generalRating.value;break}return`${t} - ${o} (${e.formattedValue}%)`}}},datalabels:{color:"white"}}},plugins:[ChartDataLabels]};const i=Chart.getChart(`${t}Chart`);if(i){i.destroy()}new Chart(document.getElementById(`${t}Chart`),s);const l=$(`#${t}Breakdown`);l.empty();const c={rice:{npk:{nitrogen:{level:"High",description:"Nitrogen is crucial for rice, promoting leaf and tiller growth, and enhancing grain yield. Rice plants typically require higher nitrogen levels, particularly during the vegetative stage for robust growth and development."},phosphorus:{level:"Moderate",description:"Phosphorus supports root development and early growth in rice plants. It is also important for energy transfer and grain formation. Rice usually needs moderate amounts of phosphorus."},potassium:{level:"Moderate to High",description:"Potassium is essential for improving disease resistance, water regulation, and grain quality in rice. It helps in strengthening plant cells and is important for grain filling, so moderate to high levels of potassium are required."}},ph:{level:"Moderate",description:"A pH level between 5.5 and 7.0 is considered moderate, supporting nutrient availability for rice."},generalRating:{rating:"Moderate",description:"A general rating of 'Moderate' is optimal for rice. High nutrient levels can lead to lodging."}},vegetables:{npk:{nitrogen:{level:"Moderate to High",description:"Vegetables generally require balanced NPK ratios. Leafy greens benefit from higher nitrogen levels, while root vegetables thrive on higher potassium."},phosphorus:{level:"Moderate",description:"Phosphorus is vital for root development and flower formation in many vegetable crops."},potassium:{level:"Moderate",description:"Adequate potassium is crucial for water regulation and overall plant health."}},ph:{level:"Moderate",description:"A pH of 6.0 to 7.0 is considered moderate and is ideal for most vegetables, promoting nutrient uptake."},generalRating:{rating:"High",description:"Aim for a general rating of 'High' to ensure optimal growth and yield for most vegetable crops."}},fruits:{npk:{nitrogen:{level:"Moderate",description:"Fruits generally benefit from moderate nitrogen levels to support leaf growth without sacrificing fruit development."},phosphorus:{level:"Moderate",description:"Important during the flowering stage to promote fruit set and development."},potassium:{level:"High",description:"Essential for fruit quality and yield, especially during the maturation phase."}},ph:{level:"Moderate",description:"A slightly acidic pH of 6.0 to 6.8 is considered moderate for many fruit-bearing plants, helping to maximize nutrient absorption."},generalRating:{rating:"Moderate to High",description:"A general rating of 'Moderate' to 'High' is recommended for fruit crops, as it ensures good growth and quality."}}};function n(e){switch(e){case"Low":return{background:"bg-l",textColor:"text-white"};case"Moderately Low":return{background:"bg-ml",textColor:"text-dark"};case"Moderately High":return{background:"bg-mh",textColor:"text-dark"};case"High":return{background:"bg-h",textColor:"text-white"};default:return{background:"bg-light",textColor:"text-dark"}}}const p=`
<div class="container mt-4">
    <h4>${t.charAt(0).toUpperCase()+t.slice(1)} Nutrients</h4>
    <hr />
    <div class="card mb-3">
        <div class="card-body">
            <div class="${n(a.nitrogen.value).background} ${n(a.nitrogen.value).textColor} p-2">
                <p><strong>Nitrogen:</strong> <span class="small">${a.nitrogen.value}</span> <span class="badge text-white bg-secondary">${a.nitrogen.percentage}%</span></p>
                <p class="small">${c[t].npk.nitrogen.description}</p>
                <p class="small"><strong>Recommended Level:</strong> ${c[t].npk.nitrogen.level}</p>
            </div>
            <hr />

            <div class="${n(a.phosphorus.value).background} ${n(a.phosphorus.value).textColor} p-2">
                <p><strong>Phosphorus:</strong> <span class="small">${a.phosphorus.value}</span> <span class="badge text-white bg-secondary">${a.phosphorus.percentage}%</span></p>
                <p class="small">${c[t].npk.phosphorus.description}</p>
                <p class="small"><strong>Recommended Level:</strong> ${c[t].npk.phosphorus.level}</p>
            </div>
            <hr />
            
            <div class="${n(a.potassium.value).background} ${n(a.potassium.value).textColor} p-2">
                <p><strong>Potassium:</strong> <span class="small">${a.potassium.value}</span> <span class="badge text-white bg-secondary">${a.potassium.percentage}%</span></p>
                <p class="small">${c[t].npk.potassium.description}</p>
                <p class="small"><strong>Recommended Level:</strong> ${c[t].npk.potassium.level}</p>
            </div>
            <hr />
            
            <div class="${n(a.ph.value).background} ${n(a.ph.value).textColor} p-2">
                <p><strong>pH:</strong> <span class="small">${a.ph.value}</span> <span class="badge text-white bg-secondary">${a.ph.percentage}%</span></p>
                <p class="small">${c[t].ph.description}</p>
                <p class="small"><strong>Recommended Level:</strong> ${c[t].ph.level}</p>
            </div>
            <hr />
            
            <div class="${n(a.generalRating.value).background} ${n(a.generalRating.value).textColor} p-2">
                <p><strong>General Rating:</strong> <span class="small">${a.generalRating.value}</span> <span class="badge text-white bg-secondary">${a.generalRating.percentage}%</span></p>
                <p class="small">${c[t].generalRating.description}</p>
                <p class="small"><strong>Recommended Level:</strong> ${c[t].generalRating.rating}</p>
            </div>
        </div>
    </div>
</div>
`;let e={config:s,breakdownHtml:p};switch(t){case"vegetables":case"rice":case"fruits":d.push({type:t,printDataSoil:e});break}l.append(p)}}function g(e){let t=0,o=0,a=0,n=0,r=0;let s=e.length;e.forEach(e=>{t+=i(e.phosphorusContent);o+=i(e.nitrogenContent);a+=i(e.potassiumContent);n+=i(e.pH);r+=i(e.generalRating)});return{phosphorus:l(t,s),nitrogen:l(o,s),potassium:l(a,s),ph:l(n,s),generalRating:l(r,s)}}function i(e){switch(e){case"L":return 1;case"ML":return 2;case"MH":return 3;case"H":return 4;default:return 0}}function l(e,t){let o=e/t;let a=o/4*100;return{value:s(o),percentage:a.toFixed(2)}}function s(e){if(e<=1.5)return"Low";else if(e<=2.5)return"Moderately Low";else if(e<=3.5)return"Moderately High";else return"High"}function c(e,t,o){const a=`${t.toLowerCase()}.${e}`;const n=`${t.toLowerCase()}`;if(e==="csv"){h(a,o)}else if(e==="xlsx"){u(a,o)}else if(e==="pdf"){m(a,n)}}function h(e,t){e="Soil Health_"+p+"_"+e.charAt(0).toUpperCase()+e.slice(1);const a=Object.keys(t[0]).slice(0,-2);const o=t.slice(2,-2);const n=o.sort((e,t)=>{const o=new Date(e.monthYear);const a=new Date(t.monthYear);return o-a});function r(e){if(e===undefined||e===null)return"";if(typeof e==="string"&&(e.includes(",")||e.includes('"')||e.includes("\n"))){e=`"${e.replace(/"/g,'""')}"`}return e}const s=[a.join(","),...n.map(o=>a.map(e=>{const t=o[e]!==undefined?o[e]:"";return r(t)}).join(","))].join("\n");const i=new Blob([s],{type:"text/csv"});const l=URL.createObjectURL(i);const c=document.createElement("a");c.href=l;c.download=e;document.body.appendChild(c);c.click();document.body.removeChild(c);URL.revokeObjectURL(l);addDownload(e,"CSV")}function u(n,e){n="Soil Health_"+p+"_"+n.charAt(0).toUpperCase()+n.slice(1);const o=Object.keys(e[0]).slice(2,-2);const t=e.slice(2,-2).sort((e,t)=>{const o=new Date(e.monthYear);const a=new Date(t.monthYear);return o-a});const a=new ExcelJS.Workbook;const r=a.addWorksheet("Sheet1");r.addRow(o);t.forEach(t=>{const e=o.map(e=>t[e]);r.addRow(e)});const s={font:{name:"Calibri",size:12,bold:true,color:{argb:"FFFFFFFF"}},fill:{type:"pattern",pattern:"solid",fgColor:{argb:"B1BA4D"}},alignment:{horizontal:"center",vertical:"middle"},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const i={font:{name:"Calibri",size:11},alignment:{horizontal:"center",vertical:"middle",wrapText:true},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const l=r.getRow(1);l.eachCell({includeEmpty:true},e=>{e.style=s});l.height=20;r.eachRow({includeEmpty:true},(e,t)=>{if(t>1){e.eachCell({includeEmpty:true},e=>{e.style=i})}});r.columns=o.map(e=>({width:Math.max(e.length,10)+5}));a.xlsx.writeBuffer().then(function(e){const t=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});const o=URL.createObjectURL(t);const a=document.createElement("a");a.href=o;a.download=n;a.click();URL.revokeObjectURL(o)});addDownload(n,"XLSX")}function m(e,t){const o=d.find(e=>e.type===t);if(o){sessionStorage.setItem("printDataSoil",JSON.stringify(o.printDataSoil));const a=window.open("/print-soil-health","_blank");a.onload=function(){a.print()};addDownload(e,"PDF")}else{console.error("No print data found for type:",t)}}});