const fs = require("fs");
const path = require("path");
let stream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
stream.on("data", (x) => console.log(x));
