import Dialog from"../helpers/Dialog.js";import{addDownload}from"../../../js/fetch.js";let farmers=[];let barangayArray=[];class Farmer{constructor(e,r,a,t,n,o){this.barangayId=e;this.farmerId=r;this.farmerName=a;this.fieldArea=t;this.fieldType=n;this.phoneNumber=o!==null?String(o):" "}createFarmer(r){const e=farmers.find(e=>e.farmerName===r.farmerName);if(e){alert("Farmer already exists");return}$.ajax({url:"/api/farmers",type:"POST",contentType:"application/json",data:JSON.stringify(r),success:function(e){},error:function(e){console.error("Error:",e)}})}updateFarmer(r){const e=farmers.find(e=>e.farmerName===r.farmerName);if(e&&e.farmerId!==r.farmerId){alert("Farmer already exists");return}farmers=farmers.map(e=>e.farmerId===r.farmerId?{...e,...r}:farmers);fetch(`/api/farmers/${r.farmerId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(e=>e.json()).then(e=>{})["catch"](e=>{console.error("Error:",e)})}removeFarmer(r){fetch(`/api/farmers/${r}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(e=>{if(e.status===204){farmers=farmers.filter(e=>e.farmerId!==e)}else if(e.status===404){console.error(`Farmer with ID ${r} not found.`)}else{console.error(`Failed to delete farmer with ID ${r}.`)}})["catch"](e=>{console.error("Error:",e)})}}function getFarmer(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}});$.ajax({url:"/api/farmers",method:"GET",success:function(e){let r=e;farmers=r},error:function(e,r,a){console.error("Error fetching farmers:",a)}})}getFarmer();function getBarangayNames(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}});$.ajax({url:"/api/barangays",method:"GET",success:function(e){const r=e;barangayArray=r;const a=$("#barangay-option");a.empty();a.append(`<option value="" disabled selected>Select Barangay</option>`);r.forEach(e=>{a.append(`<option value="${e.barangayId}">${e.barangayName}</option>`)})},error:function(e,r,a){console.error("Error fetching barangays:",a)}})}function searchFarmer(e){const n=e.toLowerCase();const r=farmers.filter(e=>{const r=Object.values(e).some(e=>e!==null&&e.toString().toLowerCase().includes(n));const a=getBarangayName(e.barangayId);const t=a&&a.toLowerCase().includes(n);return r||t});return r}function getBarangayName(r){const e=barangayArray.find(e=>e.barangayId===r);return e?e.barangayName:null}function getBarangayId(r){const e=barangayArray.find(e=>e.barangaName===r);return e?e.barangayId:null}function initializeMethodsFarmer(){var i=null;var o=5;var l=1;var a=null;var s=false;async function c(e=null){await new Promise(e=>setTimeout(e,1e3));$("#farmerTableBody").empty();if(e){const r=searchFarmer(e);const a=(l-1)*o;const t=a+o;const n=r.slice(a,t);if(n.length>0){n.forEach(e=>{$("#farmerTableBody").append(`
                        <tr data-index=${e.farmerId}>
                            <td style="display: none;">${e.farmerId}</td>
                            <td>${getBarangayName(e.barangayId)}</td>
                            <td>${e.farmerName}</td>
                            <td>${e.fieldArea}</td>
                            <td>${e.fieldType}</td>
                            <td>${e.phoneNumber!==null?e.phoneNumber:"NA"}</td>
                        </tr>
                    `)})}else{$("#farmerTableBody").append(`
                    <tr>
                        <td colspan="6">No farmers found!</td>
                    </tr>
                `)}}else{const n=farmers.slice((l-1)*o,l*o);if(n.length>0){n.forEach(e=>{$("#farmerTableBody").append(`
                        <tr data-index=${e.farmerId}>
                            <td style="display: none;">${e.farmerId}</td>
                            <td data-barangay-id=${e.barangayId}>${getBarangayName(e.barangayId)}</td>
                            <td>${e.farmerName}</td>
                            <td>${e.fieldArea}</td>
                            <td>${e.fieldType}</td>
                            <td>${e.phoneNumber!==null?e.phoneNumber:"NA"}</td>
                        </tr>
                    `)})}else{$("#farmerTableBody").append(`
                    <tr>
                        <td colspan="6">No farmers available!</td>
                    </tr>
                `)}}}c();$("#search").on("input",function(){let e=$("#search").val();c(e)});$("#prevBtn").click(function(){if(l>1){l--;c()}});$("#nextBtn").click(function(){var e=Math.ceil(farmers.length/o);if(l<e){l++;c()}});$("#submitBtn").click(function(e){e.preventDefault();const r=document.getElementById("farmerForm");if(!r.checkValidity()){r.reportValidity();return}var a=Number($("#farmerId").val());var t=$("#farmerName").val();var n=parseInt($("#fieldArea").val(),10);var o=$("#fieldType").val();var l=$("#phoneNumber").val();var d=parseInt($("#barangay-option").val(),10);if(i!==null&&s){let e=new Farmer(d,a,t,n,o,l);e.updateFarmer(e);i=null;$("#submitBtn").text("Add farmer");$("#cancelBtn").hide();m();s=false}else{let e=new Farmer(d,a,t,n,o,l);e.createFarmer(e)}$("#farmerForm")[0].reset();i=null;$("#farmerTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true);getFarmer();c()});function m(){$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true);i=null;$("#farmerTableBody tr").removeClass("selected-row")}$("#editBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Edit","Are you sure you want to edit this farmer's details?");if(e.operation===1){$("#editModal").modal("hide");$("#cancelBtn").show();$("#farmerId").val(a.farmerId);$("#farmerName").val(a.farmerName);$("#fieldArea").val(a.fieldArea);$("#fieldType").val(a.fieldType);$("#phoneNumber").val(a.phoneNumber);$("#barangay-option").val(a.barangayId);$("#submitBtn").text("Update Farmer")}$("#farmerTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#cancelEdit").click(function(){m()});$("#cancelBtn").click(function(){i=null;$("#farmerForm")[0].reset();$("#submitBtn").text("Add Farmer");$("#cancelBtn").hide();$("#farmerTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#deleteBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Deletion","Are you sure you want to delete this farmer?");if(e.operation===1){let e=new Farmer;e.removeFarmer(a.farmerId);getFarmer();c();m();s=true}else{$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)}});$("#cancelDelete").click(function(){m()});$("#farmerTableBody").on("click","tr",function(){var e=$(this);var r=e.data("index");a=farmers.find(e=>e.farmerId===r);i=r;if(i!==null){$("#farmerTableBody tr").removeClass("selected-row");$("#farmerTableBody tr").filter(function(){return parseInt($(this).find("td:eq(0)").text(),10)===i}).addClass("selected-row");$("#editBtn").prop("disabled",false);$("#deleteBtn").prop("disabled",false)}else{$("#farmerTableBody tr").removeClass("selected-row")}});$(document).ready(function(){$(".download-btn").click(function(){Dialog.downloadDialog().then(e=>{r(e,farmers)})["catch"](e=>{console.error("Error:",e)})})});function r(e,r){const a=`FARMER MASTERLIST`;if(e==="csv"){t(a,r)}else if(e==="xlsx"){n(a,r)}else if(e==="pdf"){f(a,r)}}function d(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}function e(e){if(typeof e==="string"&&(e.includes(",")||e.includes("\n")||e.includes('"'))){e='"'+e.replace(/"/g,'""')+'"'}return e}function t(e,r){const a={barangayId:"Barangay",farmerName:"Farmer Name",fieldArea:"Field Area",fieldType:"Field Type",phoneNumber:"Phone Number"};const t=["barangayId","farmerName","fieldArea","fieldType","phoneNumber"];const n=t.map(e=>a[e]);function o(e){if(e===undefined||e===null)return"";if(typeof e==="string"&&(e.includes(",")||e.includes('"')||e.includes("\n"))){e=`"${e.replace(/"/g,'""')}"`}return e}const l=[n.join(","),...r.map(a=>t.map(e=>{let r=a[e]!==undefined?a[e]:"";if(e==="barangayId"&&r!==""){r=getBarangayName(r)}return o(r)}).join(","))].join("\n");const d=new Blob([l],{type:"text/csv"});const i=URL.createObjectURL(d);const s=document.createElement("a");s.href=i;s.download=e;document.body.appendChild(s);s.click();document.body.removeChild(s);URL.revokeObjectURL(i);addDownload(e,"CSV")}function n(n,e){const t={barangayId:"Barangay",farmerName:"Farmer Name",fieldArea:"Field Area",fieldType:"Field Type",phoneNumber:"Phone Number"};const o=["barangayId","farmerName","fieldArea","fieldType","phoneNumber"];const r=o.map(e=>t[e]);const a=e.map(r=>{const a={};o.forEach(e=>{a[t[e]]=e==="barangayId"?getBarangayName(r[e]):r[e]});return a});const l=new ExcelJS.Workbook;const d=l.addWorksheet("Sheet1");d.addRow(r);a.forEach(r=>{d.addRow(o.map(e=>{return r[t[e]]!==undefined?r[t[e]]:""}))});const i={font:{name:"Calibri",size:12,bold:true,color:{argb:"FFFFFFFF"}},fill:{type:"pattern",pattern:"solid",fgColor:{argb:"203764"}},alignment:{horizontal:"center",vertical:"middle"},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const s={font:{name:"Calibri",size:11},alignment:{horizontal:"center",vertical:"middle",wrapText:true},border:{top:{style:"thin",color:{argb:"FF000000"}},right:{style:"thin",color:{argb:"FF000000"}},bottom:{style:"thin",color:{argb:"FF000000"}},left:{style:"thin",color:{argb:"FF000000"}}}};const c=d.getRow(1);c.eachCell({includeEmpty:true},e=>{e.style=i});c.height=20;d.eachRow({includeEmpty:true},(e,r)=>{if(r>1){e.eachCell({includeEmpty:true},e=>{e.style=s})}});d.columns=r.map(e=>({width:Math.max(e.length,10)+5}));l.xlsx.writeBuffer().then(function(e){const r=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});const a=URL.createObjectURL(r);const t=document.createElement("a");t.href=a;t.download=n;t.click();URL.revokeObjectURL(a)});addDownload(n,"XLSX")}function f(e,r){const{jsPDF:a}=window.jspdf;const t=new a;const n=["barangayId","farmerName","fieldArea","fieldType","phoneNumber"];const o=n.map(d);t.autoTable({head:[o],body:r.map(r=>n.map(e=>e==="barangayId"?getBarangayName(r[e]):r[e])),theme:"striped"});t.save(e);addDownload(e,"PDF")}function d(e){const r={barangayId:"Barangay",farmerName:"Farmer Name",fieldArea:"Field Area",fieldType:"Field Type",phoneNumber:"Phone Number"};return r[e]||e}}export{Farmer,getFarmer,searchFarmer,farmers,barangayArray,initializeMethodsFarmer,getBarangayId,getBarangayNames};