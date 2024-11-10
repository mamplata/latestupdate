import Dialog from"../helpers/Dialog.js";import{addDownload,getYearRange}from"../../../js/fetch.js";let damages=[];class Damage{constructor(e,a,t,o,r,n,s,c,d,l){this.recordId=e;this.barangay=a;this.cropName=t;this.variety=o;this.numberOfFarmers=r;this.areaAffected=n;this.yieldLoss=s;this.grandTotalValue=c;this.season=d;this.monthYear=l}async addDamage(e){function a(a,t){const o=[];for(let e=0;e<a.length;e+=t){o.push(a.slice(e,e+t))}return o}const t=20;const o=e.length;const r=a(e,t);let n=0;const s=(e,a)=>{$("#progressMessage").text(`Uploading ${e}-${a}/${o}`)};$("#loader").show();$("body").addClass("no-scroll");for(const[d,l]of r.entries()){const i=n+1;const m=i+l.length-1;s(i,m);try{await $.ajax({url:"/api/damages-batch",method:"POST",data:{damageData:l,_token:$('meta[name="csrf-token"]').attr("content")}});n+=l.length}catch(c){console.error(`Error sending batch ${d+1}:`,c.responseText)}}$("#loader").hide();$("body").removeClass("no-scroll");toastr.success("Damage data uploaded successfully!","Success",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-success-custom"});getDamages()}updateDamage(a){const e=damages.find(e=>e.recordId===a.recordId);if(e&&e.recordId!==a.recordId){alert("Damage ID already exists");return}damages=damages.map(e=>e.recordId===a.recordId?{...e,...a}:e);fetch(`/api/damages/${a.recordId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(e=>e.json()).then(e=>{})["catch"](e=>{console.error("Error:",e)});getDamages()}removeDamage(e){$.ajax({url:"/api/damagesByRecords",method:"DELETE",data:{damageData:e,_token:$('meta[name="csrf-token"]').attr("content")},success:function(e){},error:function(e){console.error(e.responseText)}});getDamages()}}function getDamages(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}});$.ajax({url:"/api/damages",method:"GET",success:function(e){damages=e;},error:function(e,a,t){console.error("Error fetching damages:",t)}})}function initializeMethodsDamage(){function s(e){const a=e.toLowerCase();const t=damages.filter(e=>{return Object.values(e).some(e=>e.toString().toLowerCase().includes(a))});return t}var c=5;var d=1;async function a(e=null){await new Promise(e=>setTimeout(e,1e3));$("#damageTableBody").empty();var a=(d-1)*c;var t=a+c;const o=e?s(e):damages;if(o.length>0){for(var r=a;r<t;r++){if(r>=o.length){break}var n=o[r];$("#damageTableBody").append(`
          <tr data-index=${n.damageId}>
            <td>${n.barangay}</td>
            <td>${n.cropName}</td>
            <td>${n.variety}</td>
            <td>${n.numberOfFarmers}</td>
            <td>${n.areaAffected}</td>
            <td>${(n.yieldLoss*100).toFixed(2)}%</td>
            <td>₱${n.grandTotalValue}</td>
            <td>${n.season}</td>
            <td>${n.monthYear}</td>
          </tr>
        `)}}else{$("#damageTableBody").append(`
        <tr>
          <td colspan="9">No results found!</td>
        </tr>
      `)}$("#damageTable").trigger("update")}$("#search").on("input",function(){let e=$("#search").val();a(e)});$("#prevBtn").click(function(){if(d>1){d--;a($("#search").val())}});$("#nextBtn").click(function(){var e=Math.ceil(s($("#search").val()).length/c);if(d<e){d++;a($("#search").val())}});$(document).ready(function(){$(".download-btn").click(function(){Dialog.downloadDialog().then(e=>{t(e,damages)})["catch"](e=>{console.error("Error:",e)})})});let o="";async function e(){o=await getYearRange()}e();function t(e,a){const t=`Damages Report ${o}`;if(e==="csv"){r(t,a)}else if(e==="xlsx"){n(t,a)}else if(e==="pdf"){l(t,a)}}function r(e,a){const t={barangay:"Barangay",cropName:"Commodity",variety:"Variety",numberOfFarmers:"Number of Farmers Affected",areaAffected:"Total Area Affected (ha)",yieldLoss:"Yield Loss (%)",grandTotalValue:"Grand Total Value",season:"Season",monthYear:"Month Year"};const o=["barangay","cropName","variety","numberOfFarmers","areaAffected","yieldLoss","grandTotalValue","season","monthYear"];const r=o.map(e=>t[e]);function n(e){if(e===undefined||e===null)return"";if(typeof e==="string"&&(e.includes(",")||e.includes('"')||e.includes("\n"))){e=`"${e.replace(/"/g,'""')}"`}return e}const s=[r.join(","),...a.map(t=>o.map(e=>{let a=t[e]!==undefined?t[e]:"";if(e==="grandTotalValue"){return a?`₱${parseFloat(a).toFixed(2)}`:""}return n(a)}).join(","))].join("\n");const c=new Blob([s],{type:"text/csv"});const d=URL.createObjectURL(c);const l=document.createElement("a");l.href=d;l.download=e;document.body.appendChild(l);l.click();document.body.removeChild(l);URL.revokeObjectURL(d);addDownload(e,"CSV")}function n(r,e){const o={barangay:"Barangay",cropName:"Commodity",variety:"Variety",numberOfFarmers:"Number of Farmers Affected",areaAffected:"Total Area Affected (ha)",yieldLoss:"Yield Loss (%)",grandTotalValue:"Grand Total Value",season:"Season",monthYear:"Month Year"};const n=["barangay","cropName","variety","numberOfFarmers","areaAffected","yieldLoss","grandTotalValue","season","monthYear"];const a=n.map(e=>o[e]);const t=e.map(a=>{const t={};n.forEach(e=>{t[o[e]]=a[e]});return t});const s=new ExcelJS.Workbook;const c=s.addWorksheet(r);c.addRow(a);t.forEach(t=>{c.addRow(n.map(e=>{const a=t[o[e]];if(e==="grandTotalValue"){return a?`₱${parseFloat(a).toFixed(2)}`:""}return a}))});const d={font:{name:"Calibri",size:12,bold:true,color:{argb:"FFFFFFFF"}},fill:{type:"pattern",pattern:"solid",fgColor:{argb:"203764"}},alignment:{horizontal:"center",vertical:"middle"},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const l={font:{name:"Calibri",size:11},alignment:{horizontal:"center",vertical:"middle",wrapText:true},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const i=c.getRow(1);i.eachCell({includeEmpty:true},e=>{e.style=d});i.height=20;c.eachRow({includeEmpty:true},(e,a)=>{if(a>1){e.eachCell({includeEmpty:true},e=>{e.style=l})}});c.columns=a.map(e=>({width:Math.max(e.length,10)+5}));s.xlsx.writeBuffer().then(function(e){const a=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});const t=URL.createObjectURL(a);const o=document.createElement("a");o.href=t;o.download=r;o.click();URL.revokeObjectURL(t)});addDownload(r,"XLSX")}function l(e,a){const{jsPDF:t}=window.jspdf;const o=new t("landscape");const r=[...new Set(a.flatMap(Object.keys))];const n=r.filter(e=>!e.toLowerCase().includes("id"));const s=n.slice(0,n.length-2);const c=s.map(i);const d=e=>{if(typeof e==="number"){return e.toFixed(2)}return e};o.autoTable({head:[c],body:a.map(t=>s.map(e=>{let a=t[e];return d(a)})),theme:"striped"});o.save(e);addDownload(e,"PDF")}function i(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/_/g," ").split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}getDamages();a()}function isNumeric(e){if(!isNaN(e)&&!isNaN(parseFloat(e))){return true}const a=/^\d+-\d+$/;if(a.test(e)){const[t,o]=e.split("-").map(Number);if(!isNaN(t)&&!isNaN(o)&&t<=o){return true}}return false}async function processDamageData(e,o,a,t,r){var n=e.SheetNames[0];var s=e.Sheets[n];var c=getKeyBySubstring(o,"Grand Total Value");var d=XLSX.utils.decode_range(s["!ref"]);let l=[];for(var i=d.s.r+1;i<=d.e.r;i++){var m=c.charAt(0)+(i+1);var g=s[m]?s[m].v:"";if(!isNumeric(g)){continue}var u={};Object.keys(o).forEach(function(e){var a=o[e].charAt(0)+(i+1);var t=s[a]?s[a].v:"";if(e==="Yield Loss (%)"){if(t>1){t/=100}}u[e]=t});var f=new Damage(a,getKeyBySubstring(u,"Barangay"),getKeyBySubstring(u,"Commodity"),getKeyBySubstring(u,"Variety"),getKeyBySubstring(u,"Number of Farmers Affected"),getKeyBySubstring(u,"Total Area Affected"),getKeyBySubstring(u,"Yield Loss"),getKeyBySubstring(u,"Grand Total Value"),t,r);l.push(f)}var h=damages.find(e=>e.recordId===l[0].recordId);if(h){await l[0].removeDamage(l)}l[0].addDamage(l);return damages}function getKeyBySubstring(a,e){const t=e.trim().toLowerCase();for(let e in a){if(e.trim().toLowerCase().includes(t)){return a[e]}}return null}export{Damage,getDamages,damages,initializeMethodsDamage,processDamageData};