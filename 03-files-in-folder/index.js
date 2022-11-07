const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
  data.forEach((item) => {
    if (item.isFile()) {
      fs.stat(path.join(folderPath, item.name), (err, x) => {
        console.log(`${item.name.split(".")[0]} - ${path.extname(item.name).slice(1)} - ${x.size / 1000}kb`);
      });
    }
  });
});
