$(document).ready(function () {
    // Function to get CSRF token from meta tag
    function getCsrfToken() {
        return $('meta[name="csrf-token"]').attr("content");
    }

    // Function to request the CSRF cookie
    function requestCsrfCookie() {
        return $.ajax({
            url: "/api/csrf-cookie",
            type: "GET",
            xhrFields: {
                withCredentials: true,
            },
        });
    }

    // Function to check if the user is authenticated
    function checkToken() {
        return $.ajax({
            url: "/api/check-user",
            type: "GET",
            xhrFields: {
                withCredentials: true,
            },
            headers: {
                "X-CSRF-TOKEN": getCsrfToken(),
            },
        });
    }

    // Function to redirect user based on their role
    function redirectBasedOnRole(role) {
        if (role) {
            if (role === "admin") {
                window.location.href = "/management-admin"; // Redirect to admin page
            } else if (role === "agriculturist") {
                window.location.href = "/management-agriculturist"; // Redirect to agriculturist page
            }
        }
    }

    // Initially, hide all the page content except the login form
    $("#loginWrapper").removeClass("d-none"); // Show the login form initially
    $(".login-container").addClass("d-none"); // Hide the rest of the content initially

    // First, request CSRF cookie to ensure valid token before any requests
    requestCsrfCookie().done(function () {
        // Now check if the user is logged in
        checkToken()
            .done(function (response) {
                if (response.user && response.user.role) {
                    // User is logged in, redirect them
                    redirectBasedOnRole(response.user.role);
                } else {
                    // User is not logged in, show the login form
                    $(".login-container").removeClass("d-none"); // Show login content
                }
            })
            .fail(function () {
                // On failure (e.g., no token or invalid response), show login form
                $(".login-container").removeClass("d-none"); // Show login content
            });
    });

    // Handle login form submission
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        var username = $("#username").val();
        var password = $("#password").val();

        // Send login request to the server
        $.ajax({
            url: "/api/login",
            type: "POST",
            data: {
                username: username,
                password: password,
            },
            headers: {
                "X-CSRF-TOKEN": getCsrfToken(), // Add CSRF token to headers
            },
            success: function (response) {
                // Handle success: typically, redirect or update the UI
                if (response.user && response.user.role) {
                    redirectBasedOnRole(response.user.role);
                }
            },
            error: function (xhr) {
                // Handle error, display login failure message
                $("#loginResult").text("Login failed, please try again.");
            },
        });
    });
});
