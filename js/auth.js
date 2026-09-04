/* ==========================================================================
   Zen Store - Supabase Authentication & RBAC Router Guard
   ========================================================================== */

const Auth = {
  // Get currently logged-in user session
  getCurrentUser() {
    try {
      // 1. Check Supabase Auth active user if available
      if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
        const client = SupabaseClientService.getClient();
        if (client) {
          const supaUser = client.auth.user ? client.auth.user() : null;
          const session = client.auth.session ? client.auth.session() : null;
          
          if (supaUser) {
            const cached = localStorage.getItem(STORAGE_KEYS.SESSION);
            if (cached) return JSON.parse(cached);

            return {
              id: supaUser.id,
              name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0],
              email: supaUser.email,
              photo: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture || '',
              role: 'customer'
            };
          }
        }
      }

      // 2. Fallback session storage
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(user) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  // Customer Google Sign-In Integration via Supabase OAuth
  async loginWithGoogle() {
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + '/login.html'
            }
          });

          if (error) {
            Utils.showToast(error.message || 'Google sign in failed', 'error');
            return { success: false, message: error.message };
          }
          return { success: true };
        } catch (err) {
          console.error('Supabase Google Auth Error:', err);
        }
      }
    }

    // Graceful Notice when Supabase credentials are unconfigured
    Utils.showToast('Supabase is not configured yet. Please enter your SUPABASE_URL & SUPABASE_ANON_KEY in js/config.js', 'warning');
    return { success: false, unconfigured: true, message: 'Supabase unconfigured' };
  },

  // Standard Customer Email Login
  async loginCustomer(email, password) {
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          const dbUser = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: email,
            role: 'customer'
          };
          this.setSession(dbUser);
          Utils.showToast(`Welcome back, ${dbUser.name}!`, 'success');
          return { success: true, user: dbUser };
        }
      }
    }

    // Local DB fallback login
    const user = ZenDB.getUserByEmail(email);
    if (!user) return { success: false, message: 'No account found with this email address' };
    if (user.password !== password) return { success: false, message: 'Incorrect password' };

    this.setSession(user);
    Utils.showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
  },

  // Dedicated Supplier Login (Username & Password via Supabase Auth)
  async loginSupplier(usernameOrEmail, password) {
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          const { data, error } = await client.auth.signInWithPassword({ email: usernameOrEmail, password });
          if (!error && data.user) {
            const dbUser = {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || 'Supplier Partner',
              email: usernameOrEmail,
              role: 'supplier',
              supplierId: 'SUP-101'
            };
            this.setSession(dbUser);
            Utils.showToast(`Supplier Signed In: ${dbUser.name}`, 'success');
            return { success: true, user: dbUser };
          }
        } catch (e) {
          console.warn('Supabase Auth warning:', e);
        }
      }
    }

    // Local DB supplier fallback login
    const users = ZenDB.getUsers();
    const user = users.find(u => 
      u.role === 'supplier' && 
      (u.email.toLowerCase() === usernameOrEmail.toLowerCase() || (u.username && u.username.toLowerCase() === usernameOrEmail.toLowerCase()))
    );

    if (!user) return { success: false, message: 'Supplier account not found' };
    if (user.password !== password) return { success: false, message: 'Invalid supplier password' };

    this.setSession(user);
    Utils.showToast(`Supplier Portal Signed In: ${user.name}`, 'success');
    return { success: true, user };
  },

  // Dedicated Owner/Admin Login (Username & Password via Supabase Auth)
  async loginOwner(usernameOrEmail, password) {
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) {
        try {
          const { data, error } = await client.auth.signInWithPassword({ email: usernameOrEmail, password });
          if (!error && data.user) {
            const dbUser = {
              id: data.user.id,
              name: 'Zen Owner',
              email: usernameOrEmail,
              role: 'admin'
            };
            this.setSession(dbUser);
            Utils.showToast(`Welcome Owner Dashboard: ${dbUser.name}`, 'success');
            return { success: true, user: dbUser };
          }
        } catch (e) {
          console.warn('Supabase Auth warning:', e);
        }
      }
    }

    // Local DB owner fallback login
    const users = ZenDB.getUsers();
    const user = users.find(u => 
      (u.role === 'admin' || u.role === 'owner') && 
      (
        u.email.toLowerCase() === usernameOrEmail.toLowerCase() || 
        (u.username && u.username.toLowerCase() === usernameOrEmail.toLowerCase()) || 
        usernameOrEmail.toLowerCase() === 'admin' || 
        usernameOrEmail.toLowerCase() === 'zeni'
      )
    );

    if (!user) return { success: false, message: 'Owner / Admin account not found' };
    if (user.password !== password) return { success: false, message: 'Invalid admin password' };

    this.setSession(user);
    Utils.showToast(`Welcome Owner Dashboard: ${user.name}`, 'success');
    return { success: true, user };
  },

  // Register Customer
  register(name, email, password, phone = '', address = '') {
    const res = ZenDB.createUser({ name, email, password, phone, address });
    if (res.success) {
      this.setSession(res.user);
      Utils.showToast('Customer account created successfully!', 'success');
    }
    return res;
  },

  // Logout method
  async logout() {
    if (typeof SupabaseClientService !== 'undefined' && SupabaseClientService.isConfigured()) {
      const client = SupabaseClientService.getClient();
      if (client) await client.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    Utils.showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 500);
  },

  // Guard protected routes based on allowed roles ('customer', 'supplier', 'admin'/'owner')
  requireRole(allowedRoles) {
    const user = this.getCurrentUser();

    if (!user) {
      Utils.showToast('Please log in to access this portal', 'warning');
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin')) {
        window.location.href = '/admin-login.html';
      } else if (currentPath.includes('/supplier')) {
        window.location.href = '/supplier-login.html';
      } else {
        window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
      }
      return false;
    }

    const normalizedRole = (user.role === 'owner') ? 'admin' : user.role;
    const normalizedAllowed = allowedRoles.map(r => r === 'owner' ? 'admin' : r);

    if (!normalizedAllowed.includes(normalizedRole)) {
      Utils.showToast('Access denied: Unauthorized role portal', 'error');
      if (user.role === 'admin' || user.role === 'owner') window.location.href = '/admin/index.html';
      else if (user.role === 'supplier') window.location.href = '/supplier/index.html';
      else window.location.href = '/index.html';
      return false;
    }

    return true;
  },

  // Update UI navbar user info dynamically
  updateNavbarUI() {
    const user = this.getCurrentUser();
    const accountBtn = document.getElementById('header-account-btn');

    if (accountBtn) {
      if (user) {
        accountBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.5rem;" title="${user.name} (${user.role})">
            ${user.photo ? `<img src="${user.photo}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">` : `
              <div style="width:28px; height:28px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">
                ${user.name.charAt(0).toUpperCase()}
              </div>
            `}
            <span>${user.name.split(' ')[0]}</span>
          </div>
        `;
        accountBtn.href = (user.role === 'admin' || user.role === 'owner') ? '/admin/index.html' : user.role === 'supplier' ? '/supplier/index.html' : '/orders.html';
      } else {
        accountBtn.href = '/login.html';
      }
    }
  }
};
