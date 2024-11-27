$(document).ready(function () {
    function getCsrfToken() {
        return $('meta[name="csrf-token"]').attr("content");
    }

    function requestCsrfCookie() {
        return $.ajax({
            url: "/api/csrf-cookie",
            type: "GET",
            xhrFields: {
                withCredentials: true,
            },
        });
    }

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

    function redirectBasedOnRole(role) {
        if (role) {
            if (role === "admin") {
                window.location.href = "/management-admin"; // Redirect to admin page
            } else if (role === "agriculturist") {
                window.location.href = "/management-agriculturist"; // Redirect to user page
            }
        }
    }

    // Check user on page load
    requestCsrfCookie().done(function () {
        checkToken()
            .done(function (response) {
                if (response.user && response.user.role) {
                    // User is logged in, redirect them
                    redirectBasedOnRole(response.user.role);
                } else {
                    // User is not logged in, show the login form
                    $("#loginWrapper").removeClass("d-none");
                }
            })
            .fail(function () {
                // On failure (e.g., no token or invalid response), show login form
                $("#loginWrapper").removeClass("d-none");
            });
    });

    // Login form submission logic
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            url: "/api/login",
            type: "POST",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
            },
            headers: {
                "X-CSRF-TOKEN": getCsrfToken(),
            },
            success: function (response) {
                if (response.user) {
                    redirectBasedOnRole(response.user.role);
                } else {
                    $("#loginResult").html(
                        '<div class="alert alert-danger">Login failed!</div>'
                    );
                }
            },
            error: function (xhr) {
                var error = xhr.responseJSON
                    ? xhr.responseJSON.message
                    : "Login failed!";
                $("#loginResult").html(
                    '<div class="alert alert-danger">' + error + "</div>"
                );
            },
        });
    });
});
