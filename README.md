# 一探究竟：管理多包项目的 lerna

## 1.lerna

### 1.1 简介

- [Lerna 官网](https://www.lernajs.cn/) 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目
- [Lerna Git 仓库](https://github.com/lerna/lerna) 是一种工具，针对 使用 `git` 和 `npm` 管理多软件包代码仓库的工作流程进行优化

### 1.2.lerna 入门

首先使用 `npm` 将 `Lerna` 安装到全局环境中

```bash
npm install -g lerna
```

接下来，我们将创建一个新的 `git` 代码仓库

```bash
mkdir lerna-demo && cd lerna-demo
```

现在，我们将上述仓库转变为一个 `Lerna` 仓库：

```bash
lerna init
lerna notice cli v4.0.0
lerna info Initializing Git repository
lerna info Creating package.json
lerna info Creating lerna.json
lerna info Creating packages directory
lerna success Initialized Lerna files
```

```bash
lerna-demo / packages / 放置多个软件包(package);
package.json;
lerna.json;
```

.gitignore

```gitignore
node_modules
.idea
.vscode
```

### 1.3 管理模式

`lerna` 有两种管理模式，固定模式和独立模式

#### 1.3.1 固定/锁定模式（默认）

命令：`lerna init`

固定模式: 通过 `lerna.json` 里的版本进行统一的版本管理。这种模式会自动将所有 `packages` 包版本捆绑在一起，对任何其中一个或者多个 `packages` 进行重大改动都会导致所有 `packages` 的版本号进行升级。

#### 1.3.2 独立模式

命令：`lerna init --independent`

独立模式: `init` 的时候需要设置选项 `--independent`。这种模式允许使用者对每个`package`单独改变版本号。每次执行`lerna publish`的时候，会针对所有有更新的`package`，会逐个询问需要升级的版本号，基准版本为它自身的`package.json`里面的版本号。
这种情况下，`lerna.json` 的版本号就不会变化， 默认为 `independent` 。

### `lerna` 配置

```json
{
  "version": "0.0.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}

```

参数说明：

- `version`: 当前库的版本号，独立模式下，此参数设置为 `independent`
- `npmClient`: 允许指定命令使用的`client`， 默认是 `npm`， 可以设置成 `yarn`
- `command.publish.ignoreChanges`: 可以指定那些目录或者文件的变更不会被 `publish`
- `command.publish.message`: 指定发布时提交的消息格式
- `command.publish.registry`: 设置npm包发布的注册地址
- `command.bootstrap.ignore`: 设置执行 `lerna bootstrap` 安装依赖时不受影响的包
- `command.bootstrap.npmClientArgs`: 指定在执行 `lerna bootstrap` 命令时传递给`npm install`的参数
- `command.bootstrap.scope`: 指定那些包会受 `lerna bootstrap`  命令影响
- `packages` 指定包所在目录

移步[更多配置](http://www.febeacon.com/lerna-docs-zh-cn/routes/basic/concepts.html#lerna-json)

## 2.lerna 源码

### 2.1 配置安装源

```bash
npm install -g yrm
npm install -g nrm
```

### 2.2 克隆源码

```bash
git clone https://github.com/lerna/lerna --depth=1
```

### 2.3 调试源码

创建vscode启动调试的配置文件：`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/source/lerna/core/lerna/cli.js", // workspaceFolder 表示当前工作空间根目录
      "args": ["ls"]
    }
  ]
}
```

### 2.4 核心包

```bash
lerna 入口核心包
@lerna/cli 一些核心命令 
@lerna/create 创建包命令
@lerna/init 初始化lerna项目
```

## 3.创建 `npm` 私服

- [verdaccio](https://www.npmjs.com/package/verdaccio)是一个简单 、零配置的本地私有化 `npm` 仓库

### 3.1 安装

```bash
npm install verdaccio -g
```

### 3.2 启动私服

```bash
verdaccio
```

### 3.3 登录发布

```bash
npm adduser --registry http://localhost:4873/ 
npm publish --registry http://localhost:4873/
```

### 3.4 本地访问

```bash
http://localhost:4873
```

![login.png](./img/login.png)

## 4.创建包

```bash
lerna create lerna-implement --registry http://localhost:4873
lerna success create New package lerna-implement created at ./packages/lerna-implement
lerna create @lerna-implement/cli --registry http://localhost:4873
lerna success create New package @lerna-implement/cli created at ./packages/cli
lerna create @lerna-implement/create --registry http://localhost:4873
lerna success create New package @lerna-implement/create created at ./packages/create
lerna create @lerna-demo/init --registry http://localhost:4873
lerna success create New package @lerna-demo/init created at ./packages/init
```

![lerna-create-package.png](./img/lerna-create-package.png)

创建完毕后，整个项目的目录结构是这样子的👇🏻

![project-img](./img/project-img.png)


## 5.单元测试

- [Jest](https://www.jestjs.cn/)是一个 `JavaScript` 测试框架
- [expect](https://www.jestjs.cn/docs/expect)

```bash
npm install --save-dev jest
//在所有的包下执行test命令
lerna run test
//在lerna-demo下执行test命令
lerna run test --scope lerna-demo

//在所有的包下执行shell脚本
lerna exec -- jest
//在lerna-demo目录下执行shell脚本
lerna exec --scope lerna-demo -- jest
```

### 5.1 package.json

```diff
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^4.0.0"
  },
+ "scripts": {
+    "test":"jest"
+  }
}
```

### 5.2 jest 配置（`jest.config.js`）

- [configuration](https://www.jestjs.cn/docs/configuration)
- [expect](https://www.jestjs.cn/docs/expect)

```js
module.exports = {
  testMatch: ["**/__tests__/**/*.test.js"],
};
```

### 5.3 lerna-demo/package.json

packages/lerna-demo/package.json

```diff
{
+  "scripts": {
+    "test": "jest"
+  }
}
```

### 5.4 lerna-demo.js

packages/lerna-demo/lib/lerna-demo.js

```js
module.exports = lerna-demo;
function lerna-demo() {
  return "lerna-demo";
}
```

### 5.5 create.test.js
packages/create/lib/create.js

```js
"use strict";

module.exports = create;

function create() {
  return 'create';
}
```

### 5.5 create.test.js

packages/create/__tests__/create.test.js

```js
"use strict";

const create = require("..");
describe("@lerna-demo/create", () => {
  it("create", () => {
    expect(create()).toEqual("create");
  });
});
```

## 6.eslint

- [eslint](https://www.npmjs.com/package/eslint)是一个插件化并且可配置的 JavaScript 语法规则和代码风格的检查工具
- 代码质量问题：使用方式有可能有问题
- 代码风格问题：风格不符合一定规则
- [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

```bash
npm i eslint  --save-dev
```

### 6.1 eslint 配置

.eslintrc.js

```js
module.exports = {
  parserOptions: { ecmaVersion: 2017, sourceType: "module" },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": ["off"],
  },
  env: { node: true, jest: false },
};
```

### 6.2 eslint 忽略文件配置

.eslintignore

```bash
bash
/dist/
/node_modules/
/public/
/coverage/
/package.json
/package-lock.json
__tests__
**/*.d.ts
```

### 6.3 package.json

```diff
  "scripts": {
    "test": "jest",
+   "lint":"eslint --ext .js packages/**/*.js --no-error-on-unmatched-pattern --fix"
  }
```

## 7.Prettier

- [ESLint](https://www.npmjs.com/package/eslint) 主要解决的是**代码质量**问题
- [Prettier]((https://prettier.io/)) 主要解决的是**代码风格**问题(声称自己是一个有主见的代码格式化工具)
- Prettier 会去掉你代码里的所有样式风格，然后用统一固定的格式重新输出
- [Prettier vs. Linters](https://prettier.io/docs/en/comparison.html)
- [integrating-with-linters](https://prettier.io/docs/en/integrating-with-linters.html)
- Prettier 对应的是各种 `Linters` 的 `Formatting rules` 这一类规则
- 禁用 `Linters` 自己的 `Formatting rules`，让 `Prettier` 接管这些职责
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)用来关闭和 `Prettier` 冲突非必要的规则
- [recommended-configuration](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)
- [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

```bash
npm i prettier eslint-plugin-prettier --save-dev
```

### 7.1 .eslintrc.js

```diff
module.exports = {
  extends: ['eslint:recommended'],
  // 让所有可能会与 prettier 规则存在冲突的 eslint rule失效，并使用 prettier 的规则进行代码检查
  // 相当于用 prettier 的规则，覆盖掉 eslint:recommended 的部分规则
+ plugins: ['prettier'],
  rules: {
    'no-unused-vars': ['off'],
    //不符合prettier规则的代码要进行错误提示
+   'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  env: { node: true, jest: false },
};
```

### 7.2 .prettierrc.js

```js
module.exports = {
  singleQuote: true,
};
```

## 8.Stylelint

- [`stylelint`](https://stylelint.io/): 强大的style linter, 可帮助您避免错误并强制执行样式中的约定。

```bash
npm i stylelint --save-dev
```

### 8.1 `.stylelintrc.js`

```js
module.exports = {
  "rules": {
    "color-no-invalid-hex": true
  }
};
```

### 8.2 `.stylelintignore`

```js
**/*.min.css
**/dist/
**/public/
**/node_modules/
```


## 9.editorconfig

- [editorconfig](https://editorconfig.org/)帮助开发人员在不同的编辑器和 `IDE` 之间定义和维护一致的编码样式
- 不同的开发人员，不同的编辑器，有不同的编码风格，而 `EditorConfig` 就是用来协同团队开发人员之间的代码的风格及样式规范化的一个工具，而.editorconfig 正是它的默认配置文件
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- vscode 这类编辑器，需要自行安装 `editorconfig` 插件

### 8.1 .editorconfig

- Unix 系统里，每行结尾只有换行,即`\n` LF(Line Feed)
- Windows 系统里面，每行结尾是`换行 回车`，即`\r\n` CR/LF
- Mac 系统里，每行结尾是`回车`，即`\r` CR(Carriage Return)

```js
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### 8.2 总结

- 开发过程中，如果写出代码质量有问题的代码，`eslint` 能够及时提醒开发者，便于及时修复
- 如果写出代码格式有问题的代码，`prettier` 能够自动按照我们制定的规范、格式化代码
- 不同开发者如果使用不同的编辑器(webstorm/vscode)或系统(windows/mac),能够执行统一的代码风格标准

## 10.git hook

### 9.1 pre-commit

- 可以在 `git commit` 之前检查代码，保证所有提交到版本库中的代码都是符合规范的
- 可以在 `git push` 之前执行单元测试,保证所有的提交的代码经过的单元测试
- [husky](https://www.npmjs.com/package/husky)可以让我们向项目中方便添加 `git hooks`
- [lint-staged](https://www.npmjs.com/package/lint-staged) 用于实现每次提交只检查本次提交所修改的文件

#### 9.1.1 安装 Git hooks

```js
npm i husky lint-staged --save-dev
npm set-script prepare "husky install"
git init
npm run prepare
```

#### 9.1.2 安装 pre-commit

```js
npx husky add .husky/pre-commit "lint-staged"
```

`/.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

npm run lint-staged
```

`package.json`

```diff
  "scripts": {
+   "lint-staged": "lint-staged -c ./.husky/.lintstagedrc.js",
  }
```

### 9.2 commit-msg

- [commitizen](https://www.npmjs.com/package/commitizen)插件可帮助实现一致的提交消息
- [cz-customizable](https://www.npmjs.com/package/cz-customizable)可以实现自定义的提交信息
- [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)可以检查提交信息
- [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)检查您的常规提交

#### 9.2.1 安装配置

```bash
# 全局安装
npm install -g commitizen

# 或者本地安装
npm install --save-dev commitizen
```

安装完成后可以使用 `git cz` 来代替 `git commit`,然后根据提示一步步输入即可

```bash
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

#### 9.2.2 配置 `.commitlintrc.js`

```bash
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 其他规则可自定义
  },
};
```

#### 9.2.3 添加命令

```bash
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

#### 9.2.6 package.json

```diff
  "devDependencies": {
+   "@commitlint/cli": "^13.1.0",
+   "@commitlint/config-conventional": "^13.1.0",
+   "commitizen": "^4.2.4",
+   "husky": "^7.0.2",
    "jest": "^27.1.0",
    "lerna": "^4.0.0"
  },
  "scripts": {
    "test": "jest",
    "lint": "eslint --ext .js packages/**/*.js --no-error-on-unmatched-pattern --fix",
+   "prepare": "husky install",
+   "commit": "git-cz"
  }
```

## 11.发布上线

```bash
npx husky add .husky/pre-push "npm run test"
lerna version
lerna publish
```

## 12.安装命令

### 11.1 cli.js

packages/lerna-demo/cli.js

```js
#!/usr/bin/env node
require(".")(process.argv.slice(2));
```

### 11.2 lerna-demo/index.js

packages/lerna-demo/index.js

```js
module.exports = main;
function main(argv) {
  console.log(argv);
}
```

### 11.3 lerna-demo/package.json

packages/lerna-demo/package.json

```diff
{
+  "main": "index.js",
+  "bin":{
+    "lerna-demo":"cli.js"
+  }
}
```

### 11.4 链接

```bash
cd packages/lerna-demo
npm link
lerna-demo
```

看看效果：

![lerna-demo-cli.png](./img/lerna-demo-cli.png)

## 13.yargs

- [yargs](https://www.npmjs.com/package/yargs)用来解析命令行参数和选项

```js
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
node lerna-demo.js create project --registry  http://localhost:4873
执行init命令 {
  '$0': 'lerna-demo.js',
  _: [ 'create' ],
  name: 'project'
  registry: 'http://localhost:4873',
}
*/
```

![lerna-init](./img/lerna-init.png)

## 14.跑通 init 命令

```bash
lerna link
lerna bootstrap
```

### 13.1 cli/package.json

packages/cli/package.json

```diff
"dependencies": {
  "@lerna-implement/cli": "^0.0.2",
  "@lerna-implement/create": "^0.0.2",
  "@lerna-implement/init": "^0.0.2"
},
+  "main": "index.js"
```

### 13.2 cli/index.js

packages/cli/index.js

```js
const yargs = require("yargs/yargs");
function lernaCLI() {
  const cli = yargs();
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
  return cli
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
    );
}
module.exports = lernaCLI;
```

### 13.3 init/command.js

packages/init/command.js

```js
exports.command = "init";
exports.describe = "创建一个新的Lerna仓库";
exports.builder = (yargs) => {
  console.log("执行init builder");
};
exports.handler = (argv) => {
  console.log("执行init命令", argv);
};
```

### 13.4 lerna-demo\package.json

packages\lerna-demo\package.json

```diff
+  "main": "index.js"
```

### 13.5 lerna-demo\index.js

packages\lerna-demo\index.js

```diff
const cli = require('@lerna-implement/cli');
const initCmd = require('@lerna-implement/init/command');
function main(argv) {
  return cli().command(initCmd).parse(argv);
}

module.exports = main;
```

## 15.实现 init 命令

### 14.1 安装依赖

```bash
lerna add fs-extra packages/init
lerna add execa packages/init
```

### 14.2 init/command.js

packages/init/command.js

```js
exports.command = "init";
exports.describe = "创建一个新的Lerna仓库";
exports.builder = () => {
  console.log("执行init builder");
};
exports.handler = (argv) => {
  console.log("执行init命令", argv);
  return require(".")(argv);
};
```

### 14.3 packages/init/index.js

packages/init/index.js

```js
const path = require("path");
const fs = require("fs-extra");
const execa = require("execa");

class InitCommand {
  constructor(argv) {
    this.argv = argv;
    this.rootPath = path.resolve();
  }
  async execute() {
    await execa("git", ["init"], { stdio: "pipe" });
    await this.ensurePackageJSON();
    await this.ensureLernaConfig();
    await this.ensurePackagesDir();
    console.log("Initialized Lerna files");
  }
  async ensurePackageJSON() {
    console.log("创建 package.json");
    await fs.writeJson(
      path.join(this.rootPath, "package.json"),
      {
        name: "root",
        private: true,
        devDependencies: {
          lerna: "^4.0.0",
        },
      },
      { spaces: 2 }
    );
  }
  async ensureLernaConfig() {
    console.log("创建 lerna.json");
    await fs.writeJson(
      path.join(this.rootPath, "lerna.json"),
      {
        packages: ["packages/*"],
        version: "0.0.0",
      },
      { spaces: 2 }
    );
  }
  async ensurePackagesDir() {
    console.log("创建 packages 目录");
    await fs.mkdirp(path.join(this.rootPath, "packages"));
  }
}
function factory(argv) {
  new InitCommand(argv).execute();
}
module.exports = factory;
```

## 16.实现 create 命令

- [pify](https://www.npmjs.com/package/pify)
- [dedent](https://www.npmjs.com/package/dedent)
- [init-package-json](https://www.npmjs.com/package/init-package-json)

### 15.1 安装依赖

在 `packages/create` 包下安装依赖

```bash
lerna add pify packages/create
lerna add init-package-json packages/create
lerna add dedent packages/create
```

![install-dep-package](./img/install-dep-package.png)

packages/create/package.json

```diff
"dependencies": {
+   "dedent": "^0.7.0",
+   "init-package-json": "^2.0.4",
+   "pify": "^5.0.0"
}
```

### 15.2 lerna-demo/index.js

packages/lerna-demo/index.js

```diff
const cli = require('@lerna-implement/cli');
const initCmd = require('@lerna-implement/init/command');
const createCmd = require('@lerna-implement/create/command');
function main(argv) {
  return cli()
   .command(initCmd)
+  .command(createCmd)
   .parse(argv);
}

module.exports = main;
```

### 15.3 lerna-demo/package.json

packages/lerna-demo/package.json

```diff
{
  "dependencies": {
    "@lerna-implement/cli":"^0.0.2",
    "@lerna-implement/init":"^0.0.2",
+   "@lerna-implement/create":"^0.0.2"
  },
}
```

### 15.4 create/command.js

packages/create/command.js

```js
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
```

### 15.5 create/index.js

packages/create/index.js

```js
const path = require("path");
const fs = require("fs-extra");
const dedent = require("dedent");
const initPackageJson = require("pify")(require("init-package-json"));
class CreateCommand {
  constructor(options) {
    this.options = options;
    this.rootPath = path.resolve();
    console.log("options", options);
  }
  async execute() {
    const { name, registry } = this.options;
    this.targetDir = path.join(this.rootPath, "packages/cli");
    this.libDir = path.join(this.targetDir, "lib");
    this.testDir = path.join(this.targetDir, "__tests__");
    this.libFileName = `${name}.js`;
    this.testFileName = `${name}.test.js`;
    await fs.mkdirp(this.libDir);
    await fs.mkdirp(this.testDir);
    await this.writeLibFile();
    await this.writeTestFile();
    await this.writeReadme();
    var initFile = path.resolve(process.env.HOME, ".npm-init");
    await initPackageJson(this.targetDir, initFile);
  }
  async writeLibFile() {
    const libContent = dedent`
        module.exports = ${this.camelName};
        function ${this.camelName}() {
            // TODO
        }
    `;
    await catFile(this.libDir, this.libFileName, libContent);
  }
  async writeTestFile() {
    const testContent = dedent`
    const ${this.camelName} = require('..');
    describe('${this.pkgName}', () => {
        it('needs tests');
    });
  `;
    await catFile(this.testDir, this.testFileName, testContent);
  }
  async writeReadme() {
    const readmeContent = dedent`## Usage`;
    await catFile(this.targetDir, "README.md", readmeContent);
  }
}
function catFile(baseDir, fileName, content) {
  return fs.writeFile(path.join(baseDir, fileName), `${content}\n`);
}
function factory(argv) {
  new CreateCommand(argv).execute();
}

module.exports = factory;
```

## 17.参考

### 16.1 lerna 命令

#### 项目初始化

| 命令       | 说明       |
| :--------- | :--------- |
| lerna init | 初始化项目 |

#### 16.2 创建包

| 命令         | 说明         | 🌰          |
| :----------- | :----------- | :----------- |
| lerna create | 创建 package | `lerna create lerna-implement --registry http://localhost:4873` |
| lerna add    | 安装依赖     | `lerna add fs-extra packages/init` |
| lerna link   | 链接依赖     | - |
| lerna import   | 导入存在的包     | `lerna import ~/Users/Product --dest=utilities`(把路径为~/Users/Product的包导入到名为utilites的包)| 


#### 16.3 开发和测试

| 命令            | 说明            | 🌰          |
| :-------------- | :-------------- | :----------- |
| lerna exec      | 执行 shell 脚本 |`lerna exec -- jest` |
| lerna run       | 执行 npm 命令   |`lerna run test`|
| lerna clean     | 清空依赖        | - |
| lerna bootstrap | 重新安装依赖    | - |

#### 16.4 发布上线

| 命令          | 说明                       |
| :------------ | :------------------------- |
| lerna version | 修改版本号                 |
| lerna changed | 查看上个版本以来的所有变更 |
| lerna diff    | 查看 diff                  |
| lerna publish | 发布项目                   |


最终发布的执行结果：

![lerna-publish.png](./img/lerna-publish.png)

### 17.格式化提交

#### 17.1 Conventional Commits

- 规范化的`git commit`可以提高`git log`可读性，生成格式良好的`changelog`
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 是一种用于给提交信息增加人机可读含义的规范
- 它提供了一组简单规则来创建清晰的提交历史
- 通过在提交信息中描述功能、修复和破坏性变更，使这种惯例与 [semver](https://semver.org/) 相互对应

```js
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

#### 17.2 类型（type）

- feat: 类型 为 feat 的提交表示在代码库中新增了一个功能（这和语义化版本中的 MINOR 相对应）
- fix: 类型 为 fix 的提交表示在代码库中修复了一个 bug（这和语义化版本中的 PATCH 相对应）
- docs: 只是更改文档
- style: 不影响代码含义的变化（空白、格式化、缺少分号等）
- refactor: 代码重构，既不修复错误也不添加功能
- perf: 改进性能的代码更改
- test: 添加确实测试或更正现有的测试
- build: 影响构建系统或外部依赖关系的更改（示例范围：gulp、broccoli、NPM）
- ci: 更改持续集成文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）
- chore: 其他不修改 src 或 test 文件。
- revert: commit 回退

#### 17.3 范围（scope）

- 可以为提交类型添加一个围在圆括号内的作用域，以为其提供额外的上下文信息
  
## 参考资料

- [lerna多包管理实践](https://juejin.cn/post/6844904194999058440#heading-36)
- [开始| Lerna - 大笑文档](http://www.febeacon.com/lerna-docs-zh-cn/routes/basic/start.html)
