/* ==========================================================================
   Zen Store - Global Utility Functions
   Currency Formatter (₹), Toast System, Modal Helper, SVG Charts, Base64 Image Reader
   ========================================================================== */

const Utils = {
  // Format number as Indian Rupee (₹ INR)
  formatINR(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  },

  // Format percentage
  formatPercent(val) {
    const num = Number(val) || 0;
    return num.toFixed(2) + '%';
  },

  // Toast Notification System
  showToast(message, type = 'info', title = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" style="display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
      error: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" style="display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      warning: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" style="display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      info: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" style="display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };

    const titles = {
      success: title || 'Success',
      error: title || 'Error',
      warning: title || 'Warning',
      info: title || 'Notice'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <div class="toast-close" onclick="this.parentElement.remove()">&times;</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Modal Dialog Handler
  openModal(title, bodyHTML, footerHTML = '', sizeClass = '') {
    this.closeModal(); // close existing if any

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'zen-modal-backdrop';

    backdrop.innerHTML = `
      <div class="modal-card ${sizeClass}">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="btn-icon" onclick="Utils.closeModal()">&times;</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    `;

    document.body.appendChild(backdrop);
    setTimeout(() => backdrop.classList.add('active'), 10);
  },

  closeModal() {
    const modal = document.getElementById('zen-modal-backdrop');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 250);
    }
  },

  // Debounce Function
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // File to Base64 Data URL Converter
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Format Date String
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  },

  // Render SVG Line Chart (Pure Vanilla)
  renderSVGLineChart(containerId, dataPoints, labels, strokeColor = '#4F46E5') {
    const container = document.getElementById(containerId);
    if (!container || !dataPoints || dataPoints.length === 0) return;

    const width = container.clientWidth || 500;
    const height = 240;
    const padding = 30;

    const maxVal = Math.max(...dataPoints, 100);
    const minVal = 0;

    const points = dataPoints.map((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const fillPoints = `${padding},${height - padding} ` + points + ` ${width - padding},${height - padding}`;

    let dots = '';
    dataPoints.forEach((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      dots += `<circle cx="${x}" cy="${y}" r="5" fill="${strokeColor}" stroke="#FFFFFF" stroke-width="2"><title>${labels[idx]}: ₹${val}</title></circle>`;
    });

    container.innerHTML = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <polygon points="${fillPoints}" fill="url(#chartGrad)" />
        <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" />
        ${dots}
      </svg>
    `;
  }
};
