exports.command = "init";
exports.describe = "创建一个新的Lerna仓库";
exports.builder = () => {
  console.log("执行init builder...");
};
exports.handler = (argv) => {
  console.log("执行init命令...", argv);
  return require(".")(argv);
};