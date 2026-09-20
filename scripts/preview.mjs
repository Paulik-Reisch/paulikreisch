import { spawn } from 'node:child_process';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--turbopack', '-p', '9002'], {
  stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_LOCAL_PREVIEW: 'true' },
});
child.on('exit', code => process.exit(code ?? 1));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
