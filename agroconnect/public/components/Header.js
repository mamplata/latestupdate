(()=>{"use strict";$(document).ready((function(){$("head").prepend('\n        <link rel="icon" href="../img/logo.png" type="image/png">   \n    '),$("body").prepend('\n        \x3c!-- Loading screen --\x3e\n        <div id="loadingScreen" class="loading-overlay">\n            <div class="spinner-container">\n                <div class="spinner-grow" role="status"></div>\n                <div class="spinner-grow" role="status"></div>\n                <div class="spinner-grow" role="status"></div>\n                <p class="loading-message">Please wait while we load content...</p>\n            </div>\n        </div>\n    '),$(window).on("load",(function(){setTimeout((function(){$("#loadingScreen").fadeOut()}),2e3)})),$(".header-container").prepend('\n    <div class="container-fluid p-0">\n        <header class="navbar navbar-expand-lg navbar-dark" style="background-color: #008000;">\n            <a class="navbar-brand d-flex align-items-center ms-5" href="#">\n                <img src="img/logo.png" alt="Logo" class="header-logo">\n                <h3 id="appName" class="ps-3 mb-0 d-none d-lg-block">AgroConnect Cabuyao</h3>\n            </a>\n            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n                <span class="navbar-toggler-icon"></span>\n            </button>\n            <div class="collapse navbar-collapse" id="navbarNav">\n                <ul class="navbar-nav ms-auto text-center me-5">\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/">Home</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/seasonal-trends">Seasonal Trends</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/top-crops">Top Crops</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/map-trends">Map Trends</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/weather-forecast">Weather Forecast</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/soil-health">Soil Health</a>\n                    </li>\n                    <li class="nav-item">\n                        <a class="nav-link text-white" href="/contact-us">Contact Us</a>\n                    </li>\n                </ul>\n            </div>\n        </header>\n    </div>\n    \n    <script>\n        $(document).ready(function() {\n            function updateActiveClass() {\n                var path = window.location.pathname;\n                $(\'.nav-link\').each(function() {\n                    if (this.pathname === path) {\n                        $(this).attr(\'aria-current\', \'page\');\n                        $(this).closest(\'.nav-item\').addClass(\'active\');\n                    } else {\n                        $(this).closest(\'.nav-item\').removeClass(\'active\');\n                    }\n                });\n            }\n        \n            // Call the function on page load\n            updateActiveClass();\n        \n            // Bind the function to the window resize event\n            $(window).resize(function() {\n                updateActiveClass();\n            });\n        });\n    <\/script>\n')}))})();