/* ======================================================
   OPEN INVITATION (COVER → MAIN)
====================================================== */
function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicToggle");

  // play music (allowed by user gesture)
  if (music) {
    music.volume = 0.6;
    music.play().catch(() => {});
    if (musicBtn) musicBtn.classList.remove("hidden");
  }

  // fade out cover
  cover.style.opacity = "0";
  cover.style.pointerEvents = "none";

  setTimeout(() => {
    cover.style.display = "none";
    main.classList.remove("hidden");

    // pastikan masuk ke awal undangan
    window.scrollTo({ top: 0 });

    document.body.style.overflow = "auto";
  }, 600);
}

/* ======================================================
   MUSIC TOGGLE
====================================================== */
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = "🔊";
    } else {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
    }
  });
}

/* ======================================================
   COUNTDOWN
====================================================== */
const weddingDate = new Date("2026-02-10T10:00:00").getTime();
const countdownEl = document.getElementById("countdown");

setInterval(() => {
  if (!countdownEl) return;

  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "Hari Bahagia 💍";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdownEl.textContent =
    `${d}d ${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
}, 1000);


/* ======================================================
   SCROLL ANIMATION (SECTION)
====================================================== */
const sections = document.querySelectorAll(".section-animate");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach(sec => observer.observe(sec));

/* ======================================================
   COPY REKENING
====================================================== */
function copyRek() {
  navigator.clipboard.writeText("6862010115207530");
  alert("Nomor rekening berhasil disalin");
}

/* ======================================================
   RSVP (GOOGLE APPS SCRIPT)
====================================================== */
const RSVP_API = "https://script.google.com/macros/s/AKfycbx3ZvJQD1ERZv4Y5Jvpz5UxvW3AYJd5D0w7evRWWZ_3dnZw_FpU3Vb2SIVVBTjy4Isg_Q/exec";

const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("rsvpStatus");
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";
    status.textContent = "Mengirim konfirmasi...";
    status.style.color = "blue";

    const formData = new FormData(rsvpForm);
    formData.append("ua", navigator.userAgent);

    try {
      await fetch(RSVP_API, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      status.innerHTML = "✅ <strong>Terima kasih!</strong><br>Konfirmasi berhasil dikirim 🙏";
      status.style.color = "green";
      rsvpForm.reset();

    } catch {
      status.innerHTML = "❌ <strong>Gagal mengirim</strong><br>Silakan coba lagi";
      status.style.color = "red";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Konfirmasi";
    }
  });
}

/* ===== ucapan ===== */
const API_URL = "https://script.google.com/macros/s/AKfycbwOvihcVv1mVKiSB2Ps3vF_lCNOY7z5i3f3ZDpof9FXyF5Xgou10QLgvRDgZ83_d3ir/exec";

// ========== UCAPAN SYSTEM ==========
class UcapanSystem {
  constructor() {
    this.isSubmitting = false;
    this.init();
  }
  
  init() {
    console.log('🚀 Ucapan System Initialized');
    
    // Setup form
    const form = document.getElementById('formUcapan');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Load initial messages
    this.loadUcapan();
    
    // Auto-refresh every 30 seconds
    setInterval(() => this.loadUcapan(), 30000);
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    const nama = document.getElementById('nama').value.trim();
    const pesan = document.getElementById('pesan').value.trim();
    
    // Validation
    if (!nama) {
      this.showAlert('📝 Harap isi nama Anda', 'error');
      return;
    }
    
    if (!pesan) {
      this.showAlert('💭 Harap tulis ucapan Anda', 'error');
      return;
    }
    
    // Submit
    await this.kirimUcapan(nama, pesan);
  }
  
  async kirimUcapan(nama, pesan) {
    this.isSubmitting = true;
    this.setButtonLoading(true);
    
    try {
      // Prepare data
      const formData = new URLSearchParams();
      formData.append('nama', nama);
      formData.append('pesan', pesan);
      
      console.log('📤 Mengirim ucapan:', { nama, pesan });
      
      // Send request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      // Parse response
      const result = await response.json();
      
      if (result.success) {
        // Success
        this.showAlert('🎉 Ucapan berhasil dikirim!', 'success');
        
        // Clear form
        document.getElementById('nama').value = '';
        document.getElementById('pesan').value = '';
        
        // Reload messages
        setTimeout(() => this.loadUcapan(), 1500);
        
      } else {
        throw new Error(result.error || 'Gagal mengirim ucapan');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      
      // Fallback: try simple method
      await this.tryFallbackMethod(nama, pesan);
      
    } finally {
      this.isSubmitting = false;
      this.setButtonLoading(false);
    }
  }
  
  async tryFallbackMethod(nama, pesan) {
    try {
      // Simple GET method as fallback
      const url = `${API_URL}?nama=${encodeURIComponent(nama)}&pesan=${encodeURIComponent(pesan)}`;
      await fetch(url, { method: 'POST' });
      
      this.showAlert('✅ Ucapan berhasil dikirim!', 'success');
      setTimeout(() => this.loadUcapan(), 1500);
      
    } catch (fallbackError) {
      this.showAlert('⚠️ Gagal mengirim. Coba refresh halaman.', 'error');
    }
  }
  
  async loadUcapan() {
    const container = document.getElementById('listUcapan');
    if (!container) return;
    
    try {
      // Show loading
      container.innerHTML = `
        <div class="ucapan-loading">
          <p>Memuat ucapan...</p>
        </div>
      `;
      
      // Fetch data
      const response = await fetch(`${API_URL}?t=${Date.now()}`);
      const data = await response.json();
      
      // Check for errors
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Render messages
      this.renderUcapan(data);
      
    } catch (error) {
      console.error('❌ Gagal memuat ucapan:', error);
      
      container.innerHTML = `
        <div class="ucapan-error">
          <p>⚠️ Gagal memuat ucapan</p>
          <button onclick="ucapanSystem.loadUcapan()" class="retry-btn">
            Coba Lagi
          </button>
        </div>
      `;
    }
  }
  
  renderUcapan(data) {
    const container = document.getElementById('listUcapan');
    if (!container) return;
    
    // Check if empty
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="ucapan-empty">
          <p>📝 Belum ada ucapan</p>
          <p>Jadilah yang pertama memberi ucapan!</p>
        </div>
      `;
      return;
    }
    
    // Get last 20 messages, newest first
    const messages = data.slice(-20).reverse();
    
    // Create HTML
    const html = messages.map(item => this.createUcapanCard(item)).join('');
    container.innerHTML = html;
  }
  
  createUcapanCard(item) {
    const time = this.formatDate(item.timestamp);
    const nama = this.escapeHtml(item.nama || 'Anonim');
    const pesan = this.escapeHtml(item.pesan || '');
    
    return `
      <div class="ucapan-card">
        <div class="ucapan-header">
          <h4 class="ucapan-nama">${nama}</h4>
          <span class="ucapan-time">${time}</span>
        </div>
        <div class="ucapan-body">
          <p class="ucapan-text">${pesan}</p>
        </div>
      </div>
    `;
  }
  
  // Helper methods
  setButtonLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? 
      '⏳ Mengirim...' : 
      'Kirim Ucapan';
  }
  
  showAlert(message, type = 'info') {
    // Create notification
    const alert = document.createElement('div');
    alert.className = `ucapan-alert ucapan-alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 6px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove
    setTimeout(() => {
      alert.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => alert.remove(), 300);
    }, 3000);
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
  
  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      // Format berdasarkan waktu
      if (diff < 60000) return 'Baru saja';
      if (diff < 3600000) return `${Math.floor(diff/60000)} menit lalu`;
      if (diff < 86400000) return `${Math.floor(diff/3600000)} jam lalu`;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    } catch {
      return '';
    }
  }
}

// Initialize
let ucapanSystem;
document.addEventListener('DOMContentLoaded', () => {
  ucapanSystem = new UcapanSystem();
});



/* ======================================================
   PARALLAX FOTO COUPLE (SINGLE SOURCE)
====================================================== */
window.addEventListener("scroll", () => {
  const photo = document.querySelector(".couple-photo-landscape img");
  if (!photo) return;

  const rect = photo.getBoundingClientRect();
  const winH = window.innerHeight;

  if (rect.top < winH && rect.bottom > 0) {
    const offset = (rect.top - winH / 2) * 0.04;
    photo.style.transform = `translateY(${offset}px) scale(1.04)`;
  }
});

/* ======================================================
   GALERY
====================================================== */
 const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("galleryModalImg");

  document.querySelectorAll(".gallery-grid img").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.remove("hidden");
    });
  });

  modal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });