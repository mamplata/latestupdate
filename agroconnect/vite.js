import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import glob from "glob";

const resourcesDir = "resources/**/*"; // Pattern to match all files in resources
const excludeViewsDir = "resources/views/"; // Substring to exclude certain views if necessary

// Get all resource files
const inputFiles = glob.sync(resourcesDir).filter((file) => {
    // Include HTML files from views and exclude any specific undesired files
    return (
        file.endsWith(".js") || // Include all JavaScript files
        file.endsWith(".css") || // Include all CSS files
        file.endsWith(".png") || // Include image files
        file.endsWith(".jpg") || // Include more image files
        file.endsWith(".woff2") || // Include font files
        file.endsWith(".ttf") // Include more font files
    );
});

export default defineConfig({
    plugins: [
        laravel({
            input: inputFiles,
            refresh: true,
        }),
    ],
});
