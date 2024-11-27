var fs = require("fs");
const { src, dest } = require("gulp");
var replace = require("gulp-string-replace");

const path_hml = "./store/hml.json";
const path_prod = "./store/prod.json";
const destFolder = "./store";

function isVersionValid(version) {
  const pattern = new RegExp(/^\d+\.\d+\.\d+$/);
  return String(version).match(pattern);
}

async function overwriteAndroidVersion(versionOverwrite, path) {
  var dataString = fs.readFileSync(path);
  var dataJson = JSON.parse(dataString);

  let versionCode = dataJson?.androidVersionCode;
  let versionName = dataJson?.androidVersionName;

  const regexOldVersionCode = new RegExp(
    `"androidVersionCode": "${versionCode}"`,
    "g"
  );
  const regexOldVersionName = new RegExp(
    `"androidVersionName": "${versionName}"`,
    "g"
  );

  let newVersionCode = parseInt(versionCode, 10) + 1;
  const regexNewVersionCode = `"androidVersionCode": "${newVersionCode}"`;
  const regexNewVersionName = `"androidVersionName": "${versionOverwrite}"`;

  return new Promise((resolve, reject) => {
    src(path)
      .pipe(replace(regexOldVersionCode, regexNewVersionCode))
      .pipe(replace(regexOldVersionName, regexNewVersionName))
      .pipe(dest(destFolder))
      .on("end", resolve)
      .on("error", reject);
  });
}

async function overwriteIosVersion(versionOverwrite, path) {
  var dataString = fs.readFileSync(path);
  var dataJson = JSON.parse(dataString);

  let currentProjectVersion = dataJson?.iosCurrentProjectVersion;
  let marketingVersion = dataJson?.iosMarketingVersion;

  const regexOldCurrentProjectVersion = new RegExp(
    `"iosCurrentProjectVersion": "${currentProjectVersion}"`,
    "g"
  );
  const regexOldMarketingVersion = new RegExp(
    `"iosMarketingVersion": "${marketingVersion}"`,
    "g"
  );

  const regexNewProjectVersion = `"iosCurrentProjectVersion": "1"`;
  const regexNewMarketingVersion = `"iosMarketingVersion": "${versionOverwrite}"`;

  return new Promise((resolve, reject) => {
    src(path)
      .pipe(replace(regexOldCurrentProjectVersion, regexNewProjectVersion))
      .pipe(replace(regexOldMarketingVersion, regexNewMarketingVersion))
      .pipe(dest(destFolder))
      .on("end", resolve)
      .on("error", reject);
  });
}

async function overwriteVersion() {
  const args = process.argv.splice(3, process.argv.length - 3);

  const versionNameIndex = args.indexOf("--versionOverwrite");
  const versionOverwrite = args[versionNameIndex + 1];

  if (!isVersionValid(versionOverwrite)) {
    throw new Error("Provide a valid version");
  }

  const isHml = args.includes("--hml");
  let path = isHml ? path_hml : path_prod;

  const shouldOverwriteIos = args.includes("--ios");
  const shouldOverwriteAndroid = args.includes("--android");

  if (!shouldOverwriteAndroid && !shouldOverwriteIos) {
    throw new Error("Should select platform to overwrite version");
  }

  console.log(`version=${versionOverwrite}`);
  console.log(`env=${isHml ? "hml" : "prod"}`);
  console.log(`ios=${shouldOverwriteIos}`);
  console.log(`android=${shouldOverwriteAndroid}`);

  if (shouldOverwriteAndroid) {
    await overwriteAndroidVersion(versionOverwrite, path);
  }
  if (shouldOverwriteIos) {
    await overwriteIosVersion(versionOverwrite, path);
  }
}

exports.overwriteVersion = overwriteVersion;
