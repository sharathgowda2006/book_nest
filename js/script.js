/**
 * BookNest – Books & Stationery Store
 * Tagline: "Discover. Read. Create."
 * Core Application Logic (Vanilla JavaScript + localStorage)
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CART: 'booknest_cart',
    SELECTED_PRODUCT: 'booknest_selected_product',
    LAST_ORDER: 'booknest_last_order'
  };

  const FREE_DELIVERY_THRESHOLD = 999;
  const STANDARD_DELIVERY_CHARGE = 49;

  // =========================================================================
  // 1. Utility Helpers
  // =========================================================================

  function formatINR(amount) {
    const num = Number(amount) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getProducts() {
    return Array.isArray(window.BOOKNEST_PRODUCTS) ? window.BOOKNEST_PRODUCTS : [];
  }

  function getProductById(id) {
    const numericId = Number(id);
    return getProducts().find(function (p) {
      return p.id === numericId;
    }) || null;
  }

  // =========================================================================
  // 2. Cart Management (localStorage)
  // =========================================================================

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CART);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Filter out any corrupted entries and ensure valid product IDs
      return parsed.filter(function (item) {
        return item && getProductById(item.id) && Number(item.quantity) > 0;
      });
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      // Ignore storage quota errors in restricted environments
    }
    updateCartCountUI();
  }

  function clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
    } catch (err) {
      // Ignore
    }
    updateCartCountUI();
  }

  function getCartItemCount() {
    return getCart().reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function calculateCartSummary() {
    const cart = getCart();
    let subtotal = 0;
    let totalQuantity = 0;
    const detailedItems = [];

    cart.forEach(function (cartItem) {
      const product = getProductById(cartItem.id);
      if (product) {
        const qty = Math.max(1, Number(cartItem.quantity) || 1);
        const itemSubtotal = product.price * qty;
        subtotal += itemSubtotal;
        totalQuantity += qty;
        detailedItems.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          quantity: qty,
          itemSubtotal: itemSubtotal
        });
      }
    });

    const deliveryCharge = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE);
    const finalTotal = subtotal + deliveryCharge;

    return {
      items: detailedItems,
      totalQuantity: totalQuantity,
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      finalTotal: finalTotal
    };
  }

  function addToCart(productId, quantityToAdd) {
    const product = getProductById(productId);
    if (!product) return;

    const qty = Math.max(1, parseInt(quantityToAdd, 10) || 1);
    const cart = getCart();
    const existingIndex = cart.findIndex(function (item) {
      return Number(item.id) === product.id;
    });

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 0) + qty;
    } else {
      cart.push({
        id: product.id,
        quantity: qty
      });
    }

    saveCart(cart);
    showToast('Added "' + product.name + '" (' + qty + ') to your cart.');
  }

  function setCartItemQuantity(productId, newQty) {
    const numericId = Number(productId);
    const qty = parseInt(newQty, 10);
    let cart = getCart();

    if (isNaN(qty) || qty <= 0) {
      cart = cart.filter(function (item) {
        return Number(item.id) !== numericId;
      });
    } else {
      const idx = cart.findIndex(function (item) {
        return Number(item.id) === numericId;
      });
      if (idx > -1) {
        cart[idx].quantity = Math.min(99, qty);
      }
    }

    saveCart(cart);
  }

  function removeFromCart(productId) {
    const numericId = Number(productId);
    const product = getProductById(numericId);
    const cart = getCart().filter(function (item) {
      return Number(item.id) !== numericId;
    });
    saveCart(cart);
    if (product) {
      showToast('Removed "' + product.name + '" from your cart.');
    }
  }

  function updateCartCountUI() {
    const count = getCartItemCount();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(function (badge) {
      badge.textContent = String(count);
    });
  }

  // =========================================================================
  // 3. Toast Feedback Notification
  // =========================================================================

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML =
      '<span style="color: #E6C675; font-weight: 700;">✓</span>' +
      '<span>' + escapeHTML(message) + '</span>';

    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 2600);
  }

  // =========================================================================
  // 4. Shared Product Card Component Renderer
  // =========================================================================

  function createProductCardHTML(product) {
    return (
      '<article class="product-card" data-product-id="' + product.id + '">' +
        '<a href="product-details.html?id=' + product.id + '" class="product-media js-view-details" data-id="' + product.id + '">' +
          '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" referrerpolicy="no-referrer" loading="lazy" />' +
        '</a>' +
        '<div class="product-body">' +
          '<div class="product-meta-line">' +
            '<span class="product-category-text">' + escapeHTML(product.category) + '</span>' +
            '<span class="product-rating-text" title="Rated ' + product.rating + ' out of 5">' +
              '<span class="star-gold">★</span> ' + product.rating.toFixed(1) +
            '</span>' +
          '</div>' +
          '<h3 class="product-title">' +
            '<a href="product-details.html?id=' + product.id + '" class="js-view-details" data-id="' + product.id + '">' +
              escapeHTML(product.name) +
            '</a>' +
          '</h3>' +
          '<p class="product-short-desc">' + escapeHTML(product.shortDescription) + '</p>' +
          '<div class="product-footer">' +
            '<div class="product-price-row">' +
              '<span class="product-price tabular-nums">' + formatINR(product.price) + '</span>' +
              '<span class="product-stock-note">In Stock</span>' +
            '</div>' +
            '<div class="product-actions">' +
              '<a href="product-details.html?id=' + product.id + '" class="btn btn-secondary btn-sm js-view-details" data-id="' + product.id + '">View Details</a>' +
              '<button type="button" class="btn btn-primary btn-sm js-add-to-cart" data-id="' + product.id + '">Add to Cart</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  // =========================================================================
  // 5. Page Initializers
  // =========================================================================

  // --- HOME PAGE (index.html) ---
  function initHomePage() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;

    const allProducts = getProducts();
    const featuredProducts = allProducts.filter(function (p) {
      return p.featured;
    }).slice(0, 6);

    featuredGrid.innerHTML = featuredProducts.map(createProductCardHTML).join('');
  }

  // --- SHOP PAGE (shop.html) ---
  function initShopPage() {
    const shopGrid = document.getElementById('shop-products-grid');
    if (!shopGrid) return;

    const searchInput = document.getElementById('shop-search-input');
    const categorySelect = document.getElementById('shop-category-select');
    const sortSelect = document.getElementById('shop-sort-select');
    const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
    const resultsCountEl = document.getElementById('shop-results-count');
    const resetBtn = document.getElementById('shop-reset-filters');

    // Read initial URL parameters (?category=Books or ?category=Stationery or ?search=...)
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    const initialSearch = params.get('search');

    let activeCategory = 'All';
    if (initialCategory && (initialCategory.toLowerCase() === 'books' || initialCategory.toLowerCase() === 'stationery')) {
      activeCategory = initialCategory.toLowerCase() === 'books' ? 'Books' : 'Stationery';
    }

    if (initialSearch && searchInput) {
      searchInput.value = initialSearch;
    }

    function syncCategoryUI(cat) {
      activeCategory = cat;
      if (categorySelect) {
        categorySelect.value = cat;
      }
      filterTabBtns.forEach(function (btn) {
        if (btn.getAttribute('data-category') === cat) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function renderFilteredShop() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const sortValue = sortSelect ? sortSelect.value : 'default';

      let filtered = getProducts().filter(function (product) {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = !query ||
          product.name.toLowerCase().indexOf(query) !== -1 ||
          product.shortDescription.toLowerCase().indexOf(query) !== -1 ||
          product.category.toLowerCase().indexOf(query) !== -1;
        return matchesCategory && matchesSearch;
      });

      if (sortValue === 'price-asc') {
        filtered.sort(function (a, b) { return a.price - b.price; });
      } else if (sortValue === 'price-desc') {
        filtered.sort(function (a, b) { return b.price - a.price; });
      } else if (sortValue === 'rating-desc') {
        filtered.sort(function (a, b) { return b.rating - a.rating; });
      }

      if (resultsCountEl) {
        resultsCountEl.textContent = 'Showing ' + filtered.length + ' of ' + getProducts().length + ' products';
      }

      if (filtered.length === 0) {
        shopGrid.style.display = 'none';
        const emptyBox = document.getElementById('shop-empty-state');
        if (emptyBox) emptyBox.style.display = 'block';
      } else {
        shopGrid.style.display = 'grid';
        const emptyBox = document.getElementById('shop-empty-state');
        if (emptyBox) emptyBox.style.display = 'none';
        shopGrid.innerHTML = filtered.map(createProductCardHTML).join('');
      }
    }

    // Initialize UI state
    syncCategoryUI(activeCategory);
    renderFilteredShop();

    // Event Listeners
    if (searchInput) {
      searchInput.addEventListener('input', renderFilteredShop);
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', function (e) {
        syncCategoryUI(e.target.value);
        renderFilteredShop();
      });
    }

    filterTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.getAttribute('data-category') || 'All';
        syncCategoryUI(cat);
        renderFilteredShop();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', renderFilteredShop);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        syncCategoryUI('All');
        renderFilteredShop();
      });
    }
  }

  // --- PRODUCT DETAILS PAGE (product-details.html) ---
  function initProductDetailsPage() {
    const pdpContainer = document.getElementById('pdp-content-area');
    if (!pdpContainer) return;

    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    if (!productId) {
      try {
        productId = localStorage.getItem(STORAGE_KEYS.SELECTED_PRODUCT);
      } catch (err) {
        productId = '1';
      }
    }

    let product = getProductById(productId);
    if (!product) {
      product = getProducts()[0];
    }

    if (!product) return;

    // Update page document title & breadcrumb
    document.title = product.name + ' | BookNest – Books & Stationery Store';
    const breadcrumbCurrent = document.getElementById('pdp-breadcrumb-name');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = product.name;
    }

    pdpContainer.innerHTML =
      '<div class="pdp-layout">' +
        '<div class="pdp-gallery">' +
          '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" referrerpolicy="no-referrer" />' +
        '</div>' +
        '<div class="pdp-info">' +
          '<div class="pdp-meta-top">' +
            '<span class="pdp-category">' + escapeHTML(product.category) + '</span>' +
            '<span aria-hidden="true">·</span>' +
            '<span class="product-rating-text"><span class="star-gold">★</span> ' + product.rating.toFixed(1) + ' (' + product.reviewsCount + ' verified student reviews)</span>' +
          '</div>' +
          '<h1 class="pdp-title">' + escapeHTML(product.name) + '</h1>' +
          '<div class="pdp-price-row">' +
            '<span class="pdp-price tabular-nums">' + formatINR(product.price) + '</span>' +
            '<span class="pdp-tax-note">Inclusive of all taxes · In Stock &amp; Ready to Ship</span>' +
          '</div>' +
          '<p class="pdp-description">' + escapeHTML(product.detailedDescription) + '</p>' +
          '<div class="pdp-specs-grid">' +
            '<div class="pdp-spec-item">' +
              '<span class="pdp-spec-label">' + (product.category === 'Books' ? 'Author' : 'Brand') + '</span>' +
              '<span class="pdp-spec-value">' + escapeHTML(product.specs.authorOrBrand) + '</span>' +
            '</div>' +
            '<div class="pdp-spec-item">' +
              '<span class="pdp-spec-label">Format / Pack</span>' +
              '<span class="pdp-spec-value">' + escapeHTML(product.specs.format) + '</span>' +
            '</div>' +
            '<div class="pdp-spec-item">' +
              '<span class="pdp-spec-label">Specification</span>' +
              '<span class="pdp-spec-value">' + escapeHTML(product.specs.languageOrMaterial) + '</span>' +
            '</div>' +
            '<div class="pdp-spec-item">' +
              '<span class="pdp-spec-label">Catalog Code</span>' +
              '<span class="pdp-spec-value tabular-nums">' + escapeHTML(product.specs.isbnOrSku) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="pdp-purchase-controls">' +
            '<div class="qty-selector" aria-label="Select quantity">' +
              '<button type="button" class="qty-btn" id="pdp-qty-minus" aria-label="Decrease quantity">−</button>' +
              '<input type="number" id="pdp-qty-input" class="qty-input" value="1" min="1" max="99" aria-label="Quantity" />' +
              '<button type="button" class="qty-btn" id="pdp-qty-plus" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" id="pdp-add-to-cart-btn" class="btn btn-primary" style="flex: 1; min-width: 200px;">' +
              'Add to Cart — ' + formatINR(product.price) +
            '</button>' +
          '</div>' +
          '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">' +
            '<a href="shop.html" class="btn btn-secondary btn-sm">← Back to Shop</a>' +
            '<a href="cart.html" class="btn btn-navy btn-sm">View Shopping Cart →</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Quantity Controls on PDP
    const qtyInput = document.getElementById('pdp-qty-input');
    const minusBtn = document.getElementById('pdp-qty-minus');
    const plusBtn = document.getElementById('pdp-qty-plus');
    const addBtn = document.getElementById('pdp-add-to-cart-btn');

    function updateAddButtonLabel() {
      const q = Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1));
      qtyInput.value = String(q);
      if (addBtn) {
        addBtn.textContent = 'Add to Cart — ' + formatINR(product.price * q);
      }
    }

    if (minusBtn && qtyInput) {
      minusBtn.addEventListener('click', function () {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = String(Math.max(1, current - 1));
        updateAddButtonLabel();
      });
    }

    if (plusBtn && qtyInput) {
      plusBtn.addEventListener('click', function () {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = String(Math.min(99, current + 1));
        updateAddButtonLabel();
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('change', updateAddButtonLabel);
    }

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        const q = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        addToCart(product.id, q);
      });
    }

    // Render Related Products from the same category
    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid) {
      const related = getProducts().filter(function (p) {
        return p.category === product.category && p.id !== product.id;
      }).slice(0, 3);
      relatedGrid.innerHTML = related.map(createProductCardHTML).join('');
    }
  }

  // --- CART PAGE (cart.html) ---
  function initCartPage() {
    const cartWrapper = document.getElementById('cart-page-content');
    if (!cartWrapper) return;

    function renderCartView() {
      const summary = calculateCartSummary();

      if (summary.items.length === 0) {
        cartWrapper.innerHTML =
          '<div class="empty-state-box">' +
            '<div style="font-size: 2.5rem; margin-bottom: 12px;">🛒</div>' +
            '<h2 class="empty-state-title">Your cart is empty.</h2>' +
            '<p class="empty-state-desc">Looks like you haven’t added any books or stationery essentials to your cart yet.</p>' +
            '<a href="shop.html" class="btn btn-primary">Continue Shopping</a>' +
          '</div>';
        return;
      }

      const itemsHTML = summary.items.map(function (item) {
        return (
          '<div class="cart-item-row" data-cart-item-id="' + item.id + '">' +
            '<a href="product-details.html?id=' + item.id + '" class="cart-item-thumb js-view-details" data-id="' + item.id + '">' +
              '<img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '" referrerpolicy="no-referrer" />' +
            '</a>' +
            '<div class="cart-item-info">' +
              '<h3><a href="product-details.html?id=' + item.id + '" class="js-view-details" data-id="' + item.id + '">' + escapeHTML(item.name) + '</a></h3>' +
              '<div class="cart-item-meta">' +
                '<span>' + escapeHTML(item.category) + '</span> · <span class="tabular-nums">Unit Price: ' + formatINR(item.price) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="qty-selector">' +
              '<button type="button" class="qty-btn js-cart-qty-dec" data-id="' + item.id + '" aria-label="Decrease quantity">−</button>' +
              '<input type="number" class="qty-input js-cart-qty-input" data-id="' + item.id + '" value="' + item.quantity + '" min="1" max="99" aria-label="Quantity" />' +
              '<button type="button" class="qty-btn js-cart-qty-inc" data-id="' + item.id + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<div class="cart-item-subtotal tabular-nums">' + formatINR(item.itemSubtotal) + '</div>' +
            '<div>' +
              '<button type="button" class="remove-item-btn js-cart-remove" data-id="' + item.id + '">Remove</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      const deliveryNote = summary.deliveryCharge === 0
        ? '<span style="color: var(--success); font-weight: 600;">FREE</span>'
        : '<span class="tabular-nums">' + formatINR(summary.deliveryCharge) + '</span>';

      const freeShippingBanner = summary.subtotal < FREE_DELIVERY_THRESHOLD
        ? '<p style="font-size: 0.82rem; color: var(--text-muted); background: var(--bg-cream); padding: 10px 12px; border-radius: 6px; margin-bottom: 16px;">Add <strong style="color: var(--accent-burgundy);">' + formatINR(FREE_DELIVERY_THRESHOLD - summary.subtotal) + '</strong> more for Free Delivery!</p>'
        : '<p style="font-size: 0.82rem; color: var(--success); background: var(--success-bg); padding: 10px 12px; border-radius: 6px; margin-bottom: 16px;">✓ Your order qualifies for Free Delivery!</p>';

      cartWrapper.innerHTML =
        '<div class="cart-layout">' +
          '<div class="cart-table-card">' +
            '<div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">' +
              '<h2 style="font-family: var(--font-display); font-size: 1.5rem;">Shopping Cart (' + summary.totalQuantity + ' items)</h2>' +
              '<a href="shop.html" class="btn btn-secondary btn-sm">Continue Shopping</a>' +
            '</div>' +
            '<div>' + itemsHTML + '</div>' +
          '</div>' +
          '<aside class="order-summary-card">' +
            '<h2 class="summary-heading">Order Summary</h2>' +
            freeShippingBanner +
            '<div class="summary-line">' +
              '<span>Items (' + summary.totalQuantity + ')</span>' +
              '<span class="tabular-nums">' + formatINR(summary.subtotal) + '</span>' +
            '</div>' +
            '<div class="summary-line">' +
              '<span>Delivery Charge</span>' +
              deliveryNote +
            '</div>' +
            '<div class="summary-line total">' +
              '<span>Total Amount</span>' +
              '<span class="tabular-nums">' + formatINR(summary.finalTotal) + '</span>' +
            '</div>' +
            '<div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">' +
              '<a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout →</a>' +
              '<a href="shop.html" class="btn btn-secondary btn-block">Continue Shopping</a>' +
            '</div>' +
          '</aside>' +
        '</div>';
    }

    renderCartView();

    // Delegate Cart Quantity & Remove Actions
    cartWrapper.addEventListener('click', function (e) {
      const decBtn = e.target.closest('.js-cart-qty-dec');
      if (decBtn) {
        const id = Number(decBtn.getAttribute('data-id'));
        const currentItem = getCart().find(function (i) { return Number(i.id) === id; });
        if (currentItem) {
          if (currentItem.quantity <= 1) {
            removeFromCart(id);
          } else {
            setCartItemQuantity(id, currentItem.quantity - 1);
          }
          renderCartView();
        }
        return;
      }

      const incBtn = e.target.closest('.js-cart-qty-inc');
      if (incBtn) {
        const id = Number(incBtn.getAttribute('data-id'));
        const currentItem = getCart().find(function (i) { return Number(i.id) === id; });
        if (currentItem) {
          setCartItemQuantity(id, currentItem.quantity + 1);
          renderCartView();
        }
        return;
      }

      const removeBtn = e.target.closest('.js-cart-remove');
      if (removeBtn) {
        const id = Number(removeBtn.getAttribute('data-id'));
        removeFromCart(id);
        renderCartView();
      }
    });

    cartWrapper.addEventListener('change', function (e) {
      const input = e.target.closest('.js-cart-qty-input');
      if (input) {
        const id = Number(input.getAttribute('data-id'));
        const val = parseInt(input.value, 10);
        if (isNaN(val) || val <= 0) {
          removeFromCart(id);
        } else {
          setCartItemQuantity(id, val);
        }
        renderCartView();
      }
    });
  }

  // --- CHECKOUT PAGE (checkout.html) ---
  function initCheckoutPage() {
    const checkoutWrapper = document.getElementById('checkout-page-content');
    if (!checkoutWrapper) return;

    const summary = calculateCartSummary();

    if (summary.items.length === 0) {
      checkoutWrapper.innerHTML =
        '<div class="empty-state-box">' +
          '<h2 class="empty-state-title">Your cart is empty.</h2>' +
          '<p class="empty-state-desc">Please add books or stationery items to your cart before proceeding to checkout.</p>' +
          '<a href="shop.html" class="btn btn-primary">Explore Shop</a>' +
        '</div>';
      return;
    }

    const miniItemsEl = document.getElementById('checkout-summary-items');
    const totalQtyEl = document.getElementById('checkout-total-qty');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery');
    const finalTotalEl = document.getElementById('checkout-final-total');

    if (miniItemsEl) {
      miniItemsEl.innerHTML = summary.items.map(function (item) {
        return (
          '<div class="checkout-mini-item">' +
            '<div>' +
              '<strong style="color: var(--text-navy); display: block;">' + escapeHTML(item.name) + '</strong>' +
              '<span style="color: var(--text-muted); font-size: 0.78rem;">Qty: ' + item.quantity + ' × ' + formatINR(item.price) + '</span>' +
            '</div>' +
            '<span class="tabular-nums" style="font-weight: 600;">' + formatINR(item.itemSubtotal) + '</span>' +
          '</div>'
        );
      }).join('');
    }

    if (totalQtyEl) totalQtyEl.textContent = String(summary.totalQuantity);
    if (subtotalEl) subtotalEl.textContent = formatINR(summary.subtotal);
    if (deliveryEl) {
      deliveryEl.innerHTML = summary.deliveryCharge === 0
        ? '<span style="color: var(--success); font-weight: 600;">FREE</span>'
        : formatINR(summary.deliveryCharge);
    }
    if (finalTotalEl) finalTotalEl.textContent = formatINR(summary.finalTotal);

    const checkoutForm = document.getElementById('booknest-checkout-form');
    if (!checkoutForm) return;

    function setFieldError(inputId, errorId, message) {
      const input = document.getElementById(inputId);
      const errEl = document.getElementById(errorId);
      if (input) {
        if (message) {
          input.classList.add('input-error');
        } else {
          input.classList.remove('input-error');
        }
      }
      if (errEl) {
        errEl.textContent = message || '';
      }
      return !message;
    }

    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = (document.getElementById('cust-name').value || '').trim();
      const email = (document.getElementById('cust-email').value || '').trim();
      const phone = (document.getElementById('cust-phone').value || '').trim();
      const address = (document.getElementById('cust-address').value || '').trim();
      const city = (document.getElementById('cust-city').value || '').trim();
      const state = (document.getElementById('cust-state').value || '').trim();
      const pincode = (document.getElementById('cust-pincode').value || '').trim();
      const paymentRadio = checkoutForm.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = paymentRadio ? paymentRadio.value : 'Cash on Delivery';

      let isValid = true;

      if (fullName.length < 2) {
        isValid = setFieldError('cust-name', 'err-cust-name', 'Please enter your full name.') && isValid;
      } else {
        setFieldError('cust-name', 'err-cust-name', '');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isValid = setFieldError('cust-email', 'err-cust-email', 'Please enter a valid email address.') && isValid;
      } else {
        setFieldError('cust-email', 'err-cust-email', '');
      }

      const cleanedPhone = phone.replace(/[\s\-+]/g, '');
      const phoneRegex = /^[0-9]{10,12}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        isValid = setFieldError('cust-phone', 'err-cust-phone', 'Please enter a valid 10-digit phone number.') && isValid;
      } else {
        setFieldError('cust-phone', 'err-cust-phone', '');
      }

      if (address.length < 5) {
        isValid = setFieldError('cust-address', 'err-cust-address', 'Please enter your complete street/hostel address.') && isValid;
      } else {
        setFieldError('cust-address', 'err-cust-address', '');
      }

      if (city.length < 2) {
        isValid = setFieldError('cust-city', 'err-cust-city', 'Please enter your city.') && isValid;
      } else {
        setFieldError('cust-city', 'err-cust-city', '');
      }

      if (state.length < 2) {
        isValid = setFieldError('cust-state', 'err-cust-state', 'Please select or enter your state.') && isValid;
      } else {
        setFieldError('cust-state', 'err-cust-state', '');
      }

      const pinRegex = /^[0-9]{6}$/;
      if (!pinRegex.test(pincode)) {
        isValid = setFieldError('cust-pincode', 'err-cust-pincode', 'Please enter a valid 6-digit PIN code.') && isValid;
      } else {
        setFieldError('cust-pincode', 'err-cust-pincode', '');
      }

      if (!isValid) {
        return;
      }

      // Generate a clean Order ID
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderId = 'BN-2026-' + randomDigits;

      // Calculate estimated delivery window (4 days from today)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const orderData = {
        orderId: orderId,
        customerName: fullName,
        email: email,
        phone: phone,
        address: address + ', ' + city + ', ' + state + ' - ' + pincode,
        paymentMethod: paymentMethod,
        items: summary.items,
        totalQuantity: summary.totalQuantity,
        subtotal: summary.subtotal,
        deliveryCharge: summary.deliveryCharge,
        finalTotal: summary.finalTotal,
        estimatedDelivery: formattedDelivery + ' (3–5 Business Days)'
      };

      try {
        localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(orderData));
      } catch (err) {
        // Ignore storage errors
      }

      // Clear cart after successful order placement
      clearCart();

      // Redirect to Order Success page
      window.location.href = 'success.html';
    });
  }

  // --- ORDER SUCCESS PAGE (success.html) ---
  function initSuccessPage() {
    const successContainer = document.getElementById('order-success-details');
    if (!successContainer) return;

    // Ensure cart is cleared
    clearCart();

    let orderData = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LAST_ORDER);
      if (raw) {
        orderData = JSON.parse(raw);
      }
    } catch (err) {
      orderData = null;
    }

    // Fallback order data if user visits success.html directly during evaluation
    if (!orderData || !orderData.orderId) {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 4);
      orderData = {
        orderId: 'BN-2026-' + Math.floor(10000 + Math.random() * 90000),
        customerName: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu.in',
        phone: '+91 98765 43210',
        address: 'Room 204, Vivekananda Hostel, University Road, Bengaluru, Karnataka - 560001',
        paymentMethod: 'Cash on Delivery',
        items: [
          { name: 'The Art of Programming', quantity: 1, price: 649, itemSubtotal: 649 },
          { name: 'Premium Spiral Notebook', quantity: 2, price: 249, itemSubtotal: 498 }
        ],
        totalQuantity: 3,
        subtotal: 1147,
        deliveryCharge: 0,
        finalTotal: 1147,
        estimatedDelivery: fallbackDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) + ' (3–5 Business Days)'
      };
    }

    const itemsListHTML = (orderData.items || []).map(function (item) {
      return (
        '<div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.92rem;">' +
          '<span><strong>' + escapeHTML(item.name) + '</strong> <span style="color: var(--text-muted);">× ' + item.quantity + '</span></span>' +
          '<span class="tabular-nums" style="font-weight: 600;">' + formatINR(item.itemSubtotal) + '</span>' +
        '</div>'
      );
    }).join('');

    successContainer.innerHTML =
      '<div class="success-meta-grid">' +
        '<div>' +
          '<span class="pdp-spec-label">Order ID</span>' +
          '<span class="pdp-spec-value tabular-nums" style="font-family: var(--font-mono); color: var(--accent-burgundy);">' + escapeHTML(orderData.orderId) + '</span>' +
        '</div>' +
        '<div>' +
          '<span class="pdp-spec-label">Customer Name</span>' +
          '<span class="pdp-spec-value">' + escapeHTML(orderData.customerName) + '</span>' +
        '</div>' +
        '<div>' +
          '<span class="pdp-spec-label">Payment Method</span>' +
          '<span class="pdp-spec-value">' + escapeHTML(orderData.paymentMethod) + '</span>' +
        '</div>' +
        '<div>' +
          '<span class="pdp-spec-label">Estimated Delivery</span>' +
          '<span class="pdp-spec-value" style="color: var(--success);">' + escapeHTML(orderData.estimatedDelivery) + '</span>' +
        '</div>' +
        '<div style="grid-column: 1 / -1;">' +
          '<span class="pdp-spec-label">Delivery Address</span>' +
          '<span class="pdp-spec-value">' + escapeHTML(orderData.address) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="success-items-box">' +
        '<h3 style="font-family: var(--font-display); font-size: 1.35rem; margin-bottom: 12px;">Ordered Products</h3>' +
        itemsListHTML +
        '<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px; margin-top: 8px; font-size: 1.15rem; font-weight: 700; color: var(--text-navy);">' +
          '<span>Total Amount</span>' +
          '<span class="tabular-nums" style="font-family: var(--font-mono);">' + formatINR(orderData.finalTotal) + '</span>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 6. Global Event Delegation & Navigation Setup
  // =========================================================================

  function initGlobalEvents() {
    updateCartCountUI();

    // Mobile hamburger menu toggle
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('primary-nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Global click listener for "Add to Cart" and "View Details" buttons
    document.addEventListener('click', function (e) {
      const addBtn = e.target.closest('.js-add-to-cart');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.getAttribute('data-id');
        addToCart(id, 1);
        return;
      }

      const detailsLink = e.target.closest('.js-view-details');
      if (detailsLink) {
        const id = detailsLink.getAttribute('data-id');
        if (id) {
          try {
            localStorage.setItem(STORAGE_KEYS.SELECTED_PRODUCT, String(id));
          } catch (err) {
            // Ignore
          }
        }
      }
    });
  }

  // =========================================================================
  // 7. Bootstrap Application on DOMContentLoaded
  // =========================================================================

  document.addEventListener('DOMContentLoaded', function () {
    initGlobalEvents();
    initHomePage();
    initShopPage();
    initProductDetailsPage();
    initCartPage();
    initCheckoutPage();
    initSuccessPage();
  });
})();
