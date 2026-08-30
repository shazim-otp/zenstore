/* ==========================================================================
   Zen Store - Authentication & RBAC Router Guard
   Customer, Admin, and Supplier Session Management
   ========================================================================== */

const Auth = {
  // Get currently logged-in user
  getCurrentUser() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  // Login method
  login(email, password) {
    const user = ZenDB.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No account found with this email address' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    // Save active session
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    Utils.showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
  },

  // One-click Demo Login for fast testing
  demoLogin(role) {
    let email = 'admin@zenstore.com';
    let pass = 'admin123';

    if (role === 'supplier') {
      email = 'supplier1@techcraft.in';
      pass = 'supplier123';
    } else if (role === 'customer') {
      email = 'rahul.sharma@gmail.com';
      pass = 'user123';
    }

    const res = this.login(email, pass);
    if (res.success) {
      if (role === 'admin') window.location.href = '/admin/index.html';
      else if (role === 'supplier') window.location.href = '/supplier/index.html';
      else window.location.href = '/index.html';
    }
  },

  // Register Customer
  register(name, email, password, phone = '', address = '') {
    const res = ZenDB.createUser({ name, email, password, phone, address });
    if (res.success) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(res.user));
      Utils.showToast('Account created successfully!', 'success');
    }
    return res;
  },

  // Logout method
  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    Utils.showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 500);
  },

  // Guard protected routes based on allowed roles
  requireRole(allowedRoles) {
    const user = this.getCurrentUser();

    if (!user) {
      Utils.showToast('Please log in to access this page', 'warning');
      window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }

    if (!allowedRoles.includes(user.role)) {
      Utils.showToast('Access denied: Unauthorized role', 'error');
      if (user.role === 'admin') window.location.href = '/admin/index.html';
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
    const mobileAccountBtn = document.getElementById('mobile-nav-account');

    if (accountBtn) {
      if (user) {
        accountBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.5rem;" title="${user.name} (${user.role})">
            <div style="width:28px; height:28px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <span>${user.name.split(' ')[0]}</span>
          </div>
        `;
        accountBtn.href = user.role === 'admin' ? '/admin/index.html' : user.role === 'supplier' ? '/supplier/index.html' : '/orders.html';
      } else {
        accountBtn.href = '/login.html';
      }
    }
  }
};
