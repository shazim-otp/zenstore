/* ==========================================================================
   Zen Store - Central Database Service & Automatic Seed Generator
   Data Storage Engine using LocalStorage
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

// Initial Seed Data Generator
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
    { id: 'USR-ADMIN', name: 'Zen Admin', email: 'admin@zenstore.com', password: 'admin123', role: 'admin', phone: '+91 99000 00000' },
    { id: 'USR-SUP1', name: 'Rajesh Kumar', email: 'supplier1@techcraft.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-101', phone: '+91 98765 11001' },
    { id: 'USR-SUP2', name: 'Amitabh Shah', email: 'supplier2@nextgen.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-102', phone: '+91 98200 44321' },
    { id: 'USR-SUP3', name: 'Suresh Verma', email: 'supplier3@apexglobal.in', password: 'supplier123', role: 'supplier', supplierId: 'SUP-103', phone: '+91 99100 88776' },
    { id: 'CUST-101', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', password: 'user123', role: 'customer', phone: '+91 98765 43210', address: 'Flat 402, Sunshine Heights, Koramangala 4th Block, Bengaluru, Karnataka - 560034' },
    { id: 'CUST-102', name: 'Priya Patel', email: 'priya.patel@yahoo.com', password: 'user123', role: 'customer', phone: '+91 98211 99887', address: 'B-14 Gokul Dham, SG Highway, Ahmedabad, Gujarat - 380054' },
    { id: 'CUST-103', name: 'Ananya Sen', email: 'ananya.sen@outlook.com', password: 'user123', role: 'customer', phone: '+91 97112 33445', address: '12 Park Street, Flat 3B, Kolkata, West Bengal - 700016' },
    { id: 'CUST-104', name: 'Vikram Malhotra', email: 'vikram.m@gmail.com', password: 'user123', role: 'customer', phone: '+91 99887 66554', address: '78 Model Town Phase 2, New Delhi - 110009' }
  ],

  products: [
    {
      id: 'PROD-101',
      name: 'ZenPods Pro Wireless ANC Earbuds',
      slug: 'zenpods-pro-wireless-anc-earbuds',
      shortDescription: 'Active Noise Cancellation with 36H Battery & Spatial Audio',
      description: 'Experience pure acoustic clarity with ZenPods Pro. Features 45dB hybrid active noise cancellation, custom 11mm titanium drivers, environmental noise cancellation for crisp phone calls, and wireless fast charging.',
      sku: 'ZP-ANC-01',
      categoryId: 'CAT-ELEC',
      brand: 'Zen',
      tags: ['audio', 'wireless', 'anc', 'bluetooth'],
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
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      variants: [
        { id: 'V1', name: 'Matte Black', sku: 'ZP-BLK', sellingPrice: 2499, buyPrice: 1100, stock: 35 },
        { id: 'V2', name: 'Glacier White', sku: 'ZP-WHT', sellingPrice: 2499, buyPrice: 1100, stock: 30 }
      ],
      rating: 4.8,
      reviewsCount: 142,
      createdAt: '2026-08-01T10:00:00Z'
    },
    {
      id: 'PROD-102',
      name: 'ZenFit Smartwatch Ultra AMOLED',
      slug: 'zenfit-smartwatch-ultra-amoled',
      shortDescription: '1.96" HD AMOLED Display, BT Calling, 100+ Sports Modes',
      description: 'The ultimate smartwatch engineered for fitness enthusiasts and professionals. Crafted with a premium zinc-alloy frame, Bluetooth calling, heart rate & SpO2 monitoring, multi-day battery life, and IP68 waterproof rating.',
      sku: 'ZF-ULT-02',
      categoryId: 'CAT-WEAR',
      brand: 'ZenFit',
      tags: ['smartwatch', 'fitness', 'wearable', 'amoled'],
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
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      variants: [
        { id: 'V1', name: 'Starlight Silver', sku: 'ZF-SLV', sellingPrice: 3299, buyPrice: 1550, stock: 22 },
        { id: 'V2', name: 'Midnight Black', sku: 'ZF-BLK', sellingPrice: 3299, buyPrice: 1550, stock: 20 }
      ],
      rating: 4.7,
      reviewsCount: 98,
      createdAt: '2026-08-05T12:00:00Z'
    },
    {
      id: 'PROD-103',
      name: 'Aura Ambient RGB Desk Lamp',
      slug: 'aura-ambient-rgb-desk-lamp',
      shortDescription: 'Smart App Control, 16 Million RGB Colors, Wireless Charging Pad',
      description: 'Transform your work setup with Aura. Combines a sleek minimalist architectural desk lamp, 10W Qi wireless smartphone charging base, sound-reactive RGB music modes, and stepless dimming.',
      sku: 'AU-RGB-03',
      categoryId: 'CAT-HOME',
      brand: 'Aura',
      tags: ['lighting', 'rgb', 'desk', 'smart home'],
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
      images: [
        'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80',
      variants: [],
      rating: 4.6,
      reviewsCount: 76,
      createdAt: '2026-08-10T14:30:00Z'
    },
    {
      id: 'PROD-104',
      name: 'HyperCharge 65W GaN Fast Charger',
      slug: 'hypercharge-65w-gan-fast-charger',
      shortDescription: 'Dual Type-C + USB-A Triple Port Power Adapter for Laptops & Mobiles',
      description: 'Power all your devices simultaneously with cutting-edge Gallium Nitride (GaN) technology. 65W High-speed PD output charges MacBook, iPhone, and Android flagships from 0 to 60% in just 30 mins.',
      sku: 'HC-GAN-65',
      categoryId: 'CAT-ELEC',
      brand: 'HyperCharge',
      tags: ['charger', 'gan', 'fast charge', 'power'],
      supplierId: 'SUP-101',
      status: 'Active',
      mrp: 2499,
      sellingPrice: 1499,
      buyPrice: 650,
      shippingCost: 50,
      platformFee: 25,
      tax: 110,
      profit: 664,
      profitMargin: 44.30,
      stock: 90,
      lowStockThreshold: 15,
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      variants: [],
      rating: 4.9,
      reviewsCount: 210,
      createdAt: '2026-08-12T09:15:00Z'
    },
    {
      id: 'PROD-105',
      name: 'ZenBlend Portable Wireless Blender',
      slug: 'zenblend-portable-wireless-blender',
      shortDescription: 'USB-C Rechargeable Smoothies & Shake Maker with 6 Stainless Steel Blades',
      description: 'Blend smoothies, protein shakes, and fresh juices anywhere on the go. Equipped with a powerful 7.4V motor, 1200mAh battery (up to 15 blends per charge), and BPA-free food-grade bottle.',
      sku: 'ZB-PORT-05',
      categoryId: 'CAT-PERC',
      brand: 'ZenBlend',
      tags: ['blender', 'kitchen', 'fitness', 'portable'],
      supplierId: 'SUP-103',
      status: 'Active',
      mrp: 2199,
      sellingPrice: 1399,
      buyPrice: 580,
      shippingCost: 60,
      platformFee: 25,
      tax: 100,
      profit: 634,
      profitMargin: 45.32,
      stock: 50,
      lowStockThreshold: 10,
      images: [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
      variants: [],
      rating: 4.5,
      reviewsCount: 64,
      createdAt: '2026-08-15T11:00:00Z'
    },
    {
      id: 'PROD-106',
      name: 'Ergonomic Breathable Mesh Chair Pro',
      slug: 'ergonomic-breathable-mesh-chair-pro',
      shortDescription: '3D Lumbar Support, Adjustable Headrest, 135° Recline',
      description: 'Engineered for all-day comfort. Features high-density memory foam seat cushion, Korean breathable mesh backrest, 3D adjustable armrests, and heavy-duty class 4 gas lift mechanism.',
      sku: 'CH-ERGO-06',
      categoryId: 'CAT-HOME',
      brand: 'ZenWork',
      tags: ['chair', 'furniture', 'ergonomic', 'office'],
      supplierId: 'SUP-102',
      status: 'Active',
      mrp: 14999,
      sellingPrice: 8999,
      buyPrice: 4200,
      shippingCost: 450,
      platformFee: 150,
      tax: 680,
      profit: 3519,
      profitMargin: 39.10,
      stock: 18,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80',
      variants: [],
      rating: 4.8,
      reviewsCount: 52,
      createdAt: '2026-08-16T16:20:00Z'
    },
    {
      id: 'PROD-107',
      name: 'ZenSound 120W Dolby Soundbar',
      slug: 'zensound-120w-dolby-soundbar',
      shortDescription: 'Wireless Subwoofer, HDMI ARC, Optical & Bluetooth 5.3',
      description: 'Bring cinematic theater sound to your living room. 2.1 Channel soundbar with dedicated wireless deep bass subwoofer, customizable EQ modes (Movie, Music, News), and sleek metallic mesh finish.',
      sku: 'ZS-BAR-120',
      categoryId: 'CAT-ELEC',
      brand: 'Zen',
      tags: ['audio', 'soundbar', 'home theater', 'speaker'],
      supplierId: 'SUP-101',
      status: 'Active',
      mrp: 9999,
      sellingPrice: 5999,
      buyPrice: 2800,
      shippingCost: 200,
      platformFee: 90,
      tax: 450,
      profit: 2459,
      profitMargin: 40.99,
      stock: 25,
      lowStockThreshold: 5,
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      variants: [],
      rating: 4.7,
      reviewsCount: 88,
      createdAt: '2026-08-18T10:00:00Z'
    },
    {
      id: 'PROD-108',
      name: 'AeroCool Ergonomic Laptop Stand',
      slug: 'aerocool-ergonomic-laptop-stand',
      shortDescription: '100% Aluminum Alloy Construction with Dual Cooling Fans',
      description: 'Keep your laptop cool and at ergonomic eye level. Supports all laptops up to 17.3 inches, features 6 adjustable height angles, non-slip silicone pads, and silent USB cooling fans.',
      sku: 'AC-LST-08',
      categoryId: 'CAT-HOME',
      brand: 'AeroCool',
      tags: ['laptop', 'stand', 'accessory', 'office'],
      supplierId: 'SUP-103',
      status: 'Active',
      mrp: 1999,
      sellingPrice: 1199,
      buyPrice: 490,
      shippingCost: 60,
      platformFee: 20,
      tax: 90,
      profit: 539,
      profitMargin: 44.95,
      stock: 80,
      lowStockThreshold: 12,
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      variants: [],
      rating: 4.6,
      reviewsCount: 115,
      createdAt: '2026-08-20T14:00:00Z'
    },
    {
      id: 'PROD-109',
      name: 'ZenKey RGB Wireless Mechanical Keyboard',
      slug: 'zenkey-rgb-wireless-mechanical-keyboard',
      shortDescription: 'Hot-Swappable Gateron Switches, Tri-Mode Connection (BT/2.4G/Type-C)',
      description: 'Crafted for gamers and typists. 75% compact layout, PBT double-shot keycaps, per-key RGB backlighting with 19 effects, and massive 4000mAh battery.',
      sku: 'ZK-KB-75',
      categoryId: 'CAT-ELEC',
      brand: 'ZenKey',
      tags: ['keyboard', 'gaming', 'rgb', 'mechanical'],
      supplierId: 'SUP-101',
      status: 'Active',
      mrp: 6999,
      sellingPrice: 4299,
      buyPrice: 2000,
      shippingCost: 100,
      platformFee: 65,
      tax: 320,
      profit: 1814,
      profitMargin: 42.19,
      stock: 35,
      lowStockThreshold: 6,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      variants: [
        { id: 'V1', name: 'Red Linear Switches', sku: 'ZK-RED', sellingPrice: 4299, buyPrice: 2000, stock: 20 },
        { id: 'V2', name: 'Brown Tactile Switches', sku: 'ZK-BRN', sellingPrice: 4299, buyPrice: 2000, stock: 15 }
      ],
      rating: 4.9,
      reviewsCount: 160,
      createdAt: '2026-08-22T08:30:00Z'
    },
    {
      id: 'PROD-110',
      name: 'PureBreathe Smart HEPA Air Purifier',
      slug: 'purebreathe-smart-hepa-air-purifier',
      shortDescription: 'H13 True HEPA Filter, Real-time AQI Monitor, Silent Sleep Mode',
      description: 'Eliminates 99.97% of airborne pollutants, dust, pollen, and odor. Filters air in rooms up to 400 sq.ft, features digital PM2.5 air quality readout, and smart phone app integration.',
      sku: 'PB-AIR-10',
      categoryId: 'CAT-HOME',
      brand: 'PureBreathe',
      tags: ['home', 'air purifier', 'smart home', 'health'],
      supplierId: 'SUP-102',
      status: 'Active',
      mrp: 8999,
      sellingPrice: 5499,
      buyPrice: 2600,
      shippingCost: 180,
      platformFee: 80,
      tax: 410,
      profit: 2229,
      profitMargin: 40.53,
      stock: 22,
      lowStockThreshold: 5,
      images: [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
      variants: [],
      rating: 4.8,
      reviewsCount: 79,
      createdAt: '2026-08-23T15:45:00Z'
    }
  ],

  orders: [
    {
      id: 'ORD-94801',
      customerId: 'CUST-101',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@gmail.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: {
        house: 'Flat 402, Sunshine Heights',
        area: 'Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pin: '560034',
        country: 'India'
      },
      items: [
        {
          productId: 'PROD-101',
          variantId: 'V1',
          name: 'ZenPods Pro Wireless ANC Earbuds (Matte Black)',
          sku: 'ZP-BLK',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
          qty: 1,
          mrp: 3999,
          sellingPrice: 2499,
          buyPrice: 1100,
          shippingCost: 70,
          platformFee: 40,
          tax: 180,
          profit: 1109,
          supplierId: 'SUP-101'
        }
      ],
      subtotal: 2499,
      discount: 1500,
      shipping: 0,
      tax: 180,
      total: 2679,
      totalBuyCost: 1100,
      totalProfit: 1109,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      supplierStatus: {
        'SUP-101': { status: 'Delivered', trackingNumber: 'BD-884920', shippedAt: '2026-08-25T10:00:00Z', deliveredAt: '2026-08-27T16:30:00Z' }
      },
      trackingNumber: 'BD-884920',
      createdAt: '2026-08-24T14:30:00Z',
      updatedAt: '2026-08-27T16:30:00Z'
    },
    {
      id: 'ORD-94802',
      customerId: 'CUST-102',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@yahoo.com',
      customerPhone: '+91 98211 99887',
      shippingAddress: {
        house: 'B-14 Gokul Dham',
        area: 'SG Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pin: '380054',
        country: 'India'
      },
      items: [
        {
          productId: 'PROD-102',
          variantId: 'V1',
          name: 'ZenFit Smartwatch Ultra AMOLED (Starlight Silver)',
          sku: 'ZF-SLV',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          qty: 1,
          mrp: 5999,
          sellingPrice: 3299,
          buyPrice: 1550,
          shippingCost: 90,
          platformFee: 50,
          tax: 250,
          profit: 1359,
          supplierId: 'SUP-102'
        }
      ],
      subtotal: 3299,
      discount: 2700,
      shipping: 0,
      tax: 250,
      total: 3549,
      totalBuyCost: 1550,
      totalProfit: 1359,
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      supplierStatus: {
        'SUP-102': { status: 'Shipped', trackingNumber: 'DTDC-774192', shippedAt: '2026-08-28T09:00:00Z', deliveredAt: null }
      },
      trackingNumber: 'DTDC-774192',
      createdAt: '2026-08-27T11:15:00Z',
      updatedAt: '2026-08-28T09:00:00Z'
    },
    {
      id: 'ORD-94803',
      customerId: 'CUST-103',
      customerName: 'Ananya Sen',
      customerEmail: 'ananya.sen@outlook.com',
      customerPhone: '+91 97112 33445',
      shippingAddress: {
        house: '12 Park Street, Flat 3B',
        area: 'Park Street',
        city: 'Kolkata',
        state: 'West Bengal',
        pin: '700016',
        country: 'India'
      },
      items: [
        {
          productId: 'PROD-103',
          variantId: null,
          name: 'Aura Ambient RGB Desk Lamp',
          sku: 'AU-RGB-03',
          image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80',
          qty: 1,
          mrp: 2999,
          sellingPrice: 1899,
          buyPrice: 850,
          shippingCost: 80,
          platformFee: 30,
          tax: 140,
          profit: 799,
          supplierId: 'SUP-103'
        }
      ],
      subtotal: 1899,
      discount: 1100,
      shipping: 0,
      tax: 140,
      total: 2039,
      totalBuyCost: 850,
      totalProfit: 799,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      supplierStatus: {
        'SUP-103': { status: 'Accepted', trackingNumber: '', shippedAt: null, deliveredAt: null }
      },
      trackingNumber: '',
      createdAt: '2026-08-28T18:00:00Z',
      updatedAt: '2026-08-29T08:00:00Z'
    }
  ]
};

// Database Service API
const ZenDB = {
  // Storage Initialization
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      console.log('⚡ Initializing Zen Store local database seed data...');
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_SEED_DATA.products));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_SEED_DATA.orders));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SEED_DATA.suppliers));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_SEED_DATA.categories));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_SEED_DATA.users));
    }
  },

  // Helper getters & setters
  _get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Storage Read Error:', e);
      return [];
    }
  },

  _set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage Write Error:', e);
      return false;
    }
  },

  // ================= PRODUCTS API =================
  getProducts() {
    return this._get(STORAGE_KEYS.PRODUCTS);
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  getProductBySlug(slug) {
    const products = this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  },

  saveProduct(productData) {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...productData, updatedAt: new Date().toISOString() };
    } else {
      const newProduct = {
        id: productData.id || 'PROD-' + Math.floor(1000 + Math.random() * 9000),
        status: 'Active',
        rating: 5.0,
        reviewsCount: 0,
        createdAt: new Date().toISOString(),
        ...productData
      };
      products.unshift(newProduct);
    }

    this._set(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this._set(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  // ================= ORDERS API =================
  getOrders() {
    return this._get(STORAGE_KEYS.ORDERS);
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
      // Check if order contains items supplied by this supplier
      return o.items && o.items.some(item => item.supplierId === supplierId);
    });
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      orderStatus: 'Pending',
      supplierStatus: {},
      trackingNumber: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };

    // Initialize supplierStatus for each supplier in the order
    if (newOrder.items) {
      newOrder.items.forEach(item => {
        if (item.supplierId && !newOrder.supplierStatus[item.supplierId]) {
          newOrder.supplierStatus[item.supplierId] = {
            status: 'Pending',
            trackingNumber: '',
            shippedAt: null,
            deliveredAt: null
          };
        }
      });
    }

    orders.unshift(newOrder);
    this._set(STORAGE_KEYS.ORDERS, orders);

    // Update Product Stock Levels
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.qty);
      }
    });
    this._set(STORAGE_KEYS.PRODUCTS, products);

    return newOrder;
  },

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      if (status === 'Paid') order.paymentStatus = 'Paid';
      this._set(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  updateSupplierFulfillment(orderId, supplierId, updateObj) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order && order.supplierStatus[supplierId]) {
      order.supplierStatus[supplierId] = {
        ...order.supplierStatus[supplierId],
        ...updateObj
      };

      if (updateObj.trackingNumber) {
        order.trackingNumber = updateObj.trackingNumber;
      }

      // Propagate supplier status to overall order status
      if (updateObj.status === 'Shipped') {
        order.orderStatus = 'Shipped';
      } else if (updateObj.status === 'Delivered') {
        order.orderStatus = 'Delivered';
        order.paymentStatus = 'Paid';
      } else if (updateObj.status === 'Accepted' && order.orderStatus === 'Pending') {
        order.orderStatus = 'Processing';
      }

      order.updatedAt = new Date().toISOString();
      this._set(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  // ================= SUPPLIERS API =================
  getSuppliers() {
    return this._get(STORAGE_KEYS.SUPPLIERS);
  },

  getSupplierById(id) {
    const suppliers = this.getSuppliers();
    return suppliers.find(s => s.id === id) || null;
  },

  saveSupplier(supplierData) {
    const suppliers = this.getSuppliers();
    const idx = suppliers.findIndex(s => s.id === supplierData.id);
    if (idx >= 0) {
      suppliers[idx] = { ...suppliers[idx], ...supplierData };
    } else {
      const newSup = {
        id: 'SUP-' + Math.floor(100 + Math.random() * 900),
        status: 'Active',
        rating: 5.0,
        totalPayout: 0,
        ...supplierData
      };
      suppliers.push(newSup);
    }
    this._set(STORAGE_KEYS.SUPPLIERS, suppliers);
    return true;
  },

  // ================= CATEGORIES API =================
  getCategories() {
    return this._get(STORAGE_KEYS.CATEGORIES);
  },

  // ================= USERS API =================
  getUsers() {
    return this._get(STORAGE_KEYS.USERS);
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
      ...userData
    };
    users.push(newUser);
    this._set(STORAGE_KEYS.USERS, users);
    return { success: true, user: newUser };
  },

  // ================= CART API =================
  getCart() {
    return this._get(STORAGE_KEYS.CART);
  },

  saveCart(cartItems) {
    this._set(STORAGE_KEYS.CART, cartItems);
  },

  clearCart() {
    this._set(STORAGE_KEYS.CART, []);
  }
};

// Initialize DB immediately
ZenDB.init();
