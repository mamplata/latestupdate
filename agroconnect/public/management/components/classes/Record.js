import{processDiseaseData}from"../classes/Disease.js";import{processRiceProductionData}from"../classes/RiceProduction.js";import{processPestData}from"../classes/Pest.js";import{processPriceData}from"../classes/Price.js";import{processProductionData}from"../classes/Production.js";import{processDamageData}from"../classes/Damage.js";import{processSoilHealthData}from"../classes/SoilHealth.js";import Dialog from"../helpers/Dialog.js";import{user}from"../HeaderSidebar.js";let records=[];class Record{constructor(e,r,t,o,a,s,n=""){this.recordId=e;this.userId=r;this.name=t;this.season=o;this.type=s;this.monthYear=a;this.fileRecord=n}async createRecord(r){const e=records.find(e=>e.name===r.name);if(e){alert("Record with the same name already exists");return}try{const o=await fetch("/api/records",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!o.ok){const s=await o.text();throw new Error("Failed to create record")}const a=await o.json();return a.recordId}catch(t){console.error("Error:",t);return null}}async updateRecord(r){const e=records.find(e=>e.monthYear===r.monthYear&&e.type!==r.type);if(e){alert("Record with the same type already exists");return}records=records.map(e=>e.recordId===r.recordId?{...e,...r}:e);try{const o=await fetch(`/api/records/${r.recordId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!o.ok){throw new Error("Failed to update record")}const a=await o.json();return a.recordId}catch(t){console.error("Error:",t);return null}}removeRecord(r){fetch(`/api/records/${r}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(e=>{if(e.status===204){records=records.filter(e=>e.recordId!==e);}else if(e.status===404){console.error(`Record with ID ${r} not found.`)}else{console.error(`Failed to delete record with ID ${r}.`)}})["catch"](e=>{console.error("Error:",e)})}}let links="";function getRecord(e){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}});function n(e){function r(e){let r=0;if(e.endsWith("=="))r=2;else if(e.endsWith("="))r=1;let t=e.length;return t*3/4-r}function t(e){const r=["B","KB","MB","GB","TB"];let t=0;let o=e;while(o>=1024&&t<r.length-1){o/=1024;t++}return`${o.toFixed(2)} ${r[t]}`}const o=r(e);return t(o)}$.ajax({url:`/api/records/${e}`,method:"GET",xhrFields:{withCredentials:true},success:async function(e){if(Array.isArray(e)&&e.length>0){const r=e;records=[];r.forEach(e=>{let r=n(e.fileRecord);e.fileSize=r;const t=e.fileRecord;const o="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";const a=`data:${o};base64,${t}`;const s=`<button class="btn btn-sm btn-green" onclick="confirmDownload('${a}', '${e.name}.xlsx')">Download</button>`;e.downloadButton=s;e.nameString=e.name;records.push(e)})}else{records=[];}},error:function(e,r,t){console.error("Error fetching records:",t)}})}window.confirmDownload=async function(e,r){const t=await Dialog.confirmDialog("Download File","Are you sure you want to download this file?");if(t.operation===Dialog.OK_OPTION){const o=document.createElement("a");o.href=e;o.download=r;o.click()}};function searchRecord(e){if(!e)return[];const r=e.toLowerCase();const t=records.filter(e=>{return e.nameString&&e.nameString.toLowerCase().includes(r)});return t}function initializeMethodsRecord(g){getRecord(g);var R=null;var d=5;var l=1;var n=null;var w=false;async function v(e=null){await new Promise(e=>setTimeout(e,1e3));$("#recordTableBody").empty();const r=user?user.userId:null;const t=user?user.role:"admin";var o=(l-1)*d;var a=o+d;const s=t==="admin"?records:records.filter(e=>e.userId===r);if(e){const n=searchRecord(e).filter(r=>s.some(e=>e.recordId===r.recordId));const c=n.slice(o,a);if(c.length>0){c.forEach(e=>{$("#recordTableBody").append(`
                        <tr data-index=${e.recordId}>
                            <td style="display: none;">${e.recordId}</td>
                            <td>${e.nameString}</td>
                            <td>${e.fileSize}</td>
                            <td>${e.downloadButton}</td>
                        </tr>
                    `)})}else{$("#recordTableBody").append(`
                    <tr>
                        <td colspan="4">Record not found!</td>
                    </tr>
                `)}}else{const i=s.slice(o,a);if(i.length>0){i.forEach(e=>{$("#recordTableBody").append(`
                        <tr data-index=${e.recordId}>
                            <td style="display: none;">${e.recordId}</td>
                            <td>${e.nameString}</td>
                            <td>${e.fileSize}</td>
                            <td>${e.downloadButton}</td>
                        </tr>
                    `)})}else{$("#recordTableBody").append(`
                    <tr>
                        <td colspan="4">No records available!</td>
                    </tr>
                `)}}}v();$("#search").on("input",function(){let e=$("#search").val();v(e)});$("#prevBtn").click(function(){if(l>1){l--;v()}});$("#nextBtn").click(function(){var e=Math.ceil(records.length/d);if(l<e){l++;v()}});function e(e){e=e.toLowerCase();const r=["march","april","may","june","july","august"];const t=["september","october","november","december","january","february"];if(r.includes(e)){return"Dry"}else if(t.includes(e)){return"Wet"}else{return"Invalid month"}}function b(e,r){let t=[];switch(e){case"riceProduction":t=["/api/riceProductions/update-year"];break;case"production":t=["/api/productions/update-month-year"];break;case"price":t=["/api/prices/update-month-year"];break;case"pestDisease":t=["/api/pests/update-month-year","/api/diseases/update-month-year"];break;case"soilHealth":t=["/api/soilhealths/update-month-year"];break;case"damage":t=["/api/damages/update-month-year"];break;default:console.error("Unsupported data type");return}if(t.length===0){console.error("No URLs found for the data type");return}t.forEach(function(e){$.ajax({url:e,type:"POST",contentType:"application/json",data:JSON.stringify(r),success:function(e){},error:function(e){console.error("Error:",e.responseText)}})})}$("#submitBtn").click(async function(e){e.preventDefault();var a=Number($("#recordId").val());var s=user.userId;var n=$("#seasonPicker select").val();var c=g;var r=$("#nameInput").val();if(g==="riceProduction"){var t=$("#yearPicker select").val();var i=`${t}`}else{var o=$("#monthPicker select").val();var t=$("#yearPicker select").val();var i=`${o} ${t}`}var d=`${g.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/^./,e=>e.toUpperCase())}`;if(g==="damage"){d=`${r} ${d}`}if(g==="riceProduction"){d+=` ${n.replace(/^./,e=>e.toUpperCase())}`}d+=` ${i}`;var l=document.getElementById("fileRecord");var u=l.files[0];let p=P(g);try{if(u){let e=await D(u,p[0],p[4]);if(!e){toastr.success("Invalid File Format!","Invalid",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-warning"});return}const m=await u.arrayBuffer();const h=new Blob([m],{type:u.type});const y=new FileReader;y.onload=function(e){const r=e.target.result.split(",")[1];let t=new Record(a,s,d,n,i,c,r);let o=R!==null&&w?t.updateRecord(t):t.createRecord(t);o.then(e=>{if(e===undefined){console.warn("Record ID is undefined. Skipping further processing.");return}B(g,p[0],p[1],p[2],p[3],u,e,n,i);$("#lblUpload").text("Upload File:");$("#submitBtn").text("Add record");$("#cancelBtn").hide();$("#fileRecord").attr("required","required");$("#recordForm")[0].reset();getRecord(g);v();I();R=null})["catch"](e=>{console.error("Error creating/updating record:",e);toastr.error("Something went wrong.","Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error"})})};y.readAsDataURL(h)}else{if(R!==null&&w){let e=new Record(a,s,d,n,i,c,"");e.updateRecord(e).then(()=>{$("#lblUpload").text("Upload File:");$("#submitBtn").text("Add record");$("#cancelBtn").hide();$("#recordForm")[0].reset();$("#fileRecord").attr("required","required");getRecord(g);const e={recordId:a,monthYear:i,season:n};b(g,e);v();I();w=false;R=null})["catch"](e=>{console.error("Error updating record:",e);toastr.error("Something went wrong.","Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error"})})}else{toastr.success("Please select a file first!","Alert",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-info"})}}}catch(f){console.error("Error during file validation:",f);toastr.error("Something went wrong.","Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error"})}});function P(e){let r;let t;let o;let a;let s;switch(e){case"riceProduction":o="RICE PRODUCTION MONITORING REPORT";r=["Barangay","Commodity","Area Planted","Month Harvested","Volume of Production","Average Yield"];a=processRiceProductionData;break;case"production":o="PRODUCTION MONITORING REPORT";r=["Barangay","Commodity","Variety","Area Planted","Month Planted","Month Harvested","Volume of Production","Cost of Production","Farm Gate Price","Volume Sold"];a=processProductionData;break;case"price":o="PRICE MONITORING REPORT";r=["Commodity","Farm Gate Price"];a=processPriceData;break;case"pestDisease":o="PEST AND DISEASE MONITORING REPORT";r=["Farm Location","Crops Planted","Pest Observed","Total no. of Trees/Plants Planted","Total no. of Trees/Plants Affected/Damaged"];t=["Farm Location","Crops Planted","Disease Observed","Total no. of Trees/Plants Planted","Total no. of Trees/Plants Affected/Damaged"];a=processPestData;s=processDiseaseData;break;case"soilHealth":o="SOIL HEALTH MONITORING REPORT";r=["Barangay","Farmer","Field Type","Nitrogen","Phosphorus","Potassium","pH","General Fertility","Recommendations"];a=processSoilHealthData;break;case"damage":o="DAMAGE MONITORING REPORT";r=["Barangay","Commodity","Variety","Number of Farmers Affected","Total Area affected","Yield Loss","Grand Total Value"];a=processDamageData;break;default:console.error("Unknown data type")}return[r,t,a,s,o]}function D(r,m,e){m.push(e);return new Promise((p,f)=>{const e=new FileReader;e.onload=function(e){try{const t=e.target.result;const o=XLSX.read(new Uint8Array(t),{type:"array"});const a=m.map(h);const s=new Set;for(let e of o.SheetNames){const c=o.Sheets[e];const i=XLSX.utils.decode_range(c["!ref"]);for(let r=i.s.r;r<=i.e.r;r++){for(let e=i.s.c;e<=i.e.c;e++){const d=XLSX.utils.encode_cell({r:r,c:e});const l=c[d];if(l&&l.v){const u=l.v;if(y(u,a)){a.forEach(e=>{if(y(u,[e])){s.add(e)}})}}}}}const n=a.every(e=>s.has(e));p(n)}catch(r){f(r)}};e.onerror=function(e){f(e.target.error)};e.readAsArrayBuffer(r)})}function B(o,a,s,n,c,e,i,d,l){const r=new FileReader;r.onload=function(e){const r=e.target.result;const t=XLSX.read(r,{type:"binary"});if(o==="pestDisease"){u(t,a,n,i,d,l);u(t,s,c,i,d,l)}else{u(t,a,n,i,d,l)}};r.readAsBinaryString(e)}function h(e){if(typeof e!=="string"){e=String(e)}return e.toLowerCase()}function y(e,r){const o=h(e);return r.some(e=>{const r=h(e);const t=new RegExp(`\\b${r}\\b`,"i");return t.test(o)})}function u(r,e,t,o,a,s){let n={};const c=e.map(h);r.SheetNames.forEach(e=>{const t=r.Sheets[e];const o=XLSX.utils.decode_range(t["!ref"]);for(let r=o.s.r+1;r<=o.e.r;r++){for(let e=o.s.c;e<=o.e.c;e++){const a=XLSX.utils.encode_cell({r:r,c:e});const s=t[a];if(s&&s.v&&y(s.v,c)){n[s.v]=a}}}});const i=t(r,n,o,a,s)}function I(){$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true);R=null;$("#recordTableBody tr").removeClass("selected-row")}$("#editBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Edit","Are you sure you want to edit this record?");if(e.operation===1){$("#dataEdit").text("record");$("#cancelBtn").show();$("#recordId").val(n.recordId);w=true;var r=n.monthYear;var t=r.split(" ");var o=t[0];var a=t[1];var s=n.season;$("#seasonPicker select").val(s);$("#monthPicker select").val(o);$("#yearPicker select").val(a);if(g==="riceProduction"){var a=n.monthYear;$("#yearPicker select").val(a)}$("#fileRecord").removeAttr("required");$("#lblUpload").text("Insert New File (optional):");$("#submitBtn").text("Update Record")}else{}$("#recordTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#cancelEdit").click(function(){I()});$("#cancelBtn").click(function(){R=null;$("#lblUpload").text("Upload File:");$("#submitBtn").text("Add Record");$("#fileRecord").attr("required","required");$("#cancelBtn").hide();$("#recordTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#deleteBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Deletion","Are you sure you want to delete this record?");if(e.operation===1){let e=new Record;e.removeRecord(n.recordId);getRecord(g);v();I()}else{$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)}});$("#cancelDelete").click(function(){I()});$("#recordTableBody").on("click","tr",function(){var e=$(this);var r=e.data("index");n=records.find(e=>e.recordId===r);R=r;if(R!==null){$("#recordTableBody tr").removeClass("selected-row");$("#recordTableBody tr").filter(function(){return parseInt($(this).find("td:eq(0)").text(),10)===R}).addClass("selected-row");$("#editBtn").prop("disabled",false);$("#deleteBtn").prop("disabled",false)}else{$("#recordTableBody tr").removeClass("selected-row")}})}export{Record,getRecord,searchRecord,records,initializeMethodsRecord};