const childProcess = require('child_process');
const test = require('ava');

test.cb('regular', t => {
	const cp = childProcess.spawn('./bin/index.js', {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});
