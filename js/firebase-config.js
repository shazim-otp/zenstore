/* ==========================================================================
   Zen Store - Firebase Authentication & Google OAuth Service
   ========================================================================== */

const FirebaseAuthService = {
  isConfigured() {
    return (
      typeof CONFIG !== 'undefined' &&
      CONFIG.FIREBASE &&
      CONFIG.FIREBASE.apiKey &&
      CONFIG.FIREBASE.apiKey !== "YOUR_FIREBASE_API_KEY"
    );
  },

  init() {
    if (!this.isConfigured()) {
      console.log('[Firebase] Auth is unconfigured. Set CONFIG.FIREBASE credentials in js/config.js.');
      return false;
    }

    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(CONFIG.FIREBASE);
      console.log('[Firebase] Authentication initialized successfully.');
      return true;
    }
    return typeof firebase !== 'undefined' && firebase.apps.length > 0;
  },

  async loginWithGoogle() {
    if (!this.isConfigured()) {
      return {
        success: false,
        unconfigured: true,
        message: "Google Login is not configured yet. Please enter your Firebase API key in js/config.js."
      };
    }

    if (typeof firebase === 'undefined' || !firebase.auth) {
      return {
        success: false,
        message: "Firebase SDK not loaded. Check network or script imports."
      };
    }

    try {
      this.init();
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;

      return {
        success: true,
        profile: {
          googleId: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photo: user.photoURL || '',
          phone: user.phoneNumber || ''
        }
      };
    } catch (error) {
      console.error('Firebase Google Sign-In Error:', error);
      return {
        success: false,
        message: error.message || 'Google Sign-In failed.'
      };
    }
  }
};
