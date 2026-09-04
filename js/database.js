/* ==========================================================================
   Zen Store - Central Database Service & Supabase Synchronization
   ========================================================================== */

const STORAGE_KEYS = {
  PRODUCTS: 'zenstore_products',
  ORDERS: 'zenstore_orders',
  SUPPLIERS: 'zenstore_suppliers',
  CATEGORIES: 'zenstore_categories',
  USERS: 'zenstore_users',
  REVIEWS: 'zenstore_reviews',
  SETTINGS: 'zenstore_settings',
  CART: 'zenstore_cart',
  SESSION: 'zenstore_session'
};

// Initial Seed Data Generator (Fallback when Supabase URL is unconfigured)
const INITIAL_SEED_DATA = {
  suppliers: [
    {
      id: 'SUP-101',
      name: 'Rajesh Kumar',
      companyName: 'TechCraft Logistics India',
      email: 'supplier1@techcraft.in',
      phone: '+91 98765 11001',
      address: '74 Industrial Layout, Electronic City, Bengaluru, Karnataka 560100',
      status: 'Active',
      rating: 4.9,
      paymentTerms: 'Net 15',
      totalPayout: 245000
    },
    {
      id: 'SUP-102',
      name: 'Amitabh Shah',
      companyName: 'NextGen Electronics Ltd',
      email: 'supplier2@nextgen.in',
      phone: '+91 98200 44321',
      address: 'Plot 12, SEZ MIDC, Andheri East, Mumbai, Maharashtra 400093',
      status: 'Active',
      rating: 4.8,
      paymentTerms: 'Net 30',
      totalPayout: 182000
    },
    {
      id: 'SUP-103',
      name: 'Suresh Verma',
      companyName: 'Apex Global Supply Hub',
      email: 'supplier3@apexglobal.in',
      phone: '+91 99100 88776',
      address: 'A-45 Okhla Industrial Area Phase II, New Delhi 110020',
      status: 'Active',
      rating: 4.7,
      paymentTerms: 'Net 7',
      totalPayout: 129000
    }
  ],

  categories: [
    { id: 'CAT-ELEC', name: 'Electronics & Audio', slug: 'electronics-audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Wireless earbuds, premium speakers, and soundbars' },
    { id: 'CAT-WEAR', name: 'Smart Wearables', slug: 'smart-wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'Smartwatches, fitness bands, and tracking devices' },
    { id: 'CAT-HOME', name: 'Home & Office', slug: 'home-office', image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&q=80', description: 'Ambient lighting, ergonomic decor, and smart home gadgets' },
    { id: 'CAT-PERC', name: 'Personal Care & Tech', slug: 'personal-care', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80', description: 'Grooming tools, wellness devices, and lifestyle accessories' }
  ],

  users: [
    { id: 'USR-ADMIN', name: 'Zen Admin', username: 'zeni', email: 'zeni@zenstore.com', password: 'zenn', role: 'admin', phone: '+91 99000 00000' },
    { id: 'USR-SUP1', name: 'Rajesh Kumar', email: 'supplier1@techcraft.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-101', phone: '+91 98765 11001' },
    { id: 'USR-SUP2', name: 'Amitabh Shah', email: 'supplier2@nextgen.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-102', phone: '+91 98200 44321' },
    { id: 'USR-SUP3', name: 'Suresh Verma', email: 'supplier3@apexglobal.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-103', phone: '+91 99100 88776' },
    { id: 'CUST-101', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', password: 'user123', role: 'customer', phone: '+91 98765 43210', address: 'Flat 402, Sunshine Heights, Koramangala 4th Block, Bengaluru, Karnataka - 560034' }
  ],

  products: [
    {
      id: 'PROD-101',
      name: 'ZenPods Pro Wireless ANC Earbuds',
      slug: 'zenpods-pro-wireless-anc-earbuds',
      shortDescription: 'Active Noise Cancellation with 36H Battery & Spatial Audio',
      description: 'Experience pure acoustic clarity with ZenPods Pro.',
      sku: 'ZP-ANC-01',
      categoryId: 'CAT-ELEC',
      brand: 'Zen',
      supplierId: 'SUP-101',
      status: 'Active',
      mrp: 3999,
      sellingPrice: 2499,
      buyPrice: 1100,
      shippingCost: 70,
      platformFee: 40,
      tax: 180,
      profit: 1109,
      profitMargin: 44.38,
      stock: 65,
      lowStockThreshold: 10,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
      mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      rating: 4.8,
      reviewsCount: 142,
      createdAt: '2026-08-01T10:00:00Z'
    },
    {
      id: 'PROD-102',
      name: 'ZenFit Smartwatch Ultra AMOLED',
      slug: 'zenfit-smartwatch-ultra-amoled',
      shortDescription: '1.96" HD AMOLED Display, BT Calling, 100+ Sports Modes',
      description: 'The ultimate smartwatch engineered for fitness enthusiasts and professionals.',
      sku: 'ZF-ULT-02',
      categoryId: 'CAT-WEAR',
      brand: 'ZenFit',
      supplierId: 'SUP-102',
      status: 'Active',
      mrp: 5999,
      sellingPrice: 3299,
      buyPrice: 1550,
      shippingCost: 90,
      platformFee: 50,
      tax: 250,
      profit: 1359,
      profitMargin: 41.19,
      stock: 42,
      lowStockThreshold: 8,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      rating: 4.7,
      reviewsCount: 98,
      createdAt: '2026-08-05T12:00:00Z'
    },
    {
      id: 'PROD-103',
      name: 'Aura Ambient RGB Desk Lamp',
      slug: 'aura-ambient-rgb-desk-lamp',
      shortDescription: 'Smart App Control, 16 Million RGB Colors, Wireless Charging Pad',
      description: 'Transform your work setup with Aura.',
      sku: 'AU-RGB-03',
      categoryId: 'CAT-HOME',
      brand: 'Aura',
      supplierId: 'SUP-103',
      status: 'Active',
      mrp: 2999,
      sellingPrice: 1899,
      buyPrice: 850,
      shippingCost: 80,
      platformFee: 30,
      tax: 140,
      profit: 799,
      profitMargin: 42.07,
      stock: 30,
      lowStockThreshold: 5,
      images: ['https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80'],
      mainImage: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80',
      rating: 4.6,
      reviewsCount: 76,
      createdAt: '2026-08-10T14:30:00Z'
    }
  ],

  orders: []
};

// Database Service API
const ZenDB = {
  // Synchronous cache for reactive frontend rendering
  _cache: {
    products: null,
    categories: null,
    suppliers: null,
    orders: null,
    users: null
  },

  // Storage & Cache Initialization
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_SEED_DATA.products));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_SEED_DATA.orders));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SEED_DATA.suppliers));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_SEED_DATA.categories));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_SEED_DATA.users));
    }
    this.refreshCacheFromStorage();

    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      this.syncFromSupabase();
    }
  },

  refreshCacheFromStorage() {
    this._cache.products = this._getLocalStorage(STORAGE_KEYS.PRODUCTS);
    this._cache.orders = this._getLocalStorage(STORAGE_KEYS.ORDERS);
    this._cache.suppliers = this._getLocalStorage(STORAGE_KEYS.SUPPLIERS);
    this._cache.categories = this._getLocalStorage(STORAGE_KEYS.CATEGORIES);
    this._cache.users = this._getLocalStorage(STORAGE_KEYS.USERS);
  },

  _getLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  _setLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Supabase Async Fetcher & Cache Sync
  async syncFromSupabase() {
    const client = SupabaseClientService.getClient();
    if (!client) return;

    try {
      // 1. Categories
      const { data: catData } = await client.from('categories').select('*');
      if (catData && catData.length) {
        this._cache.categories = catData.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image_url || ''
        }));
        this._setLocalStorage(STORAGE_KEYS.CATEGORIES, this._cache.categories);
      }

      // 2. Suppliers
      const { data: supData } = await client.from('suppliers').select('*');
      if (supData && supData.length) {
        this._cache.suppliers = supData.map(s => ({
          id: s.id,
          name: s.company_name,
          companyName: s.company_name,
          email: s.email,
          phone: s.phone || '',
          address: s.address || '',
          status: s.status || 'Active',
          paymentTerms: s.payment_terms || 'Net 15',
          totalPayout: Number(s.total_payout) || 0
        }));
        this._setLocalStorage(STORAGE_KEYS.SUPPLIERS, this._cache.suppliers);
      }

      // 3. Products
      const { data: prodData } = await client.from('products').select('*');
      if (prodData && prodData.length) {
        this._cache.products = prodData.map(p => ({
          id: p.id,
          supplierId: p.supplier_id,
          categoryId: p.category_id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          shortDescription: p.short_description || '',
          sku: p.sku,
          brand: p.brand || 'Zen Store',
          mrp: Number(p.mrp),
          sellingPrice: Number(p.selling_price),
          buyPrice: Math.round(Number(p.selling_price) * 0.5),
          shippingCost: 70,
          platformFee: 40,
          tax: Math.round(Number(p.selling_price) * 0.18),
          profit: Math.round(Number(p.selling_price) * 0.3),
          profitMargin: 30.0,
          stock: p.stock,
          lowStockThreshold: p.low_stock_threshold || 10,
          status: p.status || 'Active',
          rating: Number(p.rating) || 4.8,
          reviewsCount: p.reviews_count || 0,
          mainImage: p.main_image || '',
          images: [p.main_image || '']
        }));
        this._setLocalStorage(STORAGE_KEYS.PRODUCTS, this._cache.products);
      }

      // 4. Orders & Order Items
      const { data: ordData } = await client.from('orders').select('*, order_items(*)');
      if (ordData) {
        this._cache.orders = ordData.map(o => ({
          id: o.id,
          customerId: o.customer_id,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          supplierId: o.supplier_id,
          shippingAddress: o.shipping_address,
          subtotal: Number(o.subtotal),
          shipping: Number(o.shipping_cost),
          tax: Number(o.tax),
          total: Number(o.total),
          totalBuyCost: Number(o.buy_cost),
          totalProfit: Number(o.profit),
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status === 'unpaid' ? 'Unpaid' : o.payment_status === 'paid' ? 'Paid' : 'COD',
          orderStatus: this._mapEnumToOrderStatus(o.order_status),
          trackingNumber: o.tracking_number || '',
          createdAt: o.created_at,
          items: (o.order_items || []).map(i => ({
            productId: i.product_id,
            supplierId: i.supplier_id,
            name: i.product_name,
            sku: i.sku,
            variantId: i.variant_id,
            variantName: i.variant_name,
            qty: i.quantity,
            mrp: Number(i.mrp),
            sellingPrice: Number(i.selling_price),
            buyPrice: Number(i.buy_price),
            image: i.image_url
          }))
        }));
        this._setLocalStorage(STORAGE_KEYS.ORDERS, this._cache.orders);
      }

    } catch (e) {
      console.warn('Supabase sync warning:', e);
    }
  },

  _mapEnumToOrderStatus(enumVal) {
    const map = {
      'pending_whatsapp_confirmation': 'Pending WhatsApp Confirmation',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'assigned_to_supplier': 'Assigned to Supplier',
      'accepted': 'Accepted',
      'shipped': 'Shipped',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'returned': 'Returned',
      'refunded': 'Refunded'
    };
    return map[enumVal] || enumVal || 'Pending WhatsApp Confirmation';
  },

  _mapOrderStatusToEnum(statusVal) {
    const map = {
      'Pending WhatsApp Confirmation': 'pending_whatsapp_confirmation',
      'Confirmed': 'confirmed',
      'Processing': 'processing',
      'Assigned to Supplier': 'assigned_to_supplier',
      'Accepted': 'accepted',
      'Shipped': 'shipped',
      'Out for Delivery': 'out_for_delivery',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled',
      'Returned': 'returned',
      'Refunded': 'refunded'
    };
    return map[statusVal] || 'pending_whatsapp_confirmation';
  },

  // ================= PRODUCTS API =================
  getProducts() {
    return this._cache.products || this._getLocalStorage(STORAGE_KEYS.PRODUCTS);
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  getProductBySlug(slug) {
    const products = this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  },

  async saveProduct(productData) {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);
    const prodId = productData.id || 'PROD-' + Math.floor(1000 + Math.random() * 9000);

    const fullProduct = {
      id: prodId,
      name: productData.name,
      slug: productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product-' + Date.now()),
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      sku: productData.sku || ('SKU-' + Date.now()),
      brand: productData.brand || 'Zen Store',
      supplierId: productData.supplierId || 'SUP-101',
      categoryId: productData.categoryId || 'CAT-ELEC',
      mrp: Number(productData.mrp) || 0,
      sellingPrice: Number(productData.sellingPrice) || 0,
      buyPrice: Number(productData.buyPrice) || 0,
      shippingCost: Number(productData.shippingCost) || 0,
      platformFee: Number(productData.platformFee) || 0,
      tax: Number(productData.tax) || 0,
      profit: Number(productData.profit) || 0,
      profitMargin: Number(productData.profitMargin) || 0,
      stock: Number(productData.stock) || 0,
      lowStockThreshold: Number(productData.lowStockThreshold) || 10,
      status: productData.status || 'Active',
      rating: Number(productData.rating) || 4.8,
      reviewsCount: productData.reviewsCount || 0,
      mainImage: productData.mainImage || (productData.images && productData.images[0]) || '',
      images: productData.images || [productData.mainImage || ''],
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...fullProduct };
    } else {
      fullProduct.createdAt = new Date().toISOString();
      products.unshift(fullProduct);
    }

    this._setLocalStorage(STORAGE_KEYS.PRODUCTS, products);
    this._cache.products = products;

    // Realtime Supabase Database Sync
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('products').upsert({
            id: prodId,
            name: fullProduct.name,
            slug: fullProduct.slug,
            short_description: fullProduct.shortDescription,
            description: fullProduct.description,
            sku: fullProduct.sku,
            brand: fullProduct.brand,
            supplier_id: fullProduct.supplierId,
            category_id: fullProduct.categoryId,
            mrp: fullProduct.mrp,
            selling_price: fullProduct.sellingPrice,
            stock: fullProduct.stock,
            low_stock_threshold: fullProduct.lowStockThreshold,
            status: fullProduct.status,
            main_image: fullProduct.mainImage,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' }).select();

          if (error) {
            console.error('⚠️ Supabase Product Sync Error:', error.message);
          } else {
            console.log('⚡ Product successfully published to Supabase:', prodId, data);
          }
        } catch (e) {
          console.warn('Supabase product save exception:', e);
        }
      }
    }

    return fullProduct;
  },

  async deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this._setLocalStorage(STORAGE_KEYS.PRODUCTS, products);
    this._cache.products = products;

    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          const { error } = await client.from('products').delete().eq('id', id);
          if (error) {
            console.error('⚠️ Supabase Product Delete Error:', error.message);
          } else {
            console.log('⚡ Product successfully deleted from Supabase:', id);
          }
        } catch (e) {
          console.warn('Supabase product delete exception:', e);
        }
      }
    }
    return true;
  },

  // ================= ORDERS API =================
  getOrders() {
    return this._cache.orders || this._getLocalStorage(STORAGE_KEYS.ORDERS);
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  getOrdersByCustomer(customerId) {
    const orders = this.getOrders();
    return orders.filter(o => o.customerId === customerId);
  },

  getOrdersBySupplier(supplierId) {
    const orders = this.getOrders();
    return orders.filter(o => {
      return o.supplierId === supplierId || (o.items && o.items.some(item => item.supplierId === supplierId));
    });
  },

  async createOrder(orderData) {
    const orders = this.getOrders();
    const todayStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const seq = Math.floor(100 + Math.random() * 900);
    const newOrderId = orderData.id || `ORD-${todayStr}-${seq}`;

    const newOrder = {
      id: newOrderId,
      orderStatus: orderData.orderStatus || 'Pending WhatsApp Confirmation',
      paymentStatus: orderData.paymentStatus || 'Unpaid',
      supplierStatus: {},
      trackingNumber: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };

    orders.unshift(newOrder);
    this._setLocalStorage(STORAGE_KEYS.ORDERS, orders);
    this._cache.orders = orders;

    // Deduct stock in local cache
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) p.stock = Math.max(0, p.stock - item.qty);
    });
    this._setLocalStorage(STORAGE_KEYS.PRODUCTS, products);
    this._cache.products = products;

    // Push Order to Supabase via RPC or SQL tables
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          // Attempt RPC with atomic stock check
          const { data: rpcRes, error: rpcErr } = await client.rpc('create_order_with_stock_check', {
            p_order_id: newOrderId,
            p_customer_id: (newOrder.customerId && newOrder.customerId.includes('-')) ? null : newOrder.customerId,
            p_customer_name: newOrder.customerName,
            p_customer_email: newOrder.customerEmail,
            p_customer_phone: newOrder.customerPhone,
            p_shipping_address: newOrder.shippingAddress,
            p_items: newOrder.items,
            p_subtotal: newOrder.subtotal,
            p_shipping_cost: newOrder.shipping || 0,
            p_tax: newOrder.tax || 0,
            p_total: newOrder.total,
            p_buy_cost: newOrder.totalBuyCost || 0,
            p_profit: newOrder.totalProfit || 0,
            p_payment_method: newOrder.paymentMethod || 'Payment on WhatsApp / COD',
            p_payment_status: 'unpaid',
            p_order_status: 'pending_whatsapp_confirmation'
          });

          if (rpcErr) {
            console.warn('RPC Order Insertion Fallback:', rpcErr.message);
          }
        } catch (e) {
          console.warn('Supabase Order Push error:', e);
        }
      }
    }

    return newOrder;
  },

  async updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      if (status === 'Paid') order.paymentStatus = 'Paid';
      this._setLocalStorage(STORAGE_KEYS.ORDERS, orders);
      this._cache.orders = orders;

      if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
        const client = SupabaseClientService.getClient();
        if (client) {
          await client.from('orders').update({
            order_status: this._mapOrderStatusToEnum(status),
            updated_at: new Date().toISOString()
          }).eq('id', orderId);
        }
      }
      return true;
    }
    return false;
  },

  async updateSupplierFulfillment(orderId, supplierId, updateObj) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      if (updateObj.trackingNumber) {
        order.trackingNumber = updateObj.trackingNumber;
      }
      if (updateObj.status === 'Shipped') {
        order.orderStatus = 'Shipped';
      } else if (updateObj.status === 'Delivered') {
        order.orderStatus = 'Delivered';
        order.paymentStatus = 'Paid';
      }
      order.updatedAt = new Date().toISOString();
      this._setLocalStorage(STORAGE_KEYS.ORDERS, orders);
      this._cache.orders = orders;

      if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
        const client = SupabaseClientService.getClient();
        if (client) {
          await client.from('orders').update({
            order_status: this._mapOrderStatusToEnum(order.orderStatus),
            tracking_number: order.trackingNumber,
            updated_at: new Date().toISOString()
          }).eq('id', orderId);
        }
      }
      return true;
    }
    return false;
  },

  // ================= SUPPLIERS & CATEGORIES API =================
  getSuppliers() {
    return this._cache.suppliers || this._getLocalStorage(STORAGE_KEYS.SUPPLIERS);
  },

  getSupplierById(id) {
    const suppliers = this.getSuppliers();
    return suppliers.find(s => s.id === id) || null;
  },

  getCategories() {
    return this._cache.categories || this._getLocalStorage(STORAGE_KEYS.CATEGORIES);
  },

  // ================= USERS API =================
  getUsers() {
    let users = this._cache.users || this._getLocalStorage(STORAGE_KEYS.USERS) || [];
    const adminUser = users.find(u => u.role === 'admin' || u.role === 'owner');
    if (adminUser) {
      adminUser.username = 'zeni';
      adminUser.email = 'zeni@zenstore.com';
      adminUser.password = 'zenn';
    } else {
      users.push({ id: 'USR-ADMIN', name: 'Zen Admin', username: 'zeni', email: 'zeni@zenstore.com', password: 'zenn', role: 'admin', phone: '+91 99000 00000' });
      this._setLocalStorage(STORAGE_KEYS.USERS, users);
    }
    return users;
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser(userData) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Email address already registered' };
    }
    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      role: 'customer',
      addresses: [],
      ...userData
    };
    users.push(newUser);
    this._setLocalStorage(STORAGE_KEYS.USERS, users);
    this._cache.users = users;
    return { success: true, user: newUser };
  },

  saveGoogleUser(googleProfile) {
    const users = this.getUsers();
    let user = users.find(u => u.googleId === googleProfile.googleId || (u.email && u.email.toLowerCase() === googleProfile.email.toLowerCase()));
    
    if (user) {
      user.googleId = googleProfile.googleId;
      user.name = googleProfile.name || user.name;
      user.photo = googleProfile.photo || user.photo;
      if (!user.addresses) user.addresses = [];
    } else {
      user = {
        id: googleProfile.id || 'CUST-' + Math.floor(1000 + Math.random() * 9000),
        googleId: googleProfile.googleId,
        name: googleProfile.name,
        email: googleProfile.email,
        photo: googleProfile.photo || '',
        phone: googleProfile.phone || '',
        role: 'customer',
        addresses: [],
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }
    this._setLocalStorage(STORAGE_KEYS.USERS, users);
    this._cache.users = users;
    return user;
  },

  saveCustomerAddress(userId, addressObj) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.addresses) user.addresses = [];
      const existsIdx = user.addresses.findIndex(a => 
        a.house === addressObj.house && a.pin === addressObj.pin
      );
      if (existsIdx >= 0) {
        user.addresses[existsIdx] = { ...user.addresses[existsIdx], ...addressObj };
      } else {
        user.addresses.push({ id: 'ADDR-' + Date.now(), ...addressObj });
      }
      this._setLocalStorage(STORAGE_KEYS.USERS, users);
      this._cache.users = users;

      // Async push address to Supabase if configured
      if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
        const client = SupabaseClientService.getClient();
        if (client && userId && !userId.includes('CUST-')) {
          client.from('addresses').insert({
            user_id: userId,
            full_name: addressObj.fullName || user.name,
            phone: addressObj.phone || user.phone,
            address_line1: addressObj.house,
            area: addressObj.area,
            city: addressObj.city,
            state: addressObj.state,
            postal_code: addressObj.pin,
            country: 'India'
          });
        }
      }

      return user.addresses;
    }
    return [];
  },

  // ================= CART API =================
  getCart() {
    return this._getLocalStorage(STORAGE_KEYS.CART);
  },

  saveCart(cartItems) {
    this._setLocalStorage(STORAGE_KEYS.CART, cartItems);
  },

  clearCart() {
    this._setLocalStorage(STORAGE_KEYS.CART, []);
  }
};

// Initialize DB immediately
ZenDB.init();
