// THE FIT ONE — Homepage Bundle, Quiz, PhonePe QR / UPI / WhatsApp Order & Image Fallbacks

const BUNDLE_ITEMS = [
  {
    id: 'hoodie',
    name: 'Oversized Hoodie',
    price: 2499,
    image: 'assets/images/bundle-hoodie.jpg',
    fallback: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    selected: true
  },
  {
    id: 'shaker',
    name: 'Pro Shaker 700ml',
    price: 899,
    image: 'assets/images/bundle-shaker.jpg',
    fallback: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    selected: true
  },
  {
    id: 'plan',
    name: '3-Month Recomp Plan',
    price: 2999,
    image: 'assets/images/bundle-plan.jpg',
    fallback: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    selected: true
  }
];

function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function getBundleSummary() {
  const selected = BUNDLE_ITEMS.filter((i) => i.selected);
  const subtotal = selected.reduce((s, i) => s + i.price, 0);
  const discount = selected.length >= 2 ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;
  return { selected, subtotal, discount, total };
}

function renderBundle() {
  const wrap = document.getElementById('bundle-items');
  if (!wrap) return;
  wrap.innerHTML = '';

  BUNDLE_ITEMS.forEach((item) => {
    const card = document.createElement('div');
    card.className = `rounded-md p-4 border transition-all cursor-pointer ${
      item.selected ? 'bg-zinc-950 border-[#d4ff00]' : 'bg-zinc-950/50 border-zinc-800 opacity-60'
    }`;

    card.innerHTML = `
      <div class="aspect-square w-full rounded overflow-hidden bg-zinc-900 mb-3">
        <img src="${item.image}" data-fallback-src="${item.fallback}" alt="${item.name}" class="w-full h-full object-cover" />
      </div>
      <div class="flex items-center justify-between gap-2">
        <div>
          <h3 class="font-bold text-sm text-white">${item.name}</h3>
          <p class="text-xs text-zinc-400 mt-0.5">${formatINR(item.price)}</p>
        </div>
        <span class="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded ${
          item.selected ? 'bg-[#d4ff00] text-zinc-950' : 'bg-zinc-800 text-zinc-400'
        }">${item.selected ? 'Included' : 'Add'}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      item.selected = !item.selected;
      renderBundle();
      attachImageFallbacks();
    });

    wrap.appendChild(card);
  });

  const { selected, subtotal, discount, total } = getBundleSummary();
  const origEl = document.getElementById('bundle-original');
  const finalEl = document.getElementById('bundle-final');
  const savEl = document.getElementById('bundle-savings');
  const upiLink = document.getElementById('bundle-upi-link');

  if (origEl) origEl.textContent = formatINR(subtotal);
  if (finalEl) finalEl.textContent = formatINR(total);
  if (savEl) {
    savEl.textContent =
      selected.length >= 2
        ? `15% Bundle Discount Applied — Save ${formatINR(discount)}`
        : 'Select 2+ items to unlock 15% off';
  }
  if (upiLink && typeof TFO_CONFIG !== 'undefined') {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(TFO_CONFIG.upiId)}&pn=${encodeURIComponent(TFO_CONFIG.upiPayeeName)}&am=${total}&cu=INR`;
    upiLink.setAttribute('href', upiUrl);
  }
}

function initBundleOrder() {
  const btn = document.getElementById('bundle-whatsapp-btn');
  const qrBtn = document.getElementById('bundle-qr-toggle');
  const qrBox = document.getElementById('bundle-qr-box');
  const statusEl = document.getElementById('bundle-status');

  qrBtn?.addEventListener('click', () => {
    qrBox?.classList.toggle('hidden');
  });

  if (!btn) return;

  btn.addEventListener('click', () => {
    const { selected, total } = getBundleSummary();
    if (selected.length === 0) {
      if (statusEl) statusEl.textContent = 'Select at least 1 item to place an order.';
      return;
    }

    const lines = selected.map((i) => `- ${i.name} (${formatINR(i.price)})`).join('%0A');
    const upi = (typeof TFO_CONFIG !== 'undefined' && TFO_CONFIG.upiId) || 'm211911114@ybl';
    const msg = `Hi THE FIT ONE (@Thefitone_14), I want to order this bundle:%0A${lines}%0ATotal: ${encodeURIComponent(formatINR(total))}%0AUPI ID: ${encodeURIComponent(upi)}`;
    const num = (typeof TFO_CONFIG !== 'undefined' && TFO_CONFIG.whatsappNumber) || '918595961947';
    const url = `https://wa.me/${num}?text=${msg}`;

    if (statusEl) statusEl.textContent = `Opening WhatsApp order for ${formatINR(total)}...`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function initQuiz() {
  const sel = { goal: null, days: null, equipment: null };
  const groups = document.querySelectorAll('[data-quiz-group]');
  const showBtn = document.getElementById('show-program-btn');
  const resBox = document.getElementById('quiz-result');
  const titleEl = document.getElementById('result-title');
  const descEl = document.getElementById('result-desc');
  const linkEl = document.getElementById('result-link');
  const resetBtn = document.getElementById('reset-quiz-btn');

  groups.forEach((grp) => {
    const key = grp.getAttribute('data-quiz-group');
    grp.querySelectorAll('.quiz-option').forEach((b) => {
      b.addEventListener('click', () => {
        grp.querySelectorAll('.quiz-option').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        sel[key] = b.getAttribute('data-value');
        if (sel.goal && sel.days && sel.equipment) showBtn?.classList.remove('hidden');
      });
    });
  });

  showBtn?.addEventListener('click', () => {
    if (!titleEl || !descEl || !resBox) return;
    titleEl.textContent = `${sel.days} — ${sel.goal} Blueprint`;
    descEl.textContent = `Built for ${sel.equipment} with progressive overload, recovery targets, and structured nutrition for ${sel.goal.toLowerCase()}.`;
    if (linkEl && typeof TFO_CONFIG !== 'undefined' && TFO_CONFIG.guidePdf) {
      linkEl.setAttribute('href', TFO_CONFIG.guidePdf);
    }
    resBox.classList.remove('hidden');
  });

  resetBtn?.addEventListener('click', () => {
    sel.goal = null;
    sel.days = null;
    sel.equipment = null;
    document.querySelectorAll('.quiz-option').forEach((x) => x.classList.remove('active'));
    showBtn?.classList.add('hidden');
    resBox?.classList.add('hidden');
  });
}

function initNavAndFallbacks() {
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });

  document.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    img.addEventListener('error', function onErr() {
      const fb = this.getAttribute('data-fallback-src');
      if (fb && this.src !== fb) this.src = fb;
    }, { once: true });
  });

  document.querySelectorAll('[data-fallback-bg]').forEach((el) => {
    const match = (el.style.backgroundImage || '').match(/url\(['"]?(.*?)['"]?\)/);
    const localSrc = match ? match[1] : '';
    const fb = el.getAttribute('data-fallback-bg');
    if (localSrc && fb) {
      const testImg = new Image();
      testImg.src = localSrc;
      testImg.onerror = () => {
        el.style.backgroundImage = `url('${fb}')`;
      };
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBundle();
  initBundleOrder();
  initQuiz();
  initNavAndFallbacks();
});
