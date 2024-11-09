import Dialog from"../helpers/Dialog.js";let crops=[];class Crop{constructor(e,t,r,o,a,l,s,n,c){this.cropId=e;this.cropName=t;this.cropType=r;this.scientificName=o;this.plantingSeason=a;this.growthDuration=l;this.unit=s;this.weight=n;this.cropImg=c}async createCrop(t){const e=crops.find(e=>e.cropName===t.cropName);if(e){alert("Crop with the same name already exists");return}$("#progressMessage").text("Uploading...");$("#loader").show();$("body").addClass("no-scroll");try{await $.ajax({url:"/api/crops",type:"POST",contentType:"application/json",data:JSON.stringify(t)});toastr.success("Crop added successfully!","Success",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-success-custom"})}catch(r){console.error("Error:",r);toastr.error("Failed to add crop. Please try again.","Error",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-error-custom"})}finally{$("#loader").hide();$("body").removeClass("no-scroll");$("#progressMessage").text("")}}updateCrop(t){const e=crops.find(e=>e.cropName===t.cropName&&e.cropId!==t.cropId);if(e){alert("Crop with the same name already exists");return}crops=crops.map(e=>e.cropId===t.cropId?{...e,...t}:e);fetch(`/api/crops/${t.cropId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(e=>e.json()).then(e=>{})["catch"](e=>{console.error("Error:",e)})}removeCrop(t){fetch(`/api/crops/${t}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(e=>{if(e.status===204){crops=crops.filter(e=>e.cropId!==t)}else if(e.status===404){console.error(`Crop with ID ${t} not found.`)}else{console.error(`Failed to delete crop with ID ${t}.`)}})["catch"](e=>{console.error("Error:",e)})}}function getCrop(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}});$.ajax({url:"/api/crops",method:"GET",success:function(e){let t=e;crops=t},error:function(e,t,r){console.error("Error fetching crops:",r)}})}getCrop();function searchCrop(t){const e=crops.filter(e=>e.cropName.toLowerCase().includes(t.toLowerCase()));return e}function initializeMethodsCrop(){var h=null;var s=5;var n=1;var f=false;var r=null;async function g(e=null){await new Promise(e=>setTimeout(e,1e3));$("#cropTableBody").empty();var t=(n-1)*s;var r=t+s;if(e){const l=searchCrop(e);if(l.length>0){l.forEach(e=>{$("#cropTableBody").append(`
                        <tr data-index=${e.cropId} class="text-center">
                            <td style="display: none;">${e.cropId}</td>
                            <td><img src="${e.cropImg}" alt="${e.cropName}" class="img-thumbnail" width="50" height="50"></td>
                            <td>${e.cropName}</td>
                            <td>${e.cropType}</td>
                            <td>${e.scientificName}</td>
                            <td class="crop-cell" title="${e.plantingSeason}">${e.plantingSeason}</td>
                            <td class="crop-cell" title="${e.growthDuration}">${e.growthDuration}</td>
                            <td>${e.unit}</td>
                            <td>${e.weight}</td>
                        </tr>
                    `)})}else{$("#cropTableBody").append(`
                    <tr>
                        <td colspan="9">Crop not found!</td>
                    </tr>
                `)}}else{for(var o=t;o<r;o++){if(o>=crops.length){break}var a=crops[o];$("#cropTableBody").append(`
                    <tr data-index=${a.cropId} class="text-center">
                        <td style="display: none;">${a.cropId}</td>
                        <td><img src="${a.cropImg}" alt="${a.cropName}" class="img-thumbnail" width="50" height="50"></td>
                        <td>${a.cropName}</td>
                        <td>${a.cropType}</td>
                        <td>${a.scientificName}</td>
                        <td class="crop-cell" title="${a.plantingSeason}">${a.plantingSeason}</td>
                        <td class="crop-cell" title="${a.growthDuration}">${a.growthDuration}</td>
                        <td>${a.unit}</td>
                        <td>${a.weight}</td>
                    </tr>
                `)}}}g();$("#search").on("input",function(){let e=$("#search").val();g(e)});$("#prevBtn").click(function(){if(n>1){n--;g()}});$("#nextBtn").click(function(){var e=Math.ceil(crops.length/s);if(n<e){n++;g()}});let o="";$("#submitBtn").click(function(e){e.preventDefault();const t=document.getElementById("cropForm");if(!t.checkValidity()){t.reportValidity();return}var a=Number($("#cropId").val());var l=$("#cropName").val();var s=$("#cropType").val();var n=$("#scientificName").val();var c=$("#plantingSeason").val();var i=$("#growthDuration").val();var p=$("#unit").val();var d=$("#weight").val();var r=document.getElementById("cropImg").files[0];var u=null;if(r){var m=new FileReader;m.onloadend=function(){var o=new Image;o.src=m.result;o.onload=function(){var e=document.createElement("canvas");var t=e.getContext("2d");e.width=o.width;e.height=o.height;t.drawImage(o,0,0);u=e.toDataURL("image/webp",.8);let r=new Crop(a,l,s,n,c,i,p,d,u);if(h!==null&&f){r.updateCrop(r);h=null;$("#submitBtn").text("Add crop");$("#cancelBtn").hide();f=false}else{r.createCrop(r)}getCrop();g();$("#cropForm")[0].reset();$("#cropTableBody tr").removeClass("selected-row")}};m.readAsDataURL(r)}else{if(h!==null&&f){let e=new Crop(a,l,s,n,c,i,p,d,o);e.updateCrop(e);h=null;$("#submitBtn").text("Add crop");$("#cancelBtn").hide();f=false}else{let e=new Crop(a,l,s,n,c,i,p,d,null);e.createCrop(e)}getCrop();g();o="";$("#cropForm")[0].reset();$("#lblCropImg").val("Upload Image:");$("#cropTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)}});function t(){$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true);h=null;$("#cropTableBody tr").removeClass("selected-row")}$("#editBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Edit","Are you sure you want to edit this crop's details?");if(e.operation===1){$("#editModal").modal("hide");$("#cancelBtn").show();$("#cropId").val(r.cropId);$("#cropName").val(r.cropName);$("#cropType").val(r.cropType);$("#scientificName").val(r.scientificName);$("#plantingSeason").val(r.plantingSeason);$("#growthDuration").val(r.growthDuration);$("#unit").val(r.unit);$("#weight").val(r.weight);o=r.cropImg;$("#lblCropImg").text("Upload New Image (Optional):");f=true;$("#type").val(r.type);$("#submitBtn").text("Update Crop")}$("#cropTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#cancelEdit").click(function(){t();$("#cropTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#cancelBtn").click(function(){h=null;$("#cropForm")[0].reset();$("#submitBtn").text("Add Crop");$("#cancelBtn").hide();$("#cropTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#deleteBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Deletion","Are you sure you want to delete this crop?");if(e.operation===1){let e=new Crop;e.removeCrop(r.cropId);getCrop();g();t()}else{$("#cropTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)}});$("#cropTableBody").on("click","tr",function(){var e=$(this);var t=e.data("index");r=crops.find(e=>e.cropId===t);h=t;if(h!==null){$("#cropTableBody tr").removeClass("selected-row");$("#cropTableBody tr").filter(function(){return parseInt($(this).find("td:eq(0)").text(),10)===h}).addClass("selected-row");$("#editBtn").prop("disabled",false);$("#deleteBtn").prop("disabled",false)}else{$("#cropTableBody tr").removeClass("selected-row")}})}export{Crop,getCrop,searchCrop,initializeMethodsCrop,crops};