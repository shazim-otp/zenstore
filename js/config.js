/* ==========================================================================
   Zen Store - Central Configuration & Environment Settings
   ========================================================================== */

const CONFIG = {
  // Store Branding & Identity
  STORE_NAME: "Zen Store",

  // Central WhatsApp Business Number for Order Placement (Country code + Phone)
  // Example: "919876543210" for India +91 98765 43210
  STORE_WHATSAPP_NUMBER: "918129991353",

  // Localized Currency Settings
  CURRENCY: "INR",
  CURRENCY_SYMBOL: "₹",

  // Payment Feature Flags
  // Set to false to disable web payments and mandate WhatsApp order placement
  PAYMENT_ENABLED: false,

  // Customer Authentication Settings
  GOOGLE_LOGIN_ENABLED: true,

  // Supabase Backend Credentials (Cloud PostgreSQL, RLS, Auth & Sync)
  SUPABASE_URL: "https://mwnjbkfzrgvampjtbolb.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bmpia2Z6cmd2YW1wanRib2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTY2ODMsImV4cCI6MjEwNDA3MjY4M30.VUml58wE81bQPG59qx89Si3CqNqpolOHpUbYyWW2nkU",

  // Firebase Authentication & Google OAuth Credentials
  FIREBASE: {
    apiKey: "AIzaSyBqueeZ9rpClt24N9m_Y-v8Cc0j9dkBuM4",
    authDomain: "zenstore-8368b.firebaseapp.com",
    projectId: "zenstore-8368b",
    storageBucket: "zenstore-8368b.firebasestorage.app",
    messagingSenderId: "920832527851",
    appId: "1:920832527851:web:927420c8da9ea8329addae",
    measurementId: "G-2FJRCM0WFQ"
  }
};
