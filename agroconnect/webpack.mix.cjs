const mix = require("laravel-mix");
const fs = require("fs");
const path = require("path");

// const jsFiles = fs.readdirSync("resources/management/components/pages");

// jsFiles.forEach((file) => {
//     mix.js(
//         path.join("resources/management/components/pages", file),
//         "public/management/components/pages"
//     ).sourceMaps();
// });

mix.js(
    "resources/management/components/HeaderSidebar.js",
    "public/management/components/HeaderSidebar.js"
);
