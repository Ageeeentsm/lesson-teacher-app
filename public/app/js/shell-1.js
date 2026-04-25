// ============================================================
// PREVIEW MODE: shows a banner at the top of the page where you paste
// your Anthropic key. Stored in browser localStorage only — never in code.
// On Vercel, /api/anthropic works server-side, so the banner stays hidden
// when the proxy responds successfully.
// ============================================================
(function(){
  // Detect preview (anything that's not your Vercel deployment).
  // Override with ?preview=1 or ?preview=0 if needed.
  var qs = new URLSearchParams(location.search);
  var forced = qs.get('preview');
  var isPreview = forced === '1' ? true
                : forced === '0' ? false
                : !/vercel\.app$/i.test(location.hostname) && location.hostname !== 'localhost'
                    ? true
                    : location.hostname.indexOf('lovable') !== -1;
  // Simpler: enable preview shim whenever a key is in localStorage,
  // OR when not on a vercel.app domain.
  var onVercel = /vercel\.app$/i.test(location.hostname);
  isPreview = !onVercel;

  function getKey(){ try { return localStorage.getItem('ANTHROPIC_API_KEY') || ''; } catch(e){ return ''; } }
  function setKey(v){ try { localStorage.setItem('ANTHROPIC_API_KEY', v||''); } catch(e){} }

  // Inject banner
  function mountBanner(){
    if (!isPreview) return;
    if (document.getElementById('lt-key-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'lt-key-bar';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#dc2626;color:#fff;font:13px/1.4 system-ui,sans-serif;padding:8px 12px;display:flex;gap:8px;align-items:center;border-bottom:2px solid #fbbf24;box-shadow:0 4px 12px rgba(0,0,0,.4);';
    bar.innerHTML =
      '<span style="font-weight:700;white-space:nowrap;">🔑 PREVIEW — paste Anthropic key:</span>' +
      '<input id="lt-key-input" type="password" placeholder="sk-ant-..." style="flex:1;min-width:0;background:#fff;border:1px solid #fbbf24;color:#000;padding:5px 8px;border-radius:4px;font:12px monospace;" />' +
      '<button id="lt-key-save" style="background:#fbbf24;color:#000;border:0;padding:5px 12px;border-radius:4px;cursor:pointer;font:12px system-ui;font-weight:700;">Save</button>' +
      '<button id="lt-key-clear" style="background:transparent;color:#fff;border:1px solid #fff;padding:5px 10px;border-radius:4px;cursor:pointer;font:12px system-ui;">Clear</button>' +
      '<button id="lt-key-hide" title="Hide bar" style="background:transparent;color:#fff;border:0;padding:0 4px;cursor:pointer;font:18px system-ui;">×</button>' +
      '<span id="lt-key-status" style="opacity:.95;white-space:nowrap;font-weight:600;"></span>';
    (document.body || document.documentElement).appendChild(bar);
    bar.querySelector('#lt-key-hide').onclick = function(){ bar.style.display='none'; document.body.style.paddingTop=''; };
    var input = bar.querySelector('#lt-key-input');
    var status = bar.querySelector('#lt-key-status');
    var existing = getKey();
    if (existing) { input.value = existing; status.textContent = '✓ saved'; }
    bar.querySelector('#lt-key-save').onclick = function(){
      setKey(input.value.trim()); status.textContent = '✓ saved'; setTimeout(function(){location.reload();}, 300);
    };
    bar.querySelector('#lt-key-clear').onclick = function(){
      setKey(''); input.value=''; status.textContent = 'cleared';
    };
    // Push body down so banner doesn't cover content
    setTimeout(function(){
      var h = bar.offsetHeight || 44;
      document.body.style.paddingTop = ((parseInt(getComputedStyle(document.body).paddingTop)||0) + h) + 'px';
    }, 50);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountBanner);
  else mountBanner();

  // Shim: in preview, intercept /api/anthropic and call Anthropic directly with the saved key.
  if (isPreview) {
    var _origFetch = window.fetch.bind(window);
    window.fetch = function(input, init){
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url === '/api/anthropic') {
          var key = getKey();
          if (!key) {
            return Promise.resolve(new Response(JSON.stringify({error:'Preview: paste your Anthropic key in the bar at the top of the page.'}), {status:401,headers:{'Content-Type':'application/json'}}));
          }
          return _origFetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: (init && init.body) || '{}'
          });
        }
      } catch(e) {}
      return _origFetch(input, init);
    };
  }
})();

// Early shims so onclick attrs work before main script loads
(function(){
  function _safeGoTo(id){
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var el = document.getElementById(id);
    if(el){ el.classList.add('active'); window.scrollTo(0,0); }
  }
  if(typeof goTo          === 'undefined') window.goTo          = _safeGoTo;
  if(typeof showClasses   === 'undefined') window.showClasses   = function(section, btn){
    document.querySelectorAll('.lvl-btn').forEach(function(b){ b.classList.remove('on'); });
    if(btn) btn.classList.add('on');
    var cr = document.getElementById('classRow');
    if(cr) cr.style.display = 'block';
  };
  if(typeof enterClassroom === 'undefined') window.enterClassroom = function(){
    setTimeout(function(){ if(typeof enterCL === 'function') enterCL(); }, 400);
  };
})();
