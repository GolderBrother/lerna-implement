const yargs = require("yargs/yargs");
const argv = process.argv.slice(2);
const cli = yargs(argv);
//应用到每一个命令的全局参数
const opts = {
  loglevel: {
    defaultDescription: "info",
    describe: "报告日志的级别",
    type: "string",
    alias: "L",
  },
};
//全局的key
const globalKeys = Object.keys(opts).concat(["help", "version"]);
cli
  .options(opts) //配置全局参数
  .group(globalKeys, "Global Options:") // 把全局参数分到全局组里
  .usage("Usage: $0 <command> [options]") //提示使用说明
  .demandCommand(1, "至少需要一个命令，传递--help查看所有的命令和选项") //指定最小命令数量
  .recommendCommands() //推荐命令
  .strict() //严格命令，不正确 会报错
  .fail((msg, err) => {
    //自定义错误打印
    console.error("lerna", msg, err);
  })
  .alias("h", "help") //别名
  .alias("v", "version") //别名
  .wrap(cli.terminalWidth()) //命令行宽度
  .epilogue(
    //结语
    `当1个命令失败了，所有的日志将会写入当前工作目录中的lerna-debug.log`
  )
  .command({
    command: "create <name>",
    describe: "创建一个新的lerna管理的包",
    builder: (yargs) => {
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
    },
    handler: (argv) => {
      console.log("执行init命令", argv);
    },
  })
  .parse(argv);

/**
node lib/lerna-demo.js create project --registry  http://localhost:4873
执行init命令 {
  _: [ 'create' ],
  registry: 'http://localhost:4873',
  '$0': 'lib/lerna-demo.js',
  name: 'project'
}
*/