const childProcess = require('child_process');
const test = require('ava');

test.cb('test aaja', (t) => {
  const cp = childProcess.spawn('./bin/index.js', { stdio: 'inherit' });

  cp.on('error', t.fail);

  cp.on('close', (code) => {
    t.is(code, 0);
    t.end();
  });
});
