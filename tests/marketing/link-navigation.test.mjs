import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {customLinkBridge} from '../../src/marketing/link-navigation.mjs';
import {customFrame} from '../../src/marketing/custom.mjs';

function activate(href, {preview=false}={}) {
  let listener;
  const anchor={target:'_blank',getAttribute:()=>href};
  const context={window:{addEventListener:(type,callback,capture)=>{assert.equal(type,'click');assert.equal(capture,true);listener=callback;}},document:{baseURI:'https://ads.paulikreisch.de/test'},URL};
  vm.runInNewContext(customLinkBridge({preview}).replace(/^<script>|<\/script>$/g,''),context);
  const event={target:{closest:()=>anchor},stopped:false,prevented:false,stopImmediatePropagation(){this.stopped=true;},preventDefault(){this.prevented=true;}};
  listener(event);
  return {event,anchor};
}

test('live external links bypass legacy iframe preview handlers without cancelling native activation',()=>{
  const {event,anchor}=activate('https://paulikreisch.de/shop');
  assert.equal(event.stopped,true);
  assert.equal(event.prevented,false);
  assert.equal(anchor.target,'_top');
});
test('local hash navigation and non-HTTPS controls keep their campaign handlers',()=>{
  for(const href of ['#buch',' #leseprobe ','javascript:void(0)','mailto:test@example.com','https://name:secret@example.com/']){
    const {event,anchor}=activate(href);
    assert.equal(event.stopped,false,href);
    assert.equal(anchor.target,'_blank',href);
  }
});
test('the link bridge loads before HTML and campaign scripts on both live and preview custom pages',()=>{
  const doc={files:[],code:{html:'<a href="https://paulikreisch.de/shop">Shop</a><script>window.legacy=true</script>',css:'',js:'window.campaign=true;'}};
  for(const preview of [false,true]){
    const html=customFrame(doc,{preview});
    assert.ok(html.indexOf('installLinkNavigation')<html.indexOf('window.legacy'));
    assert.ok(html.indexOf('installLinkNavigation')<html.indexOf('window.campaign'));
    assert.match(html,preview?/\}\)\(true\)/:/\}\)\(false\)/);
    assert.doesNotMatch(html,/allow-same-origin|allow-popups|allow-forms/);
  }
});

test('preview height messages target the embedding page origin instead of a wildcard',()=>{
  let click;
  const sent=[];
  const address={textContent:''};
  const node=(tag)=>({tag,style:{},setAttribute(){},addEventListener(){},append(){},showModal(){},scrollIntoView(){},querySelector(){return address;},offsetTop:500,offsetHeight:180});
  const context={URL,window:{addEventListener:(type,callback)=>{if(type==='click')click=callback;}},document:{baseURI:'https://ads.paulikreisch.de/preview/123',documentElement:{scrollHeight:1000},body:{append(){}},createElement:node},parent:{postMessage:(value,origin)=>sent.push({value,origin})},requestAnimationFrame:fn=>fn()};
  vm.runInNewContext(customLinkBridge({preview:true}).replace(/^<script>|<\/script>$/g,''),context);
  click({target:{closest:()=>({getAttribute:()=> 'https://paulikreisch.de/shop'})},clientY:600,stopImmediatePropagation(){},preventDefault(){}});
  assert.equal(sent.length,1);
  assert.equal(sent[0].origin,'https://ads.paulikreisch.de');
  assert.equal(sent[0].value.__prCustomFrame,'height');
  assert.equal(sent[0].value.value,1000);
});

test('frame resize and scroll messages do not use a wildcard target',()=>{
  const html=customFrame({files:[],code:{html:'<p>Text</p>',css:'',js:''}},{preview:true});
  assert.equal(html.includes(',&quot;*&quot;'),false);
  assert.equal(html.includes(',&#39;*&#39;'),false);
});
