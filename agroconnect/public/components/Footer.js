(()=>{"use strict";$(document).ready((function(){new Promise((function(a){$(".footer-container").append('\n                <footer class="footer text-white">\n                    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center py-1">\n                        <div class="d-flex align-items-center mb-3 mb-md-0">\n                            <span class="me-3">&copy; AgroConnect Cabuyao (<span id="yearData"></span>)</span>\n                        </div>\n                        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-end">\n                            <p class="mb-0 me-4">\n                                <i class="fas fa-map-marker-alt" data-toggle="tooltip" data-placement="top" title="Address: 3rd Floor Cabuyao Retail Plaza, Brgy. Dos, Cabuyao, Philippines, 4025"></i>\n                            </p>\n                            <p class="mb-0 me-4">\n                                <a href="mailto:agricabuyao@gmail.com" class="text-white">\n                                    <i class="fas fa-envelope" data-toggle="tooltip" data-placement="top" title="Email: agricabuyao@gmail.com"></i>\n                                </a>\n                            </p>\n                            <p class="mb-0 me-4">\n                                <i class="fas fa-phone-alt" data-toggle="tooltip" data-placement="top" title="Phone: (049) 5037796"></i>\n                            </p>\n                            <p class="mb-0">\n                                <a href="https://www.facebook.com/cabuyaoagricultureoffice" target="_blank" class="text-white">\n                                    <i class="fab fa-facebook" data-toggle="tooltip" data-placement="top" title="Facebook Page: Cabuyao Agriculture Office"></i>\n                                </a>\n                            </p>\n                            <p class="mb-0 ms-4">\n                                <a href="/management-login" target="_blank" class="text-white" data-toggle="tooltip" data-placement="top" title="Management Login">\n                                    <i class="fas fa-user-cog"></i> <strong>MLogin</strong>\n                                </a>\n                            </p>\n                        </div>\n                    </div>\n                </footer>\n            '),$('[data-toggle="tooltip"]').tooltip(),a()})).then((function(){setInterval((function(){var a=(new Date).toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0});$("#yearData").text(a)}),1e3)}))}))})();