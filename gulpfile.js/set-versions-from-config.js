var replace = require("gulp-string-replace");
var fs = require("fs");

const path_hml = "./store/hml.json";
const path_prod = "./store/prod.json";

async function setVersionsFromConfig() {
  let path = path_prod;
  const args = process.argv.splice(3, process.argv.length - 3);
  if (args.includes("--hml")) {
    path = path_hml;
  }

  var dataString = fs.readFileSync(path);
  var dataJson = JSON.parse(dataString);

  console.log(dataJson);
}

exports.setVersionsFromConfig = setVersionsFromConfig;
