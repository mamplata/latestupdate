function sendConcern(){$("#concernsModal").modal("show")}function previewImage(e){var t=new FileReader;t.onload=function(){var e=document.getElementById("modal-image");e.src=t.result;e.alt="Image Preview"};t.readAsDataURL(e.target.files[0])}function showPreview(){var e=document.getElementById("modal-image").alt;if(e!==""){$("#imageModal").modal("show")}else{alert("Please select an image to preview.")}}$(document).ready(function(){$("#uploadForm").on("submit",function(e){e.preventDefault();let o=$("#title").val();let n=$("#content").val();let t=$("#attachment")[0].files[0];let s="";if(t){let e=new FileReader;e.onload=function(e){let a=new Image;a.src=e.target.result;a.onload=function(){let e=document.createElement("canvas");let t=e.getContext("2d");e.width=a.width;e.height=a.height;t.drawImage(a,0,0);s=e.toDataURL("image/webp");r(o,n,s)}};e.readAsDataURL(t)}else{r(o,n)}});function r(e,t,a=" "){const o="anonymous-"+uuid.v4();$.ajax({url:"/api/concerns",method:"POST",data:{name:o,title:e,content:t,attachment:a},success:function(e){$("#uploadForm")[0].reset();$("#modal-image").attr("alt","");$("#modal-image").attr("src","").hide();toastr.success("Form submitted successfully!","Success",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-success-custom"})},error:function(e){console.error("Error saving content:",e);toastr.error("Something went wrong.","Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error-custom"})}})}});