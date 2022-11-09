const fs = require("fs");
const path = require("path");

const bandlePath = path.join(__dirname, "project-dist");
const stylePath = path.join(__dirname, "styles");
const bundleCss = fs.createWriteStream(path.join(bandlePath, "bundle.css"), "utf-8");

(async () => {
  const files = await fs.promises.readdir(stylePath, { withFileTypes: true });
  files.forEach((file) => {
    if (path.extname(file.name) === ".css") {
      const stream = fs.createReadStream(path.join(stylePath, file.name));
      stream.pipe(bundleCss);
    }
  });
})();
