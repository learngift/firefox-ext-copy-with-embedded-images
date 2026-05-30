browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "copyWithImages") {
    handleCopy();
  }
});

async function handleCopy() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  showToast("Récupération des images…");

  const container = document.createElement('div');
  container.appendChild(sel.getRangeAt(0).cloneContents());

  const imgs = [...container.querySelectorAll('img[src]')].filter(img => {
    const src = img.getAttribute('src');
    return src && !src.startsWith('data:');
  });

  // Les fetch depuis un content script utilisent les cookies de la page (ex: Gmail)
  await Promise.all(imgs.map(async (img) => {
    try {
      const resp = await fetch(img.src);
      if (!resp.ok) return;
      const blob = await resp.blob();
      img.src = await blobToBase64(blob);
    } catch (e) {
      // image conservée telle quelle si échec
    }
  }));

  copyHTMLToClipboard(container.innerHTML);
  showToast("✓ Copié avec " + imgs.length + " image(s) embarquée(s)");
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function copyHTMLToClipboard(html) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;opacity:0;pointer-events:none;top:0;left:0;z-index:-1';
  div.contentEditable = 'true';
  div.innerHTML = html;
  document.body.appendChild(div);

  const range = document.createRange();
  range.selectNodeContents(div);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
  document.body.removeChild(div);
}

function showToast(msg) {
  let toast = document.getElementById('__copy-embed-toast__');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '__copy-embed-toast__';
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:2147483647',
      'background:#333', 'color:#fff', 'padding:10px 18px', 'border-radius:6px',
      'font:14px/1.4 system-ui,sans-serif', 'box-shadow:0 4px 12px rgba(0,0,0,.3)',
      'transition:opacity .3s'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.style.opacity = '1';
  toast.textContent = msg;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}
