#!/usr/bin/env node

require('dotenv').config();
const chalk = require('chalk');
const shelljs = require('shelljs');
function shell(command) {
  return shelljs.exec(command);
}
function log(message, ...optionalParams) {
  if (optionalParams.length > 0) {
    return console.log(message, optionalParams);
  } else {
    return console.log(message);
  }
}

const tmp = require('tmp');
tmp.setGracefulCleanup();

const temp = tmp.dirSync({ unsafeCleanup: true });
const tempPath = temp.name;
const cleanup = temp.removeCallback;

shelljs.cd(tempPath);

const apps = process.env.HEROKU_APPS.split(',');
const tasks = apps.map((app) => {
  return new Promise(resolve => {
    log(`Setting stack for ${chalk.red.bold(app)}`);
    shell(`heroku stack:set heroku-18 -a ${app}`);
    let err = shell(`heroku git:clone -a ${app}`).stderr;
    shelljs.cd(app);

    if(err && err.length > 0) {
      if (err.includes('warning: You appear to have cloned an empty repository.')) {
        const response = `${app}: Empty repository. GitHub autodeploy? Check README.`;
        
        log(chalk.yellow.bold(response));
        return resolve(response);
      }
    }

    shelljs.cd(app);
    shell(`git commit --allow-empty -m "Upgrading ${app} to heroku-18"`);
    shell('git push heroku master');
    shelljs.cd(tempPath);

    return resolve(`${app}: Success!`);
  });
});

Promise.all(tasks).then(result => {
  log('DONE!', result);
  shelljs.cd('..');
  cleanup();
});
