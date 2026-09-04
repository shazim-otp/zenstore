/* ==========================================================================
   Zen Store - Customer Shopping Cart Service
   Cart State, Totals Calculation, Voucher Discounts, Security Isolation
   ========================================================================== */

const Cart = {
  getCart() {
    return ZenDB.getCart();
  },

  addItem(productId, variantId = null, qty = 1) {
    const product = ZenDB.getProductById(productId);
    if (!product) {
      Utils.showToast('Product not found', 'error');
      return;
    }

    if (product.stock < qty) {
      Utils.showToast(`Only ${product.stock} units left in stock!`, 'warning');
      return;
    }

    const cart = this.getCart();

    // Check if variant selected
    let selectedVariant = null;
    if (variantId && product.variants) {
      selectedVariant = product.variants.find(v => v.id === variantId);
    }

    const cartItemId = variantId ? `${productId}_${variantId}` : productId;
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    // SECURITY ISOLATION: Only copy public customer-facing fields!
    const cartItem = {
      cartItemId,
      productId: product.id,
      variantId: selectedVariant ? selectedVariant.id : null,
      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      image: product.mainImage,
      mrp: product.mrp,
      sellingPrice: selectedVariant ? selectedVariant.sellingPrice : product.sellingPrice,
      qty: qty,
      stock: selectedVariant ? selectedVariant.stock : product.stock,
      supplierId: product.supplierId // needed internally for order routing
    };

    if (existingIndex >= 0) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push(cartItem);
    }

    ZenDB.saveCart(cart);
    this.updateCartBadge();
    Utils.showToast(`Added "${cartItem.name}" to cart!`, 'success');
  },

  updateQty(cartItemId, newQty) {
    let cart = this.getCart();
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
      if (newQty <= 0) {
        this.removeItem(cartItemId);
        return;
      }
      item.qty = Math.min(newQty, item.stock);
      ZenDB.saveCart(cart);
      this.updateCartBadge();
    }
  },

  removeItem(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.cartItemId !== cartItemId);
    ZenDB.saveCart(cart);
    this.updateCartBadge();
    Utils.showToast('Item removed from cart', 'info');
  },

  clear() {
    ZenDB.clearCart();
    this.updateCartBadge();
  },

  getTotals() {
    const cart = this.getCart();
    let mrpTotal = 0;
    let subtotal = 0;

    cart.forEach(item => {
      mrpTotal += (item.mrp * item.qty);
      subtotal += (item.sellingPrice * item.qty);
    });

    const discount = mrpTotal - subtotal;
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99; // Free shipping over ₹999
    const tax = Math.round(subtotal * 0.18); // GST 18%
    const grandTotal = subtotal + shipping + tax;

    return {
      mrpTotal,
      subtotal,
      discount,
      shipping,
      tax,
      grandTotal,
      itemCount: cart.reduce((sum, item) => sum + item.qty, 0)
    };
  },

  updateCartBadge() {
    const totals = this.getTotals();
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = totals.itemCount;
      badge.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    }
  }
};
