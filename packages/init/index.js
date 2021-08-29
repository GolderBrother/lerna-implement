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