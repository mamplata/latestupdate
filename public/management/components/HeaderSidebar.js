export let user;import Dialog from"./helpers/Dialog.js";$(document).ready(function(){$("body").prepend(`
    <!-- Loading screen -->
    <div id="loadingScreen" class="loading-overlay1">
        <div class="spinner-container1">
            <div class="spinner-grow" role="status"></div>
            <div class="spinner-grow" role="status"></div>
            <div class="spinner-grow" role="status"></div>
            <p class="loading-message1">Please wait while we load content...</p>
        </div>
    </div>
`);function a(){$("#loadingScreen").fadeIn();setTimeout(function(){$("#loadingScreen").fadeOut()},2e3)}$(window).on("load",function(){a()});$(window).on("popstate",function(){a()});$(document).on("routeChange",function(){a()});$(".logout a").on("click",function(e){e.stopPropagation()});$(document).on("click","a",function(e){if(!$(this).closest(".logout").length){a()}});async function o(){return $('meta[name="csrf-token"]').attr("content")}async function n(){return $.ajax({url:"/api/csrf-cookie",type:"GET",xhrFields:{withCredentials:true}})}async function s(){const e=await o();return $.ajax({url:"/api/check-user",type:"GET",xhrFields:{withCredentials:true},headers:{"X-CSRF-TOKEN":e}})}async function e(){try{await n();const a=await s();if(a.message!=="Invalid Token"){user=a.user;t()}else{window.location.href="/management-login"}}catch(e){console.error("An error occurred:",e);window.location.href="/management-login"}}e();function t(){if(!window.location.hash){window.location.hash="#dashboard"}async function n(e){try{const n=await import(e);if(n["default"]){n["default"]()}}catch(a){console.error(`Failed to load module from ${e}:`,a)}}$("head").prepend(`
        <link rel="icon" href="../../../img/logo.webp" type="image/webp">   
    `);$("body").prepend(`
        <div class="wrapper">
            <!-- Header -->
            <div class="header">
                <header class="header d-flex justify-content-between align-items-center" style="background-color: #008000;">
                    <div class="header d-flex align-items-center p-2">
                        <!-- Burger Menu Icon for smaller screens -->
                        <button class="navbar-toggler d-md-none mr-3" type="button" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"><i class="fas fa-bars"></i></span>
                        </button>
                        <img src="../img/logo.webp" alt="Logo" class="header-logo d-none d-md-block">
                        <h3 id="appName" class="pl-3 d-none d-md-block">AgroConnect Cabuyao</h3> <!-- Hidden on small screens -->
                    </div>
                    <div class="pr-4 d-flex align-items-center">
                        <span class="username font-weight-bold">${user.username}</span>
                        <span class="user-icon ml-3">
                            <i class="fas fa-user-circle"></i>
                        </span>
                    </div>
                </header>
            </div>
    
            <!-- Sidebar and Content Wrapper -->
            <div class="content-wrapper d-flex">
                <!-- Sidebar -->
                <nav id="sidebar" class="sidebar collapse">
                    <!-- Close button for small screens -->
                    <button class="btn-close d-md-none" aria-label="Close" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                    <!-- Logo for small screens -->
                    <div class="d-md-none text-center my-3">
                        <img src="../img/logo.webp" alt="Logo" class="sidebar-logo">
                    </div>
                    <div>
                        <ul class="nav flex-column mt-4" id="sidebar-links">
                            <!-- Links will be dynamically added here -->
                        </ul>
                        <ul class="nav flex-column logout">
                            <li class="nav-item mt-auto">
                                <a class="nav-link" href="#">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
    
                <!-- Main Content Area -->
                <main role="main" id="main-content" class="content ml-sm-auto col-lg-10 pr-4">
                    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 class="h2">Main Content</h1>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <p>Content area below the header and sidebar.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <script>
            $(document).ready(function() {
                 // Close sidebar when close button is clicked
                $('.btn-close').on('click', function() {
                    $('#sidebar').collapse('hide');
                });

                // Close sidebar when any sidebar link is clicked
                $('#sidebar').on('click', '.nav-link', function() {
                    $('#sidebar').collapse('hide');
                });
            });
        </script>
    `);function e(){var e=[{id:"dashboard-link",href:"#dashboard",icon:"fas fa-tachometer-alt",text:"Dashboard"},{id:"manage-users-link",href:"#manage-users",icon:"fas fa-users",text:"Manage Users"},{id:"maintenance-link",href:"#maintenance",icon:"fas fa-wrench",text:"Maintenance"},{id:"data-entries-link",href:"#data-entries",icon:"fas fa-database",text:"Data Entries"},{id:"concerns-link",href:"#concerns",icon:"fas fa-exclamation-triangle",text:"Concerns"}];if(user.role==="admin"){e.forEach(e=>{$("#sidebar-links").append(`
                    <li class="nav-item mt-3">
                        <a id="${e.id}" class="nav-link" href="${e.href}">
                            <i class="${e.icon}"></i>
                            ${e.text}
                        </a>
                    </li>
                `)})}else if(user.role==="agriculturist"){const a=[e[0],e[2],e[4]];a.forEach(e=>{$("#sidebar-links").append(`
                    <li class="nav-item mt-3">
                        <a id="${e.id}" class="nav-link" href="${e.href}">
                            <i class="${e.icon}"></i>
                            ${e.text}
                        </a>
                    </li>
                `)})}}async function a(){const e=window.location.hash;let a;switch(e){case"#dashboard":a="../components/pages/Dashboard.js";await n(a);s("#dashboard-link");break;case"#manage-users":a="../components/pages/ManageUsers.js";await n(a);s("#manage-users-link");break;case"#maintenance":a="../components/pages/Maintenance.js";await n(a);s("#maintenance-link");break;case"#data-entries":a="../components/pages/DataEntries.js";await n(a);s("#data-entries-link");break;case"#concerns":a="../components/pages/Concerns.js";await n(a);s("#concerns-link");break;default:a="../components/pages/Dashboard.js";await n(a);s("#dashboard-link");break}}function s(e){$(".nav-link").removeClass("active");$(e).addClass("active")}$(document).ready(function(){a();$(window).on("hashchange",function(){a()})});e();$(".logout a").on("click",async function(e){e.preventDefault();e.stopPropagation();const a=await Dialog.confirmDialog("Logout","Are you sure you want to logout?");if(a.operation===Dialog.OK_OPTION){$.ajax({url:"/api/logout",type:"POST",xhrFields:{withCredentials:true},headers:{"X-CSRF-TOKEN":o()},success:function(e){if(e.success){toastr.success("You have been logged out.","Success",{timeOut:5e3,positionClass:"toast-top-center",toastClass:"toast-success-custom"});setTimeout(function(){window.location.href="/management-login"},1500)}else{toastr.error("Logout failed: "+e.message,"Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error"})}},error:function(e){toastr.error("Logout failed: "+e.responseJSON.message,"Error",{timeOut:5e3,positionClass:"toast-center-center",toastClass:"toast-error"})}})}})}});