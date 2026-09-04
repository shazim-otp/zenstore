/* ==========================================================================
   Zen Store - Supabase Client Initialization & Helper Service
   ========================================================================== */

let _supabaseInstance = null;

const SupabaseClientService = {
  isConfigured() {
    return (
      typeof CONFIG !== 'undefined' &&
      CONFIG.SUPABASE_URL &&
      CONFIG.SUPABASE_ANON_KEY &&
      CONFIG.SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
      CONFIG.SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
    );
  },

  getClient() {
    if (!this.isConfigured()) {
      return null;
    }

    if (!_supabaseInstance && typeof supabase !== 'undefined' && supabase.createClient) {
      try {
        _supabaseInstance = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        console.log('[Supabase] Client initialized successfully.');
      } catch (e) {
        console.error('Supabase Initialization Error:', e);
      }
    }

    return _supabaseInstance;
  }
};
