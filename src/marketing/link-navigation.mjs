// This runs before campaign scripts, so legacy iframe-based preview handlers
// cannot intercept real links on published pages. The sandbox remains opaque.
function installLinkNavigation(preview) {
  let dialog;
  window.addEventListener('click', event => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor) return;
    const raw = anchor.getAttribute('href')?.trim();
    if (!raw || raw.startsWith('#')) return;
    let target;
    try { target = new URL(raw, document.baseURI); } catch { return; }
    if (target.protocol !== 'https:' || target.username || target.password) return;
    // Native link activation keeps the user-activation required by the sandbox.
    // No popups, same-origin access, form or network privileges are added.
    event.stopImmediatePropagation();
    if (!preview) {
      anchor.target = '_top';
      return;
    }
    event.preventDefault();
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.setAttribute('aria-label', 'Linkziel in der privaten Vorschau');
      dialog.style.cssText = 'position:absolute;box-sizing:border-box;width:min(520px,calc(100% - 32px));max-width:calc(100% - 32px);margin:0 auto;padding:24px;border:1px solid #d4af7a;border-radius:12px;background:#fff7e8;color:#153f40;font:16px/1.5 system-ui,sans-serif;overflow-wrap:anywhere';
      const title = document.createElement('h2');
      title.textContent = 'Private Entwurfsvorschau';
      title.style.cssText = 'margin:0 0 12px;font:700 22px/1.3 system-ui,sans-serif';
      const note = document.createElement('p');
      note.textContent = 'Dieser Link würde zu folgendem Ziel führen:';
      const address = document.createElement('p');
      address.setAttribute('data-preview-destination', '');
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'Zurück zur Vorschau';
      close.style.cssText = 'padding:10px 16px;border:0;border-radius:6px;background:#153f40;color:white;font:inherit;cursor:pointer';
      close.addEventListener('click', () => dialog.close());
      dialog.append(title, note, address, close);
      document.body.append(dialog);
    }
    dialog.querySelector('[data-preview-destination]').textContent = target.href;
    dialog.style.top = Math.max(16, event.clientY - 100) + 'px';
    dialog.showModal();
  }, true);
}

export function customLinkBridge({preview = false} = {}) {
  return `<script>(${installLinkNavigation.toString()})(${JSON.stringify(preview)});</script>`;
}
