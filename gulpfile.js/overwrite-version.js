function overwriteVersion() {
  const args = process.argv.splice(3, process.argv.length - 3);
  const versionNameIndex = args.indexOf("--versionName");
  const versionName = args[versionNameIndex + 1];
  console.log(versionName);
}

exports.overwriteVersion = overwriteVersion;
