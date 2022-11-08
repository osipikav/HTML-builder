const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "files");
const newFolderPath = path.join(__dirname, "files-copy");

fs.rm(newFolderPath, { recursive: true, force: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  fs.readdir(path.join(folderPath), { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    fs.mkdir(newFolderPath, { recursive: true, force: true }, (err) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.copyFile(path.join(folderPath, file.name), path.join(newFolderPath, file.name), (err) => {
          if (err) throw err;
        });
      });
    });
  });
});
