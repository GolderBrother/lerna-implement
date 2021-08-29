const cli = require('@lerna-demo/cli');
const initCmd = require('@lerna-demo/init/command');
const createCmd = require('@lerna-demo/create/command');
function main(argv) {
  return cli()
   .command(initCmd)
   .command(createCmd)
   .parse(argv);
}

module.exports = main;