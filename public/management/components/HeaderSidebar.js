export let user;
import Dialog from "./helpers/Dialog.js";

$(document).ready(function () {
    // Add event listener to a parent container, like the document body
    document.body.addEventListener("click", async function (event) {
        // Check if the clicked element is a button or an anchor tag
        if (
            (event.target && event.target.tagName === "BUTTON") ||
            (event.target && event.target.tagName === "A")
        ) {
            // Check if the user is authenticated and token is valid
            const isValidToken = await checkUserToken();

            if (isValidToken) {
                // If it's a button inside a form, you can submit it here
                // if (event.target.tagName === "BUTTON") {
                //     event.target.form.submit();
                // }

                // Check if the user role has changed
                await checkAndHandleRoleChange();
            } else {
                // Log the user out by redirecting to login page
                setTimeout(function () {
                    window.location.href = "/management-login";
                }, 2000); // Redirect after 2 seconds delay
            }
        }
    });

    // Function to check token and user role
    async function checkAndHandleRoleChange() {
        // Request CSRF cookie first (if applicable)
        await requestCsrfCookie();

        // Check the token and fetch user data
        const response = await checkToken();
        const currentUrl = window.location.href;
        if (response.message !== "Invalid Token") {
            const user = response.user;

            // If user role has changed or other conditions apply, handle redirection
            if (response.redirect_url) {
                if (!currentUrl.includes(user.role)) {
                    window.location.href = response.redirect_url;
                }
            }
        } else {
            // If token is invalid, redirect to login
            setTimeout(function () {
                window.location.href = "/management-login";
            }, 2000); // Redirect after 2 seconds delay
        }
    }

    // Function to check if the CSRF token is still valid
    async function checkUserToken() {
        const token = await getCsrfToken();
        try {
            const response = await $.ajax({
                url: "/api/check-user",
                type: "GET",
                xhrFields: {
                    withCredentials: true,
                },
                headers: {
                    "X-CSRF-TOKEN": token,
                },
            });

            // Check if the response indicates the token is valid
            return response.message !== "Invalid Token";
        } catch (error) {
            console.error("Error checking token:", error);
            return false; // If there is an error, assume token is invalid
        }
    }

    async function getCsrfToken() {
        return $('meta[name="csrf-token"]').attr("content");
    }

    async function requestCsrfCookie() {
        return $.ajax({
            url: "/api/csrf-cookie",
            type: "GET",
            xhrFields: {
                withCredentials: true,
            },
        });
    }

    async function checkToken() {
        const token = await getCsrfToken();
        return $.ajax({
            url: "/api/check-user",
            type: "GET",
            xhrFields: {
                withCredentials: true,
            },
            headers: {
                "X-CSRF-TOKEN": token,
            },
        });
    }

    async function initialize() {
        try {
            await requestCsrfCookie();
            const response = await checkToken();

            if (response.message !== "Invalid Token") {
                user = response.user;

                // If user exists, show loading screen and then load content
                if (user) {
                    $("body").prepend(`
                    <!-- Loading screen -->
                    <div id="loadingScreen" class="loading-overlay1">
                        <div class="spinner-container1">
                            <div class="spinner-grow" role="status"></div>
                            <div class="spinner-grow" role="status"></div>
                            <div class="spinner-grow" role="status"></div>
                            <p class="loading-message1">Please wait while we load content...</p>
                        </div>
                    </div>
                `);
                    showLoadingScreen();
                }

                // If redirect_url is set, redirect the user
                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                    load();
                }
            } else {
                window.location.href = "/management-login";
            }
        } catch (error) {
            console.error("An error occurred:", error);
            window.location.href = "/management-login";
        }
    }

    // Show loading screen function
    function showLoadingScreen() {
        $("#loadingScreen").fadeIn();
        // Optionally, set a timeout to auto-hide after a certain time
        setTimeout(function () {
            $("#loadingScreen").fadeOut();
        }, 2000); // 2 seconds delay
    }

    // Initialize CSRF token handling and token validation
    initialize();

    // Prevent loading screen on logout
    $(".logout a").on("click", function (event) {
        // Prevent the loading screen from showing
        event.stopPropagation(); // Prevents event from bubbling up
        // Proceed with the logout process
        // Optionally, you can perform additional actions here, like confirming logout, etc.
    });

    // Show loading screen only if it's not a logout action
    $(document).on("click", "a", function (event) {
        if (!$(this).closest(".logout").length && user) {
            showLoadingScreen();
        }
    });

    // Show loading screen on initial load
    $(window).on("load", function () {
        if (user) {
            showLoadingScreen();
        }
    });

    // Show loading screen on URL change (for SPA)
    $(window).on("popstate", function () {
        if (user) {
            showLoadingScreen();
        }
    });

    // Example for a hypothetical router event:
    $(document).on("routeChange", function () {
        if (user) {
            showLoadingScreen();
        }
    });

    function load() {
        // Function to load content from a JavaScript module file into main content area
        async function loadContent(url) {
            try {
                // Dynamically import the module
                const module = await import(url);

                // Assuming your module has a default export or named exports
                if (module.default) {
                    module.default(); // Call the default export function if it exists
                }
            } catch (error) {
                console.error(`Failed to load module from ${url}:`, error);
            }
        }

        $("head").prepend(`
            <link rel="icon" href="../../../img/logo.webp" type="image/webp">   
        `);
        $("body").prepend(`
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
        `);

        // Determine which sidebar links to show based on user role
        function initializeSidebar() {
            var links = [
                {
                    id: "dashboard-link",
                    href: "#dashboard",
                    icon: "fas fa-tachometer-alt",
                    text: "Dashboard",
                },
                {
                    id: "manage-users-link",
                    href: "#manage-users",
                    icon: "fas fa-users",
                    text: "Manage Users",
                },
                {
                    id: "maintenance-link",
                    href: "#maintenance",
                    icon: "fas fa-wrench",
                    text: "Maintenance",
                },
                {
                    id: "data-entries-link",
                    href: "#data-entries",
                    icon: "fas fa-database",
                    text: "Data Entries",
                },
                {
                    id: "concerns-link",
                    href: "#concerns",
                    icon: "fas fa-exclamation-triangle",
                    text: "Concerns",
                },
            ];

            // Filter links based on user role
            if (user.role === "admin") {
                links.forEach((link) => {
                    $("#sidebar-links").append(`
                        <li class="nav-item mt-3">
                            <a id="${link.id}" class="nav-link" href="${link.href}">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        </li>
                    `);
                });
            } else if (user.role === "agriculturist") {
                const agriculturistLinks = [
                    links[0], // Dashboard
                    links[2], // Maintenance
                    links[4], // Concerns
                ];
                agriculturistLinks.forEach((link) => {
                    $("#sidebar-links").append(`
                        <li class="nav-item mt-3">
                            <a id="${link.id}" class="nav-link" href="${link.href}">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        </li>
                    `);
                });
            }
        }
        async function loadDefaultContent() {
            const hash = window.location.hash;
            let modulePath;

            // Determine which module to load based on the URL hash
            switch (hash) {
                case "#dashboard":
                    modulePath = "../components/pages/Dashboard.js";
                    await loadContent(modulePath);
                    setActiveLink("#dashboard-link");
                    break;
                case "#manage-users":
                    modulePath = "../components/pages/ManageUsers.js";
                    await loadContent(modulePath);
                    setActiveLink("#manage-users-link");
                    break;
                case "#maintenance":
                    modulePath = "../components/pages/Maintenance.js";
                    await loadContent(modulePath);
                    setActiveLink("#maintenance-link");
                    break;
                case "#data-entries":
                    modulePath = "../components/pages/DataEntries.js";
                    await loadContent(modulePath);
                    setActiveLink("#data-entries-link");
                    break;
                case "#concerns":
                    modulePath = "../components/pages/Concerns.js";
                    await loadContent(modulePath);
                    setActiveLink("#concerns-link");
                    break;
                default:
                    modulePath = "../components/pages/Dashboard.js";
                    await loadContent(modulePath);
                    setActiveLink("#dashboard-link");
                    break;
            }
        }

        // Example function to set the active link
        function setActiveLink(selector) {
            // Remove active class from all links
            $(".nav-link").removeClass("active");
            // Add active class to the selected link
            $(selector).addClass("active");
        }

        // Call loadDefaultContent when the page loads
        $(document).ready(function () {
            loadDefaultContent();

            // Also handle hash change if user navigates using browser history
            $(window).on("hashchange", function () {
                loadDefaultContent();
            });
        });

        // Initialize sidebar based on user role
        initializeSidebar();

        // Logout button click event
        $(".logout a").on("click", async function (event) {
            event.preventDefault(); // Prevent the default link behavior
            event.stopPropagation(); // Prevents event from bubbling up
            // Show confirmation dialog
            const res = await Dialog.confirmDialog(
                "Logout",
                "Are you sure you want to logout?"
            );
            if (res.operation === Dialog.OK_OPTION) {
                // Proceed with logout
                $.ajax({
                    url: "/api/logout", // Route to handle logout
                    type: "POST",
                    xhrFields: {
                        withCredentials: true, // Ensure cookies are sent with the request
                    },
                    headers: {
                        "X-CSRF-TOKEN": getCsrfToken(), // Include CSRF token if required
                    },
                    success: function (response) {
                        if (response.success) {
                            toastr.success(
                                "You have been logged out.",
                                "Success",
                                {
                                    timeOut: 5000, // 5 seconds
                                    positionClass: "toast-top-center",
                                    toastClass: "toast-success-custom",
                                }
                            );
                            // Redirect after a short delay to let the toast show
                            setTimeout(function () {
                                window.location.href = "/management-login"; // Redirect to login page
                            }, 1500); // Adjust delay as needed
                        } else {
                            toastr.error(
                                "Logout failed: " + response.message,
                                "Error",
                                {
                                    timeOut: 5000, // 5 seconds
                                    positionClass: "toast-center-center",
                                    toastClass: "toast-error", // Custom error color
                                }
                            );
                        }
                    },
                    error: function (xhr) {
                        toastr.error(
                            "Logout failed: " + xhr.responseJSON.message,
                            "Error",
                            {
                                timeOut: 5000, // 5 seconds
                                positionClass: "toast-center-center",
                                toastClass: "toast-error", // Custom error color
                            }
                        );
                    },
                });
            }
        });
    }
});
