'use strict';

/* ── DAY / NIGHT THEME CLICK ─────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const savedTheme = localStorage.getItem('pixsyn-theme');

function setThemeLabel() {
  if (!themeText || !themeToggle) return;

  const isDark = document.body.classList.contains('dark-mode');
  themeText.textContent = isDark ? '☼' : '☾';
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to day mode' : 'Switch to night mode'
  );
}

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

setThemeLabel();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('pixsyn-theme', isDark ? 'dark' : 'light');
    setThemeLabel();
  });
}

/* ── MOBILE MENU ─────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL REVEAL ───────────────────────────────── */
const revealEls = document.querySelectorAll('.js-reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // stagger siblings in same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.js-reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
}

/* ── COUNTER ANIMATION ───────────────────────────── */
const counters = document.querySelectorAll('[data-count]');

if (counters.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = target === 100 ? '%' : '+';
      const dur    = 1500;
      const start  = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterIO.observe(el));
}

/* ── PARALLAX WATERMARK ──────────────────────────── */
const watermark = document.querySelector('.hero-watermark');
const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (watermark && !prefersRM) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    watermark.style.transform = `translate(-50%, calc(-50% + ${y * 0.25}px))`;
  }, { passive: true });
}

/* ── NAV SCROLL EFFECT ───────────────────────────── */
const navWrap = document.querySelector('.nav-wrap');
if (navWrap) {
  window.addEventListener('scroll', () => {
    navWrap.style.borderBottomColor = window.scrollY > 8
      ? 'var(--border-mid)'
      : 'var(--border)';
  }, { passive: true });
}

/* ── SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── TYPING CHAT DEMO ────────────────────────────── */
const typingMsg = document.getElementById('typingMsg');

if (typingMsg) {
  const RESPONSES = [
    'Pricing depends on the scope — we custom-quote after a free strategy call. Most website builds start from $2,500. Want to book a call?',
    'Great question! We tailor pricing to each project so you only pay for what you actually need. Book a free call and we\'ll give you a clear number.',
  ];
  let idx = 0;

  const triggerIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      setTimeout(() => {
        const msg = document.createElement('div');
        msg.className = 'chat-msg bot';
        msg.textContent = RESPONSES[idx % RESPONSES.length];
        idx++;

        typingMsg.style.display = 'none';
        typingMsg.after(msg);

        // scroll chat to bottom
        const chat = typingMsg.closest('.ai-chat');
        if (chat) chat.scrollTop = chat.scrollHeight;
      }, 2200);

      triggerIO.unobserve(entry.target);
    });
  }, { threshold: 0.7 });

  triggerIO.observe(typingMsg);
}

/* ── FOOTER YEAR ─────────────────────────────────── */
const fyear = document.getElementById('fyear');
if (fyear) fyear.textContent = new Date().getFullYear();

/* ── FORM SUBMIT ─────────────────────────────────── */
const form   = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    status.className = 'form-status';
    status.style.display = 'none';

    // ↓ Replace YOUR_FORM_ID with your Formspree form ID
  const ENDPOINT = 'https://pixsyn-backend-production.up.railway.app/api/contact-lead'

try {
  const data = {
    name: form.name.value,
    business: form.business.value,
    email: form.email.value,
    phone: form.phone.value,
    service: form.service.value,
    message: form.message.value,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });

      if (res.ok) {
        status.textContent = '✓ Inquiry received — we\'ll be in touch within one business day.';
        status.className = 'form-status success';
        status.style.display = 'block';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      status.textContent = 'Something went wrong. Email us directly at hello@pixsyn.com';
      status.className = 'form-status error';
      status.style.display = 'block';
    } finally {
      btn.textContent = 'Send Inquiry →';
      btn.disabled = false;
    }
  });
}
// ── PIXSYN AI CHATBOT ────────────────────────────────────────
// Paste this at the bottom of your main.js
// Requires pixsyn-backend running on localhost:3001

(function () {
  const ACCENT = '#000000';
  const BACKEND = 'https://pixsyn-backend-production.up.railway.app';

  // Conversation history sent to Claude
  let history = [];
  let sessionId = 'px-' + Date.now();
  let isOpen = false;
  let started = false;

  // ── Inject styles + HTML ──
  document.body.insertAdjacentHTML('beforeend', `
    <style>
      #px-bubble {
        position: fixed; bottom: 28px; right: 28px; z-index: 9000;
        width: 58px; height: 58px; border-radius: 50%;
        background: ${ACCENT}; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 28px rgba(0,83,156,0.38);
        transition: transform 220ms, box-shadow 220ms;
        border: none;
      }
      #px-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 36px rgba(0,83,156,0.5); }

      #px-dot {
        position: absolute; top: 4px; right: 4px;
        width: 13px; height: 13px; border-radius: 50%;
        background: #22c55e; border: 2.5px solid #fff;
        animation: pxPulse 2.2s ease-in-out infinite;
      }
      @keyframes pxPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

      #px-window {
        position: fixed; bottom: 100px; right: 28px; z-index: 9000;
        width: 348px; background: #fff; border-radius: 20px;
        box-shadow: 0 12px 56px rgba(0,0,0,0.16);
        display: none; flex-direction: column; overflow: hidden;
        font-family: 'Figtree', 'DM Sans', sans-serif;
        opacity: 0; transform: translateY(12px);
        transition: opacity 240ms ease, transform 240ms ease;
      }
      #px-window.open { opacity: 1; transform: translateY(0); }

      #px-head {
        background: ${ACCENT}; padding: 16px 18px;
        display: flex; align-items: center; gap: 12px;
      }
      #px-head-icon {
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.18);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      #px-head-name { color: #fff; font-weight: 700; font-size: 0.95rem; }
      #px-head-status {
        color: rgba(255,255,255,0.8); font-size: 0.75rem;
        display: flex; align-items: center; gap: 5px; margin-top: 2px;
      }
      #px-head-status::before {
        content: ''; width: 7px; height: 7px; border-radius: 50%;
        background: #22c55e; display: inline-block; flex-shrink: 0;
      }
      #px-close {
        margin-left: auto; background: none; border: none;
        color: rgba(255,255,255,0.7); font-size: 1.25rem;
        cursor: pointer; line-height: 1; padding: 0 2px;
      }
      #px-close:hover { color: #fff; }

      #px-msgs {
        padding: 16px; height: 300px; overflow-y: auto;
        display: flex; flex-direction: column; gap: 10px;
        background: #f8fafc; scroll-behavior: smooth;
      }
      #px-msgs::-webkit-scrollbar { width: 4px; }
      #px-msgs::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

      .px-msg-wrap { display: flex; gap: 8px; align-items: flex-end; }
      .px-msg-wrap.user { flex-direction: row-reverse; }

      .px-avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: ${ACCENT}; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
      }

      .px-bubble-msg {
        max-width: 230px; padding: 10px 14px; font-size: 0.875rem;
        line-height: 1.55; border-radius: 18px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      }
      .px-bubble-msg.bot {
        background: #fff; color: #1a1a2e;
        border-radius: 18px 18px 18px 4px;
        border: 1px solid #e5e7eb;
      }
      .px-bubble-msg.user {
        background: ${ACCENT}; color: #fff;
        border-radius: 18px 18px 4px 18px;
      }
      .px-bubble-msg.bot.streaming { border-color: ${ACCENT}; }

      .px-typing { display: flex; gap: 5px; padding: 12px 16px; }
      .px-typing span {
        width: 7px; height: 7px; border-radius: 50%; background: #9ca3af;
        animation: pxBounce 1.2s ease-in-out infinite;
      }
      .px-typing span:nth-child(2) { animation-delay: 0.18s; }
      .px-typing span:nth-child(3) { animation-delay: 0.36s; }
      @keyframes pxBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-6px);opacity:1} }

      #px-footer {
        padding: 12px 14px; background: #fff;
        border-top: 1px solid #e5e7eb;
        display: flex; gap: 8px; align-items: center;
      }
      #px-input {
        flex: 1; border: 1px solid #e5e7eb; border-radius: 100px;
        padding: 10px 15px; font-size: 0.9rem; outline: none;
        font-family: inherit; transition: border-color 180ms; cursor: text;
      }
      #px-input:focus { border-color: ${ACCENT}; }
      #px-input:disabled { background: #f8fafc; }
      #px-send {
        width: 38px; height: 38px; border-radius: 50%;
        background: ${ACCENT}; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: background 180ms;
      }
      #px-send:hover { background: #003d75; }
      #px-send:disabled { background: #9ca3af; cursor: not-allowed; }

      #px-offline {
        display: none; padding: 8px 14px;
        background: #fef3c7; border-top: 1px solid #fde68a;
        font-size: 0.78rem; color: #92400e; text-align: center;
      }

      @media (max-width: 420px) {
        #px-window { width: calc(100vw - 24px); right: 12px; bottom: 88px; }
        #px-bubble { right: 16px; bottom: 16px; }
      }
    </style>

    <button id="px-bubble" aria-label="Open chat">
      <svg width="24" height="24" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span id="px-dot"></span>
    </button>

    <div id="px-window" role="dialog" aria-label="Pixsyn chat">
      <div id="px-head">
        <div id="px-head-icon">
          <svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <div id="px-head-name">Pixsyn AI</div>
          <div id="px-head-status">Online — powered by AI</div>
        </div>
        <button id="px-close" aria-label="Close chat">&#10005;</button>
      </div>
      <div id="px-msgs"></div>
      <div id="px-offline">⚠️ AI offline — <a href="#contact" style="color:#92400e;font-weight:600;">use the contact form</a></div>
      <div id="px-footer">
        <input id="px-input" type="text" placeholder="Ask me anything..." autocomplete="off"/>
        <button id="px-send" aria-label="Send">
          <svg width="15" height="15" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `);

  const win    = document.getElementById('px-window');
  const msgs   = document.getElementById('px-msgs');
  const input  = document.getElementById('px-input');
  const bubble = document.getElementById('px-bubble');
  const sendBtn = document.getElementById('px-send');
  const offline = document.getElementById('px-offline');

  function scrollBottom() {
    setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
  }

  function addMsg(text, who = 'bot') {
    const wrap = document.createElement('div');
    wrap.className = `px-msg-wrap ${who}`;
    if (who === 'bot') {
      wrap.innerHTML = `
        <div class="px-avatar">
          <svg width="14" height="14" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="px-bubble-msg bot">${text}</div>`;
    } else {
      wrap.innerHTML = `<div class="px-bubble-msg user">${text}</div>`;
    }
    msgs.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'px-msg-wrap bot';
    t.id = 'px-typing-ind';
    t.innerHTML = `
      <div class="px-avatar">
        <svg width="14" height="14" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="px-bubble-msg bot px-typing">
        <span></span><span></span><span></span>
      </div>`;
    msgs.appendChild(t);
    scrollBottom();
  }

  function removeTyping() {
    const t = document.getElementById('px-typing-ind');
    if (t) t.remove();
  }

  function setLoading(loading) {
    input.disabled = loading;
    sendBtn.disabled = loading;
    if (!loading) input.focus();
  }

  // ── Send message to Claude via backend ──
  async function sendToAI(userText) {
    // Add to history
    history.push({ role: 'user', content: userText });

    setLoading(true);
    showTyping();

    try {
      const response = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, sessionId })
      });

      if (!response.ok) throw new Error('Server error');

      removeTyping();

      // Create streaming message bubble
      const wrap = document.createElement('div');
      wrap.className = 'px-msg-wrap bot';
      const avatar = document.createElement('div');
      avatar.className = 'px-avatar';
      avatar.innerHTML = '<svg width="14" height="14" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      const streamEl = document.createElement('div');
      streamEl.className = 'px-bubble-msg bot streaming';
      wrap.appendChild(avatar);
      wrap.appendChild(streamEl);
      msgs.appendChild(wrap);
      scrollBottom();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                const display = fullText.replace(/\[LEAD_CAPTURED:[^\]]*\]/g, '').trim();
                streamEl.textContent = display;
                scrollBottom();
              }
            } catch (e) {}
          }
        }
      }

      streamEl.classList.remove('streaming');

      // Add assistant response to history (clean version)
      const cleanText = fullText.replace(/\[LEAD_CAPTURED:[^\]]*\]/g, '').trim();
      history.push({ role: 'assistant', content: cleanText });

      offline.style.display = 'none';

    } catch (err) {
      removeTyping();
      // Show offline message and fallback
      offline.style.display = 'block';
      addMsg("I'm having trouble connecting right now. Please use the contact form below or call us directly — we'd love to chat!");
      console.log('Pixsyn chatbot: backend offline');
    }

    setLoading(false);
  }

  // ── Start conversation ──
  async function startConversation() {
    if (started) return;
    started = true;

    // Show typing then greet
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg("Hi! 👋 I'm the Pixsyn AI. I can answer any questions about our services, pricing, or how we can help your business. What's on your mind?");
    }, 800);
  }

  // ── Handle user input ──
  async function handleSend() {
    const text = input.value.trim();
    if (!text || input.disabled) return;
    input.value = '';
    addMsg(text, 'user');
    await sendToAI(text);
  }

  // ── Open / close ──
  function openChat() {
    win.style.display = 'flex';
    setTimeout(() => win.classList.add('open'), 10);
    isOpen = true;
    if (!started) setTimeout(startConversation, 300);
    setTimeout(() => input.focus(), 300);
  }

  function closeChat() {
    win.classList.remove('open');
    setTimeout(() => { win.style.display = 'none'; }, 250);
    isOpen = false;
  }

  bubble.addEventListener('click', () => isOpen ? closeChat() : openChat());
  document.getElementById('px-close').addEventListener('click', closeChat);
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });

  // Auto open after 15 seconds
  setTimeout(() => { if (!isOpen) openChat(); }, 15000);

})();
