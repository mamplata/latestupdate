$(document).ready(function () {
    $("head").prepend(`
        <link rel="icon" href="../img/logo.webp" type="image/png">   
    `);

    $("body").prepend(`
        <!-- Loading screen -->
        <div id="loadingScreen" class="loading-overlay">
            <div class="spinner-container">
                <div class="spinner-grow" role="status"></div>
                <div class="spinner-grow" role="status"></div>
                <div class="spinner-grow" role="status"></div>
                <p class="loading-message">Please wait while we load content...</p>
            </div>
        </div>
    `);

    $(document).ready(function () {
        $("#loadingScreen").fadeIn();
        setTimeout(function () {
            $("#loadingScreen").fadeOut();
        }, 2000); // 2 seconds delay
    });

    // Prepend header structure with navigation links to the body
    $(".header-container").prepend(`
    <div class="container-fluid p-0 d-xl-flex justify-content-xl-center" style="background-color: inherit; max-width: 1500px; align-self: center; ">
        <header class="navbar navbar-expand-lg navbar-dark p-lg-3" style="width: 100%;">
            <div class="mobile-screen-menu p-3 p-lg-0 d-flex align-items-center justify-content-between">
                <a class="navbar-brand d-flex align-items-center justify-content-between" href="/" style="background-color: inherit">
                <img src="img/logo.webp" alt="Logo" class="header-logo">
                <h3 id="appName" class="ps-3 mb-0 d-none d-lg-block">AgroConnect Cabuyao</h3>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse ps-lg-5" id="navbarNav">
                <ul class="navbar-nav ms-auto text-center">
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/">Home</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/seasonal-trends">Seasonal Trends</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/top-crops">Top Crops</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/map-trends">Map Trends</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/weather-forecast">Weather Forecast</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/soil-health">Soil Health</a>
                    </li>
                    <li class="nav-item d-flex align-items-center justify-content-center">
                        <a class="nav-link text-white w-100" href="/contact-us">Contact Us</a>
                    </li>

                </ul>
            </div>
        </header>
    </div>
    
    <script>
        $(document).ready(function() {
            function updateActiveClass() {
                var path = window.location.pathname;
                $('.nav-link').each(function() {
                    if (this.pathname === path) {
                        $(this).attr('aria-current', 'page');
                        $(this).closest('.nav-item').addClass('active');
                    } else {
                        $(this).closest('.nav-item').removeClass('active');
                    }
                });
            }
        
            // Call the function on page load
            updateActiveClass();
        
            // Bind the function to the window resize event
            $(window).resize(function() {
                updateActiveClass();
            });
        });
    </script>
`);
});

$(document).ready(function () {
    let currentLocale = "en"; // Default locale

    function translate(locale) {
        // Collect all translation keys
        let keys = [];
        $("[data-key]").each(function () {
            keys.push($(this).data("key"));
        });

        // Preserve select values
        const selectStates = {};
        $("select").each(function () {
            const key = $(this).data("key");
            if (key) {
                selectStates[key] = $(this).val();
            }
        });

        // Fetch translations
        $.ajax({
            url: "/translate",
            method: "GET",
            data: {
                keys: keys,
                locale: locale,
            },
            success: function (translations) {
                // Update text dynamically
                $("[data-key]").each(function () {
                    const key = $(this).data("key");
                    if (translations[key]) {
                        $(this).html(translations[key]);
                    }
                });

                // Restore select values
                $("select").each(function () {
                    const key = $(this).data("key");
                    if (key && selectStates[key] !== undefined) {
                        $(this).val(selectStates[key]);
                    }
                });
            },
            error: function () {
                alert("Failed to load translations.");
            },
        });
    }

    // Toggle translation between English and Tagalog
    $("#toggle-btn").click(function () {
        // Toggle locale
        currentLocale = currentLocale === "en" ? "tl" : "en";
        translate(currentLocale);

        // Update button appearance
        if (currentLocale === "en") {
            $(this).removeClass("tl").addClass("en").text("EN");
        } else {
            $(this).removeClass("en").addClass("tl").text("TL");
        }
    });

    // Trigger translation on any select change
    $("select").change(function () {
        translate(currentLocale);
    });
});
