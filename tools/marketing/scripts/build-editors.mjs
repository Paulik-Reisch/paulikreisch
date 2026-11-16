import {build} from 'esbuild';
import {resolve} from 'node:path';
// Monaco also vendors a private DOMPurify copy. Redirect that exact import,
// not merely its npm dependency, to the patched audited package.
const securityPlugins=[{name:'patched-dompurify',setup(build){build.onResolve({filter:/\/dompurify\/dompurify\.js$/},()=>({path:resolve('node_modules/dompurify/dist/purify.es.mjs')}));}}];
await build({entryPoints:['public/code-editors-source.mjs'],outfile:'public/bundled/code-editors.js',bundle:true,minify:true,format:'esm',platform:'browser',target:['chrome110','safari16'],loader:{'.ttf':'dataurl'},plugins:securityPlugins,legalComments:'linked'});
await build({entryPoints:['node_modules/monaco-editor/esm/vs/editor/editor.worker.js'],outfile:'public/bundled/editor.worker.js',bundle:true,minify:true,format:'esm',platform:'browser',target:['chrome110','safari16'],legalComments:'linked'});
