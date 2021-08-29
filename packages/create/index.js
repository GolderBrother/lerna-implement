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