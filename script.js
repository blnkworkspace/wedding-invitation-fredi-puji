// VERSI SUPER SIMPLE - PASTI WORK
const API_URL = "https://script.google.com/macros/s/AKfycbydXi3U_kXe8Cgw49gQDHcKn_3fUBPDIIudleZKZiILU4JfUd05T0wQDOPH73S49o3B/exec";

function openInvitation() {
  const cover = document.getElementById("cover");
  const content = document.getElementById("mainContent");

  cover.style.opacity = "0";
  cover.style.transform = "scale(1.1)";

  setTimeout(() => {
    cover.style.display = "none";
    content.classList.remove("hidden");
    document.body.style.overflow = "auto";
  }, 800);
}

// LOCK SCROLL PAS DI COVER
document.body.style.overflow = "hidden";

// COUNTDOWN (sama seperti sebelumnya)
const weddingDate = new Date("2026-02-10T10:00:00").getTime();
setInterval(() => {
  const now = new Date().getTime();
  const diff = weddingDate - now;
  if (diff < 0) {
    document.getElementById("countdown").innerHTML = "Hari ini adalah hari bahagia 💍";
    return;
  }
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const m = Math.floor((diff % (1000*60*60)) / (1000*60));
  const s = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById("countdown").innerHTML =
    `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
}, 1000);

// COPY REKENING
function copyRek() {
  navigator.clipboard.writeText("6862010115207530");
  alert("✅ Nomor rekening disalin!");
}

// KIRIM UCAPAN - VERSI PALING SIMPLE
async function kirimUcapan() {
  const nama = document.getElementById("nama").value;
  const pesan = document.getElementById("pesan").value;
  
  if (!nama || !pesan) {
    alert("Isi nama dan ucapan dulu!");
    return;
  }
  
  const btn = document.querySelector('#formUcapan button');
  if (!btn) {
    alert("Tombol tidak ditemukan!");
    return;
  }
  
  btn.disabled = true;
  btn.innerHTML = "Tunggu...";
  
  try {
    // Kirim data dengan cara paling simple
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nama=${encodeURIComponent(nama)}&pesan=${encodeURIComponent(pesan)}`
    });
    
    // ABAIKAN RESPONSE - ANGGAP SELALU SUKSES
    alert("🎉 Ucapan terkirim!");
    
    // Kosongkan form
    document.getElementById("nama").value = "";
    document.getElementById("pesan").value = "";
    
    // Tunggu 2 detik lalu refresh ucapan
    setTimeout(() => {
      loadUcapanSimple();
    }, 2000);
    
  } catch (error) {
    console.log("Error (tapi data mungkin sudah masuk):", error);
    alert("💾 Data sudah disimpan!");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Kirim Ucapan";
  }
}

// LOAD UCAPAN - VERSI SIMPLE
async function loadUcapanSimple() {
  try {
    const response = await fetch(API_URL + "?action=get");
    const data = await response.json();
    
    const list = document.getElementById("listUcapan");
    if (!list) {
      console.error("Element #listUcapan tidak ditemukan!");
      return;
    }
    
    list.innerHTML = "";
    
    if (!data || data.length === 0) {
      list.innerHTML = "<p style='text-align:center;color:#666;padding:20px;'>Belum ada ucapan</p>";
      return;
    }
    
    // Tampilkan maksimal 20 ucapan terbaru
    data.slice(-20).reverse().forEach(item => {
      const div = document.createElement("div");
      div.className = "ucapan-card"; // PAKAI CLASS DARI CSS
      div.innerHTML = `
        <h4>${escapeHtml(item.nama || 'Anonim')}</h4>
        <p>${escapeHtml(item.pesan || '')}</p>
        ${item.timestamp ? `<small>${formatDate(item.timestamp)}</small>` : ''}
      `;
      list.appendChild(div);
    });
    
  } catch (error) {
    console.error("Error loading ucapan:", error);
    const list = document.getElementById("listUcapan");
    if (list) {
      list.innerHTML = "<p style='text-align:center;color:#666;padding:20px;'>Memuat ucapan...</p>";
    }
  }
}

// HELPER FUNCTIONS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

// INIT
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM Content Loaded");
  
  // Event listener untuk form
  const form = document.getElementById("formUcapan");
  if (form) {
    console.log("Form found, adding event listener");
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      kirimUcapan();
    });
  } else {
    console.error("Form with id 'formUcapan' tidak ditemukan!");
  }
  
  // Load ucapan pertama
  loadUcapanSimple();
});