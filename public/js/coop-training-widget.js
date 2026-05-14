(function() {
    'use strict';

    // Find the script tag to read data attributes
    var script = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.indexOf('coop-training-widget.js') !== -1) {
                return scripts[i];
            }
        }
    })();

    if (!script) return;

    var token = script.getAttribute('data-token');
    if (!token) { console.error('coop-training-widget: data-token is required'); return; }

    var title = script.getAttribute('data-title') || '\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u062f\u0631\u064a\u0628 \u0627\u0644\u062a\u0639\u0627\u0648\u0646\u064a';
    var position = script.getAttribute('data-position') || 'bottom-left';
    var baseUrl = script.src.replace('/js/coop-training-widget.js', '');
    var embedUrl = baseUrl + '/embed/coop-training/' + token;

    var isOpen = false;

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
        '.coop-widget-btn{',
            'position:fixed;',
            position === 'bottom-right' ? 'right:20px;' : 'left:20px;',
            'bottom:20px;',
            'width:56px;height:56px;',
            'background:linear-gradient(135deg,#1B8354,#22A068);',
            'border:none;border-radius:50%;',
            'cursor:pointer;',
            'box-shadow:0 4px 16px rgba(27,131,84,0.4);',
            'z-index:999998;',
            'display:flex;align-items:center;justify-content:center;',
            'transition:transform 0.3s,box-shadow 0.3s;',
        '}',
        '.coop-widget-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(27,131,84,0.5);}',
        '.coop-widget-btn svg{width:28px;height:28px;fill:#fff;}',
        '.coop-widget-overlay{',
            'position:fixed;',
            position === 'bottom-right' ? 'right:20px;' : 'left:20px;',
            'bottom:88px;',
            'width:400px;height:600px;',
            'max-width:calc(100vw - 40px);',
            'max-height:calc(100vh - 108px);',
            'border:none;border-radius:16px;',
            'box-shadow:0 8px 40px rgba(0,0,0,0.2);',
            'z-index:999999;',
            'overflow:hidden;',
            'opacity:0;transform:translateY(20px) scale(0.95);',
            'transition:opacity 0.3s,transform 0.3s;',
            'pointer-events:none;',
        '}',
        '.coop-widget-overlay.open{',
            'opacity:1;transform:translateY(0) scale(1);pointer-events:auto;',
        '}',
        '.coop-widget-close{',
            'position:absolute;top:8px;',
            position === 'bottom-right' ? 'left:8px;' : 'right:8px;',
            'width:28px;height:28px;',
            'background:rgba(0,0,0,0.3);',
            'border:none;border-radius:50%;',
            'color:#fff;font-size:16px;',
            'cursor:pointer;z-index:1000000;',
            'display:flex;align-items:center;justify-content:center;',
            'transition:background 0.2s;',
        '}',
        '.coop-widget-close:hover{background:rgba(0,0,0,0.5);}',
        '@media(max-width:480px){',
            '.coop-widget-overlay{',
                'left:8px;right:8px;bottom:80px;',
                'width:auto;height:calc(100vh - 100px);',
                'max-width:none;border-radius:12px;',
            '}',
        '}',
    ].join('');
    document.head.appendChild(style);

    // Create button
    var btn = document.createElement('button');
    btn.className = 'coop-widget-btn';
    btn.setAttribute('aria-label', title);
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'coop-widget-overlay';
    overlay.innerHTML = '<button class="coop-widget-close" aria-label="Close">&times;</button>' +
        '<iframe src="' + embedUrl + '" style="width:100%;height:100%;border:none;" allow="clipboard-write"></iframe>';
    overlay.querySelector('.coop-widget-close').addEventListener('click', toggle);
    document.body.appendChild(overlay);

    function toggle() {
        isOpen = !isOpen;
        overlay.classList.toggle('open', isOpen);
        // Change button icon when open
        btn.innerHTML = isOpen
            ? '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    }
})();
