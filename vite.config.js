const { copyFileSync, cpSync, mkdirSync } = require("node:fs");
const path = require("node:path");
const { defineConfig } = require("vite");

function copyStaticAppFiles() {
  return {
    name: "copy-static-app-files",
    apply: "build",
    closeBundle() {
      const outputDirectory = path.resolve(__dirname, "dist");
      const rootFiles = [
        "main.js",
        "sw.js",
        "style.css",
        "404.html",
        "robots.txt",
        "sitemap.xml",
        "favicon.ico",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ];

      for (const file of rootFiles) {
        copyFileSync(
          path.resolve(__dirname, file),
          path.resolve(outputDirectory, file),
        );
      }

      for (const directory of ["modules", "assets"]) {
        const destination = path.resolve(outputDirectory, directory);
        mkdirSync(destination, { recursive: true });
        cpSync(
          path.resolve(__dirname, directory),
          destination,
          { recursive: true },
        );
      }
    },
  };
}

module.exports = defineConfig({
  plugins: [copyStaticAppFiles()],
  build: {
    manifest: "asset-manifest.json",
  },
  server: {
    watch: {
      ignored: ["**/android/**"],
    },
  },
});
