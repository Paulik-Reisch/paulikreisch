import * as monaco from 'monaco-editor/editor/editor.api.js';
import 'monaco-editor/languages/definitions/html/register.js';
import 'monaco-editor/languages/definitions/css/register.js';
import 'monaco-editor/languages/definitions/javascript/register.js';
import {EditorState} from '@codemirror/state';
import {EditorView,keymap,lineNumbers,highlightActiveLine,drawSelection} from '@codemirror/view';
import {defaultKeymap,history,historyKeymap,indentWithTab} from '@codemirror/commands';
import {syntaxHighlighting,defaultHighlightStyle,bracketMatching} from '@codemirror/language';
import {html} from '@codemirror/lang-html';import {css} from '@codemirror/lang-css';import {javascript} from '@codemirror/lang-javascript';
self.MonacoEnvironment={getWorker:()=>new Worker('/assets/editor.worker.js',{type:'module'})};
window.PRCodeEditors={
  mount(container,{engine='monaco',language='html',value='',onChange=()=>{}}){
    container.replaceChildren();
    if(engine==='codemirror'){
      const view=new EditorView({state:EditorState.create({doc:value,extensions:[lineNumbers(),history(),drawSelection(),highlightActiveLine(),bracketMatching(),syntaxHighlighting(defaultHighlightStyle),keymap.of([indentWithTab,...defaultKeymap,...historyKeymap]),({html,css,javascript}[language]??html)(),EditorView.lineWrapping,EditorView.theme({'&':{height:'440px',fontSize:'13px'},'.cm-scroller':{overflow:'auto',fontFamily:'ui-monospace,monospace'},'.cm-content':{padding:'12px 0'},'.cm-gutters':{backgroundColor:'#fafbf8',borderColor:'#e4e7e3'}}),EditorView.updateListener.of(update=>{if(update.docChanged)onChange(update.state.doc.toString());})]}),parent:container});
      return {getValue:()=>view.state.doc.toString(),dispose:()=>view.destroy(),focus:()=>view.focus()};
    }
    const editor=monaco.editor.create(container,{value,language:language==='javascript'?'javascript':language,theme:'vs',automaticLayout:true,minimap:{enabled:false},fontSize:13,fontFamily:'ui-monospace,monospace',scrollBeyondLastLine:false,wordWrap:'on',padding:{top:12},overviewRulerLanes:0,renderLineHighlight:'line',tabSize:2,accessibilitySupport:'on',ariaLabel:language.toUpperCase()+' Code'});
    const subscription=editor.onDidChangeModelContent(()=>onChange(editor.getValue()));
    return {getValue:()=>editor.getValue(),dispose:()=>{subscription.dispose();editor.getModel()?.dispose();editor.dispose();},focus:()=>editor.focus()};
  }
};
window.dispatchEvent(new Event('pr-code-ready'));
