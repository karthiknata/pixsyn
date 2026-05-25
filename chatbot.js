  /* ═══════ PIXSYN CHATBOT ═══════ */
  (function initPixsynChat() {

    const BUSINESS = 'Pixsyn';
    const SERVICES = [
      'Website Design & Build',
      'Local SEO & Google Ranking',
      'AI Receptionist Setup',
    ];
    const CHALLENGES = [
      'My website is outdated or not converting',
      'I\'m not showing up on Google',
      'I\'m missing calls and losing leads after hours',
      'I need a full digital overhaul',
      'Something else',
    ];
  
    const trigger   = document.getElementById('chatTrigger');
    const bubble    = document.getElementById('chatBubble');
    const messages  = document.getElementById('chatMessages');
    const inputWrap = document.getElementById('chatInputWrap');
    const input     = document.getElementById('chatInput');
    const sendBtn   = document.getElementById('chatSend');

    if (!trigger) return;

    let isOpen = false, started = false;
    const lead = {};

    window.toggleChat = function() {
      isOpen = !isOpen;
      trigger.classList.toggle('open', isOpen);
      bubble.classList.toggle('open', isOpen);
      if (isOpen && !started) { started = true; setTimeout(q0, 500); }
    };

    function botMsg(text) {
      const el = document.createElement('div');
      el.className = 'pchat-msg bot';
      el.textContent = text;
      messages.appendChild(el);
      scroll();
    }
    function userMsg(text) {
      const el = document.createElement('div');
      el.className = 'pchat-msg user';
      el.textContent = text;
      messages.appendChild(el);
      scroll();
    }
    function showOptions(opts, cb) {
      const wrap = document.createElement('div');
      wrap.className = 'pchat-options';
      opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'pchat-option';
        btn.textContent = o;
        btn.addEventListener('click', () => { wrap.remove(); userMsg(o); cb(o); });
        wrap.appendChild(btn);
      });
      messages.appendChild(wrap);
      scroll();
    }
    function typing(cb, ms) {
      ms = ms || 850;
      const t = document.createElement('div');
      t.className = 'pchat-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(t);
      scroll();
      setTimeout(() => { t.remove(); cb(); }, ms);
    }
    function freeInput(placeholder, cb) {
      inputWrap.style.display = 'flex';
      input.placeholder = placeholder;
      input.value = '';
      setTimeout(() => input.focus(), 100);
      const go = () => {
        const v = input.value.trim();
        if (!v) return;
        inputWrap.style.display = 'none';
        userMsg(v);
        cb(v);
      };
      sendBtn.onclick = go;
      input.onkeydown = e => { if (e.key === 'Enter') go(); };
    }
    function scroll() { messages.scrollTop = messages.scrollHeight; }

    function q0() {
      typing(() => {
        botMsg('Hey! 👋 Welcome to ' + BUSINESS + '. What\'s your name?');
        freeInput('Your first name...', v => { lead.name = v; q1(); });
      }, 700);
    }
    function q1() {
      typing(() => {
        botMsg('Hi ' + lead.name + '! What are you looking to get help with?');
        showOptions(SERVICES, v => { lead.service = v; q2(); });
      });
    }
    function q2() {
      typing(() => {
        botMsg('What best describes your situation right now?');
        showOptions(CHALLENGES, v => { lead.challenge = v; q3(); });
      });
    }
    function q3() {
      typing(() => {
        botMsg('How soon are you looking to get started?');
        showOptions(['ASAP', 'Within the next month', 'Just exploring for now'], v => {
          lead.timeline = v;
          q4();
        });
      });
    }
    function q4() {
      typing(() => {
        botMsg('What\'s the best email to send a free audit and proposal to?');
        freeInput('your@email.com', v => { lead.email = v; done(); });
      });
    }
    function done() {
      typing(() => {
        inputWrap.style.display = 'none';

        // ── Send lead to Formspree (replace YOUR_FORM_ID) ──
        fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });

        const el = document.createElement('div');
        el.className = 'pchat-done';
        el.innerHTML =
          '<strong>You\'re all set, ' + lead.name + '! ✅</strong>' +
          'We\'ll send a free audit to <em>' + lead.email + '</em> within 24 hours.<br><br>' +
          'Or call us directly: <strong>(YOUR NUMBER)</strong>';
        messages.appendChild(el);
        scroll();
      }, 800);
    }

  })();

  ---
