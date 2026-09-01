/**
 * security.js
 * Implements content protection measures for the website.
 */

function initSecurity() {
  // 1. Disable Right-Click (Context Menu)
  document.addEventListener('contextmenu', (e) => {
    // Only prevent on images, videos, and the whole body if preferred
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.closest('.gallery-item')) {
      e.preventDefault();
      // Optional: Show the security modal instead of context menu
      const modal = document.getElementById('security-modal');
      if (modal && typeof window.openSecurityModal === 'function') {
        window.openSecurityModal();
      }
    }
  });

  // 2. Prevent Common Shortcut Keys
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+S, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+P
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (isCmdOrCtrl && (key === 's' || key === 'u' || key === 'p')) {
      e.preventDefault();
    }

    if (isCmdOrCtrl && e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) {
      e.preventDefault();
    }

    // Attempt to block PrintScreen (limited success, but helps)
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText(''); // Clear clipboard
      alert('Screenshots are restricted on this website for content protection.');
    }
  });

  // 3. Focus Loss Deterrent removed — caused blur glitch on mobile/webview page loads.
  // True screenshot detection on mobile browsers is not possible and this approach
  // triggered a visible blur during normal first-page-load on iOS/Android Instagram webview.

  // 4. Drag and Drop protection
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });

  // 4. Mobile Screenshot "Warning" (Simulated)
  // Note: True screenshot detection on mobile browsers is not possible.
  // We rely on the visual notices and other restrictions.
}

// Make openSecurityModal globally available
window.openSecurityModal = () => {
  const modal = document.getElementById('security-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurity);
} else {
  initSecurity();
}

// Support Astro view transitions
document.addEventListener('astro:page-load', initSecurity);
