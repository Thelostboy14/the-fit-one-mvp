// THE FIT ONE — Shop Catalog, Filters, Cart & PhonePe QR / UPI / COD / WhatsApp Checkout

const SHOP_PRODUCTS = [
  {
    id: 'tfo-hoodie-01',
    title: 'Obsidian Heavyweight Oversized Hoodie',
    category: 'Apparel',
    price: 2499,
    tag: 'Bestseller',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/images/bundle-hoodie.jpg',
    fallback: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tfo-tee-02',
    title: 'Court & Gym Drop-Shoulder Tee',
    category: 'Apparel',
    price: 1299,
    tag: 'New Drop',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/images/cat-apparel.jpg',
    fallback: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tfo-shaker-03',
    title: 'Pro Shaker 700ml Matte Black',
    category: 'Equipment',
    price: 899,
    tag: 'Essential',
    sizes: ['700ml'],
    image: 'assets/images/bundle-shaker.jpg',
    fallback: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tfo-wraps-04',
    title: 'Heavy Grip Lifting Straps',
    category: 'Equipment',
    price: 799,
    tag: 'Gym Gear',
    sizes: ['Free Size'],
    image: 'assets/images/cat-equipment.jpg',
    fallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tfo-split-05',
    title: '5-Day Hybrid Split Guide',
    category: 'Workout Splits',
    price: 1499,
    tag: 'Instant PDF',
    sizes: ['Digital'],
    image: 'assets/images/cat-splits.jpg',
    fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tfo-recomp-06',
    title: '3-Month Body Recomposition Blueprint',
    category: 'Recomp Plans',
    price: 2999,
    tag: 'Most Popular',
    sizes: ['Digital'],
    image: 'assets/images/bundle-plan.jpg',
    fallback: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  }
];

let activeCategory = 'All';
let searchText = '';
let sortBy = 'featured';
let payMethod = 'UPI';
const chosenSize = {};
let cart = [];

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function renderCatalog() {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  let list = SHOP_PRODUCTS.filter((p) => {
    const catOk = activeCategory === 'All' || p.category === activeCategory;
    const q = searchText.trim().toLowerCase();
    const qOk = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);

  grid.innerHTML = '';
  if (list.length === 0) {
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  list.forEach((p) => {
    if (!chosenSize[p.id]) chosenSize[p.id] = p.sizes[0];
    const activeSz = chosenSize[p.id];

    const sizeHtml = p.sizes
      .map(
        (sz) => `
        <button type="button" data-pid="${p.id}" data-sz="${sz}" class="sz-btn px-2.5 py-1 text-[11px] font-bold rounded border ${
          sz === activeSz ? 'bg-[#d4ff00] text-zinc-950 border-[#d4ff00]' : 'bg-zinc-950 text-zinc-300 border-zinc-700'
        }">${sz}</button>`
      )
      .join('');

    const card = document.createElement('article');
    card.className = 'bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="relative aspect-square bg-zinc-950 overflow-hidden">
          <img src="${p.image}" data-fallback-src="${p.fallback}" alt="${p.title}" class="w-full h-full object-cover opacity-85" />
          <span class="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-700 text-[#d4ff00] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">${p.tag}</span>
        </div>
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
            <span>${p.category}</span>
            <span class="text-white font-bold text-sm">${formatINR(p.price)}</span>
          </div>
          <h2 class="font-bold text-base text-white">${p.title}</h2>
          <div class="flex flex-wrap gap-1.5">${sizeHtml}</div>
        </div>
      </div>
      <div class="px-5 pb-5">
        <button type="button" data-add="${p.id}" class="add-btn w-full bg-[#d4ff00] text-zinc-950 font-extrabold text-xs uppercase tracking-wider py-3 rounded-sm hover:bg-[#c2eb00]">
          Add to Cart &gt;
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.sz-btn').forEach((b) => {
    b.addEventListener('click', () => {
      chosenSize[b.getAttribute('data-pid')] = b.getAttribute('data-sz');
      renderCatalog();
    });
  });

  document.querySelectorAll('.add-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const prod = SHOP_PRODUCTS.find((x) => x.id === b.getAttribute('data-add'));
      if (!prod) return;
      const sz = chosenSize[prod.id] || prod.sizes[0];
      const existing = cart.find((c) => c.id === prod.id && c.size === sz);
      if (existing) existing.qty += 1;
      else cart.push({ id: prod.id, title: prod.title, price: prod.price, size: sz, qty: 1 });
      syncCart();
      document.getElementById('cart-drawer')?.classList.remove('hidden');
    });
  });

  document.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    img.addEventListener('error', function onErr() {
      const fb = this.getAttribute('data-fallback-src');
      if (fb && this.src !== fb) this.src = fb;
    }, { once: true });
  });
}

function syncCart() {
  const badge = document.getElementById('cart-badge');
  const listEl = document.getElementById('cart-items');
  const subEl = document.getElementById('cart-subtotal');
  const shipEl = document.getElementById('shipping-note');
  const payBtn = document.getElementById('payment-link-btn');
  const upiIdEl = document.getElementById('display-upi-id');
  const upiIntentEl = document.getElementById('upi-intent-link');

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (badge) badge.textContent = String(count);
  if (subEl) subEl.textContent = formatINR(subtotal);
  if (shipEl) {
    shipEl.textContent =
      subtotal >= 999
        ? 'Unlocked: Free Delivery on your order!'
        : `Add ${formatINR(Math.max(0, 999 - subtotal))} more for Free Delivery (₹999+).`;
  }

  if (typeof TFO_CONFIG !== 'undefined') {
    if (upiIdEl) upiIdEl.textContent = TFO_CONFIG.upiId;
    if (payBtn) payBtn.setAttribute('href', TFO_CONFIG.paymentLink);
    if (upiIntentEl) {
      upiIntentEl.setAttribute(
        'href',
        `upi://pay?pa=${encodeURIComponent(TFO_CONFIG.upiId)}&pn=${encodeURIComponent(TFO_CONFIG.upiPayeeName)}&am=${subtotal}&cu=INR`
      );
    }
  }

  if (!listEl) return;
  if (cart.length === 0) {
    listEl.innerHTML = '<p class="text-sm text-zinc-400 py-6 text-center">Your cart is empty.</p>';
    return;
  }

  listEl.innerHTML = cart
    .map(
      (item, idx) => `
      <div class="bg-zinc-900 border border-zinc-800 rounded p-3.5 flex items-center justify-between gap-3">
        <div>
          <h3 class="text-xs font-bold text-white">${item.title}</h3>
          <p class="text-[11px] text-zinc-400 mt-0.5">${item.size} &bull; ${formatINR(item.price)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" data-dec="${idx}" class="w-6 h-6 bg-zinc-800 text-white text-xs font-bold rounded">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
          <button type="button" data-inc="${idx}" class="w-6 h-6 bg-zinc-800 text-white text-xs font-bold rounded">+</button>
        </div>
      </div>`
    )
    .join('');

  listEl.querySelectorAll('[data-inc]').forEach((b) => {
    b.addEventListener('click', () => {
      cart[Number(b.getAttribute('data-inc'))].qty += 1;
      syncCart();
    });
  });

  listEl.querySelectorAll('[data-dec]').forEach((b) => {
    b.addEventListener('click', () => {
      const i = Number(b.getAttribute('data-dec'));
      cart[i].qty -= 1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      syncCart();
    });
  });
}

function initPayMethods() {
  const buttons = document.querySelectorAll('.pay-method-btn');
  const upiBox = document.getElementById('upi-box');
  const codBox = document.getElementById('cod-box');
  const onlineBox = document.getElementById('online-box');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      payMethod = btn.getAttribute('data-pay-method') || 'UPI';
      buttons.forEach((b) => {
        b.classList.remove('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950');
        b.classList.add('border-zinc-700', 'bg-zinc-950', 'text-zinc-300');
      });
      btn.classList.remove('border-zinc-700', 'bg-zinc-950', 'text-zinc-300');
      btn.classList.add('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950');

      upiBox?.classList.toggle('hidden', payMethod !== 'UPI');
      codBox?.classList.toggle('hidden', payMethod !== 'COD');
      onlineBox?.classList.toggle('hidden', payMethod !== 'ONLINE');
    });
  });
}

function initShopControls() {
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get('cat');
  if (initialCat) activeCategory = initialCat;

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    const cat = btn.getAttribute('data-category');
    if (cat === activeCategory) {
      document.querySelectorAll('.filter-btn').forEach((x) => {
        x.classList.remove('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950', 'font-extrabold');
        x.classList.add('border-zinc-700', 'bg-zinc-900', 'text-zinc-300', 'font-bold');
      });
      btn.classList.remove('border-zinc-700', 'bg-zinc-900', 'text-zinc-300', 'font-bold');
      btn.classList.add('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950', 'font-extrabold');
    }

    btn.addEventListener('click', () => {
      activeCategory = cat || 'All';
      document.querySelectorAll('.filter-btn').forEach((x) => {
        x.classList.remove('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950', 'font-extrabold');
        x.classList.add('border-zinc-700', 'bg-zinc-900', 'text-zinc-300', 'font-bold');
      });
      btn.classList.remove('border-zinc-700', 'bg-zinc-900', 'text-zinc-300', 'font-bold');
      btn.classList.add('active', 'border-[#d4ff00]', 'bg-[#d4ff00]', 'text-zinc-950', 'font-extrabold');
      renderCatalog();
    });
  });

  document.getElementById('shop-search')?.addEventListener('input', (e) => {
    searchText = e.target.value || '';
    renderCatalog();
  });

  document.getElementById('shop-sort')?.addEventListener('change', (e) => {
    sortBy = e.target.value || 'featured';
    renderCatalog();
  });

  document.getElementById('open-cart-btn')?.addEventListener('click', () => {
    document.getElementById('cart-drawer')?.classList.remove('hidden');
  });
  document.getElementById('close-cart-btn')?.addEventListener('click', () => {
    document.getElementById('cart-drawer')?.classList.add('hidden');
  });
  document.getElementById('cart-backdrop')?.addEventListener('click', () => {
    document.getElementById('cart-drawer')?.classList.add('hidden');
  });
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });

  document.getElementById('whatsapp-checkout-btn')?.addEventListener('click', () => {
    const fb = document.getElementById('checkout-feedback');
    if (cart.length === 0) {
      if (fb) fb.textContent = 'Add items to cart first.';
      return;
    }
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const lines = cart.map((i) => `- ${i.title} (${i.size}) x${i.qty} = ${formatINR(i.price * i.qty)}`).join('%0A');
    const upi = (typeof TFO_CONFIG !== 'undefined' && TFO_CONFIG.upiId) || 'm211911114@ybl';
    const msg = `Hi THE FIT ONE (@Thefitone_14), order request via ${payMethod}:%0A${lines}%0ASubtotal: ${encodeURIComponent(formatINR(subtotal))}%0AUPI: ${encodeURIComponent(upi)}`;
    const num = (typeof TFO_CONFIG !== 'undefined' && TFO_CONFIG.whatsappNumber) || '918595961947';
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  syncCart();
  initPayMethods();
  initShopControls();
});
