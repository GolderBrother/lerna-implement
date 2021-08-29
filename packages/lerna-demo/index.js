const cli = require('@lerna-implement/cli');
const initCmd = require('@lerna-implement/init/command');
const createCmd = require('@lerna-implement/create/command');
function main(argv) {
  return cli()
   .command(initCmd)
   .command(createCmd)
   .parse(argv);
}

module.exports = main;