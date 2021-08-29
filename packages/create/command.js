exports.command = "create <name>";
exports.describe = "创建一个新的lerna管理的包";
exports.builder = (yargs) => {
  console.log("执行init builder");
  yargs
    .positional("name", {
      describe: "包名(包含scope)",
      type: "string",
    })
    .options({
      registry: {
        group: "Command Options:",
        describe: "配置包的发布仓库",
        type: "string",
      },
    });
};
exports.handler = (argv) => {
  console.log("执行create命令", argv);
  return require(".")(argv);
};