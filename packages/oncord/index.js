const exec = require('child_process').exec;
exec('npm install @oncord/client').on('exit', () => exec('npm install @oncord/client'));