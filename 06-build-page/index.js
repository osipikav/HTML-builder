const path = require("path");
const fs = require("fs");
const pathProject = path.join(__dirname, "project-dist");

(async () => {
  await fs.promises.rm(pathProject, { recursive: true, force: true });
  await fs.promises.mkdir(pathProject);
  await copyFile(path.join(__dirname, "assets"), path.join(pathProject, "assets"));
  await copyStyle();
  await createHTML();
})();

async function copyFile(pathFolder, pathNewFolder) {
  await fs.promises.rm(pathNewFolder, { recursive: true, force: true });
  await fs.promises.mkdir(pathNewFolder);
  const elements = await fs.promises.readdir(pathFolder, { withFileTypes: true });
  elements.forEach(async (file) => {
    if (file.isFile()) {
      await fs.promises.copyFile(path.join(pathFolder, file.name), path.join(pathNewFolder, file.name));
    } else {
      await copyFile(path.join(pathFolder, file.name), path.join(pathNewFolder, file.name));
    }
  });
}

async function copyStyle() {
  const writeStream = fs.createWriteStream(path.join(pathProject, "style.css"), "utf-8");
  const pathStyle = path.join(__dirname, "styles");
  const files = await fs.promises.readdir(pathStyle, { withFileTypes: true });
  files
    .filter((file) => file.isFile())
    .forEach(async (file) => {
      const pathFile = path.join(pathStyle, file.name);
      if (path.extname(pathFile) === ".css") {
        const readStream = fs.createReadStream(pathFile, "utf-8");
        readStream.pipe(writeStream);
      }
    });
}

async function getTemplates() {
  const resObj = {};
  const pathComponents = path.join(__dirname, "components");
  const components = await fs.promises.readdir(pathComponents, { withFileTypes: true });
  for (const file of components) {
    const pathFile = path.join(pathComponents, file.name);
    if (file.isFile() && path.extname(pathFile) === ".html") {
      const data = await fs.promises.readFile(pathFile);
      resObj[file.name] = data.toString();
    }
  }
  return resObj;
}
async function createHTML() {
  const components = await getTemplates();
  const stream = fs.createWriteStream(path.join(pathProject, "index.html"));
  fs.readFile(path.join(__dirname, "template.html"), "utf-8", (err, data) => {
    if (err) throw err;
    let resObj = data;
    for (let item of Object.keys(components)) {
      resObj = resObj.replace(`{{${item.split(".")[0]}}}`, components[item]);
    }
    stream.write(resObj);
  });
}
