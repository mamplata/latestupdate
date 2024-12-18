$(document).ready(function () {
    // Prepend the favicon first
    $("head").prepend(`
        <link rel="icon" href="../img/logo.webp" type="image/png">   
    `);

    // Prepend the loading screen to body
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

    // Show loading screen immediately
    $("#loadingScreen").fadeIn();

    // Once content is loaded, fade out the loading screen
    setTimeout(function () {
        $("#loadingScreen").fadeOut(function () {
            // Now prepend the header and other content after loading screen is hidden
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
            `);
        });
    }, 2000); // 2 seconds delay before fading out
});
