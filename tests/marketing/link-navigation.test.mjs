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
