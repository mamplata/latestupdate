function sendConcern(){$("#concernsModal").modal("show")}function previewImage(t){var e=new FileReader;e.onload=function(){var t=document.getElementById("modal-image");t.src=e.result;t.alt="Image Preview"};e.readAsDataURL(t.target.files[0])}$(document).ready(function(){$("#uploadForm").on("submit",function(t){t.preventDefault();let o=$("#title").val();let n=$("#content").val();let e=$("#attachment")[0].files[0];let s="";if(e){let t=new FileReader;t.onload=function(t){let a=new Image;a.src=t.target.result;a.onload=function(){let t=document.createElement("canvas");let e=t.getContext("2d");t.width=a.width;t.height=a.height;e.drawImage(a,0,0);s=t.toDataURL("image/webp");r(o,n,s)}};t.readAsDataURL(e)}else{r(o,n)}});function r(t,e,a=" "){const o="anonymous-"+uuid.v4();$.ajax({url:"/api/concerns",method:"POST",data:{name:o,title:t,content:e,attachment:a},success:function(t){$("#uploadForm")[0].reset();$("#modal-image").attr("alt","");$("#modal-image").attr("src","").hide();toastr.success("Form submitted successfully!","Success",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-success-custom"})},error:function(t){console.error("Error saving content:",t);toastr.error("Something went wrong.","Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error-custom"})}})}});