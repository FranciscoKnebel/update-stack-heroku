#!/usr/bin/env node

require('dotenv').config();
const shelljs = require('shelljs');
function shell(command) {
  return shelljs.exec(command);
}

const apps = process.env.HEROKU_APPS.split(",");

shelljs.mkdir('temp');
shelljs.cd('temp');

const tasks = apps.map((app) => {
  return new Promise(resolve => {
    function cleanup() {
      shelljs.cd('..');
      shelljs.rm('-rf', app);
    }

    console.log(`Setting stack for ${app}`);
    shell(`heroku stack:set heroku-18 -a ${app}`);
    let err = shell(`heroku git:clone -a ${app}`).stderr;
    shelljs.cd(app);

    if(err && err.length > 0) {
      if (err.includes('warning: You appear to have cloned an empty repository.')) {
        cleanup();
        const response = `${app}: Empty repository. GitHub autodeploy? Check README.`;
        
        console.log(response);
        return resolve(response);
      }
    }

    shelljs.cd(app);
    shell(`git commit --allow-empty -m "Upgrading ${app} to heroku-18"`);
    shell('git push heroku master');

    cleanup();
    return resolve(`${app}: Success!`);
  });
});

Promise.all(tasks).then(result => {
  console.log('DONE!', result);
  shelljs.cd('..');
  shelljs.rm('-rf', 'temp');
});
