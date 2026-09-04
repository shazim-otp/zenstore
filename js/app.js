/* ==========================================================================
   Zen Store - Main Customer Storefront App Controller
   Header, Live Search Autocomplete, Featured Grids, Mobile Bottom Bar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Auth & Cart Badges
  Auth.updateNavbarUI();
  Cart.updateCartBadge();

  // Initialize Search Autocomplete
  initSearchAutocomplete();

  // Highlight Active Nav Links
  highlightActiveNav();
});

// Search Autocomplete Logic
function initSearchAutocomplete() {
  const searchInput = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');

  if (!searchInput || !dropdown) return;

  const performSearch = Utils.debounce((query) => {
    if (!query || query.trim().length < 2) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      return;
    }

    const q = query.trim().toLowerCase();
    const products = ZenDB.getProducts().filter(p => 
      p.status === 'Active' && (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      )
    );

    if (products.length === 0) {
      dropdown.innerHTML = `<div class="search-result-item" style="color:var(--text-muted); font-size:0.9rem;">No matching products found</div>`;
    } else {
      dropdown.innerHTML = products.slice(0, 5).map(p => `
        <a href="/product.html?id=${p.id}" class="search-result-item">
          <img src="${p.mainImage}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <div class="search-result-title">${p.name}</div>
            <div class="search-result-price">${Utils.formatINR(p.sellingPrice)} <span style="text-decoration:line-through; color:var(--text-light); font-size:0.75rem;">${Utils.formatINR(p.mrp)}</span></div>
          </div>
        </a>
      `).join('');
    }

    dropdown.classList.add('active');
  }, 250);

  searchInput.addEventListener('input', (e) => performSearch(e.target.value));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      window.location.href = `/shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

// Highlight Navigation Bar Links
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  
  // Mobile Nav Icons
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath === href || (href !== '/index.html' && currentPath.includes(href)))) {
      item.classList.add('active');
    }
  });

  // Desktop Subbar Links
  const subbarLinks = document.querySelectorAll('.subbar-link');
  subbarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || (href !== '/index.html' && currentPath.includes(href)))) {
      link.classList.add('active');
    }
  });
}

// Render Product Card HTML Template Helper
function renderProductCard(p) {
  const discountPercent = Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100);
  
  return `
    <div class="product-card">
      ${discountPercent > 0 ? `<div class="product-badge-discount">${discountPercent}% OFF</div>` : ''}
      <a href="/product.html?id=${p.id}" class="product-img-wrapper">
        <img src="${p.mainImage}" alt="${p.name}" class="product-img" loading="lazy">
      </a>
      <div class="product-info">
        <div class="product-category-brand">${p.brand || 'Zen Store'}</div>
        <a href="/product.html?id=${p.id}" class="product-title-link" title="${p.name}">${p.name}</a>
        <div class="product-rating">
          ★ <span>${p.rating || 4.5}</span>
          <span class="product-rating-count">(${p.reviewsCount || 12})</span>
        </div>
        <div class="product-pricing-row">
          <span class="price-selling">${Utils.formatINR(p.sellingPrice)}</span>
          <span class="price-mrp">${Utils.formatINR(p.mrp)}</span>
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary btn-add-cart" onclick="Cart.addItem('${p.id}')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}
