import{User,getUser,searchUser,users}from"../classes/User.js";import Dialog from"../helpers/Dialog.js";export default function initDashboard(){$(document).ready(function(){function e(){$("#main-content").html(`
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage Users</h1>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text border-0 bg-transparent"><i class="fas fa-search"></i></span>
        </div>
        <input placeholder="Search username..." type="text" class="form-control rounded-pill" id="search" name="search">
      </div>
    </div>
  
    <div class="row d-flex justify-content-between align-items-start mt-5">
      <div class="col-md-4">
        <form id="userForm">
          <div class="mb-3">
            <input placeholder="First Name" type="text" class="form-control" id="firstName" name="firstName" required>
          </div>
          <div class="mb-3">
            <input placeholder="Last Name" type="text" class="form-control" id="lastName" name="lastName" required>
          </div>
          <input type="hidden" class="form-control" id="userId" name="userId">
          <div class="mb-3">
            <input placeholder="Username" type="text" class="form-control" id="username" name="username" required>
          </div>
          <div class="mb-3">
            <input placeholder="Password" type="password" class="form-control" id="password" name="password" required>
          </div>
          <button type="button" class="btn btn-custom" id="submitBtn">Add User</button>
          <button type="button" class="btn btn-custom mt-2" id="cancelBtn" style="display: none;">Cancel</button>
        </form>
      </div>
  
      <div class="col-md-8 actionBtn">
        <div class="d-flex justify-content-end align-items-center mb-2">
          <button id="editBtn" class="btn btn-warning" style="margin-right: 10px;" disabled>Edit</button>
          <button id="deleteBtn" class="btn btn-danger" disabled>Delete</button>
        </div>
  
        <div class="table-responsive">
          <table id="userTable" class="table table-custom text-center">
            <thead>
              <tr style="background-color: #2774E9; color: white;">
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="userTableBody">
              <!-- Table rows will be dynamically added here -->
            </tbody>
          </table>
        </div>
  
        <div class="text-right mt-3">
          <button id="prevBtn" class="btn btn-green mr-2">Previous</button>
          <button id="nextBtn" class="btn btn-green">Next</button>
        </div>
      </div>
    </div>
  `);var l=null;var d=5;var o=1;var s=null;async function i(e=null){await new Promise(e=>setTimeout(e,1e3));$("#userTableBody").empty();var t=(o-1)*d;var s=t+d;if(e){const n=searchUser(e);if(n.length>0){n.forEach(e=>{$("#userTableBody").append(`
              <tr data-index=${e.userId}>
                <td style="display: none;">${e.userId}</td>
                <td>${e.firstName}</td>
                <td>${e.lastName}</td>
                <td>${e.username}</td>  
                <td>${e.role}</td>                      
                <td><button class="btn btn-sm btn-green">Change Password</button></td>
              </tr>
            `)})}else{$("#userTableBody").append(`
            <tr>
              <td colspan="4">User not found!</td>
            </tr>
          `)}}else{for(var r=t;r<s;r++){if(r>=users.length){break}var a=users[r];$("#userTableBody").append(`
          <tr data-index=${a.userId}>
            <td style="display: none;">${a.userId}</td>
            <td>${a.firstName}</td>
            <td>${a.lastName}</td>
            <td>${a.username}</td>
            <td>${a.role}</td>
            <td><button class="btn btn-sm btn-green" onclick="changePassword(${a.userId})">Change Password</button></td>
          </tr>
        `)}}}window.changePassword=async function(e){const t=await Dialog.changePasswordDialog("Change Password","Input new password:");if(t.operation===Dialog.OK){$.ajax({url:`api/admin/change-password/${e}`,type:"POST",data:{new_password:t.newPassword},success:function(e){alert(e.message)},error:function(e){alert("Password change failed: "+e.responseJSON.message)}})}};i();$("#search").on("input",function(){let e=$(this).val();i(e)});$("#prevBtn").click(function(){if(o>1){o--;i()}});$("#nextBtn").click(function(){var e=Math.ceil(users.length/d);if(o<e){o++;i()}});$("#submitBtn").click(function(e){e.preventDefault();var t=Number($("#userId").val());var s=$("#firstName").val();var r=$("#lastName").val();var a=$("#username").val();var n=$("#role").val();var d=$("#password").val();if(l!==null){let e=new User(t,s,r,a,n);e.updateUser(e);l=null;$("#submitBtn").text("Add User");$("#cancelBtn").hide();$("#password").show();$("#password").attr("required","required");c()}else{let e=new User(0,s,r,a,"agriculturist",d);e.createUser(e)}$("#userForm")[0].reset();l=null;$("#userTableBody tr").removeClass("selected-row");getUser();i()});function c(){$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true);l=null;$("#userTableBody tr").removeClass("selected-row")}$("#editBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Edit","Are you sure you want to edit this user's details?");if(e.operation===1){$("#editModal").modal("hide");$("#cancelBtn").show();$("#password").hide();$("#password").removeAttr("required");$("#userId").val(s.userId);$("#firstName").val(s.firstName);$("#lastName").val(s.lastName);$("#username").val(s.username);$("#submitBtn").text("Update User")}$("#cancelEdit").click(function(){c()});$("#userTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#cancelBtn").click(function(){l=null;$("#userForm")[0].reset();$("#submitBtn").text("Add User");$("#cancelBtn").hide();$("#password").attr("required","required").show();$("#userTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#deleteBtn").click(async function(){const e=await Dialog.confirmDialog("Confirm Deletion","Are you sure you want to delete this user?");if(e.operation===1){let e=new User;e.removeUser(s.userId);i();c()}else{}$("#userTableBody tr").removeClass("selected-row");$("#editBtn").prop("disabled",true);$("#deleteBtn").prop("disabled",true)});$("#userTableBody").on("click","tr",function(){var e=$(this);var t=e.data("index");s=users.find(e=>e.userId===t);l=t;if(l!==null){$("#userTableBody tr").removeClass("selected-row");$("#userTableBody tr").filter(function(){return parseInt($(this).find("td:eq(0)").text(),10)===l}).addClass("selected-row");$("#editBtn").prop("disabled",false);if(s.role!=="admin"){$("#deleteBtn").prop("disabled",false)}else{$("#deleteBtn").prop("disabled",true)}}else{$("#userTableBody tr").removeClass("selected-row")}})}e()})}