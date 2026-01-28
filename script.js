/* ===== OPEN INVITATION ===== */
function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  cover.style.opacity = "0";
  cover.style.transform = "translateY(-40px)";

  setTimeout(() => {
    cover.style.display = "none";
    main.classList.remove("hidden");
    document.body.style.overflow = "auto";
  }, 1000);
}

document.body.style.overflow = "hidden";

const weddingDate = new Date("2026-02-09T10:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  const countdownEl = document.getElementById("countdown");

  if (diff <= 0) {
    countdownEl.innerText = "Hari Bahagia 💍";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  // 🔒 PAD DETIK BIAR SELALU 2 DIGIT
  const pad = n => String(n).padStart(2, "0");

  countdownEl.innerText =
    `${d}d ${h}h ${pad(m)}m ${pad(s)}s`;
}, 1000);


/* ===== RSVP ===== */
function kirimRSVP() {
  const nama = rsvpNama.value;
  const status = rsvpStatus.value;
  const jumlah = rsvpJumlah.value;
  const pesan = rsvpPesan.value;

  if (!nama || !status) {
    alert("Nama dan status wajib diisi");
    return;
  }

  const card = document.createElement("div");
  card.className = "ucapan-card";
  card.innerHTML = `
    <h4>${nama}</h4>
    <p><strong>Status:</strong> ${status}</p>
    ${jumlah ? `<p>Jumlah Tamu: ${jumlah}</p>` : ""}
    ${pesan ? `<p>${pesan}</p>` : ""}
  `;
  listRSVP.prepend(card);

  rsvpNama.value = rsvpStatus.value = rsvpJumlah.value = rsvpPesan.value = "";
}

/* ===== UCAPAN ===== */
function kirimUcapan() {
  const nama = document.getElementById("nama").value;
  const pesan = document.getElementById("pesan").value;

  if (!nama || !pesan) return alert("Nama dan ucapan wajib diisi");

  const card = document.createElement("div");
  card.className = "ucapan-card";
  card.innerHTML = `<h4>${nama}</h4><p>${pesan}</p>`;
  document.getElementById("listUcapan").prepend(card);

  document.getElementById("nama").value = "";
  document.getElementById("pesan").value = "";
}

/* ===== COPY REKENING ===== */
function copyRek() {
  navigator.clipboard.writeText("6862010115207530");
  alert("Nomor rekening berhasil disalin");
}


/* ===== SCROLL SECTION ANIMATION ===== */
const sections = document.querySelectorAll('.section-animate');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // animasi sekali aja
    }
  });
}, {
  threshold: 0.2
});

sections.forEach(section => observer.observe(section));


/* ===== rsvp ===== */

const RSVP_URL = "https://script.google.com/macros/s/AKfycbxuqizqoYWFdlxJZrXmpsgQzKi70XKoYjPGq40mq05bft_Ccu39LNooauB6F04xn_w4Fw/exec";

document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();

  const form = e.target;
  const status = document.getElementById("rsvpStatus");

  const data = new FormData();
  data.append("nama", form.nama.value);
  data.append("kehadiran", form.kehadiran.value);
  data.append("jumlah_tamu", form.jumlah_tamu.value);
  data.append("pesan", form.pesan.value);
  data.append("ua", navigator.userAgent);

  fetch(RSVP_URL, {
    method: "POST",
    body: data
  })
  .then(() => {
    status.innerText = "Terima kasih, konfirmasi terkirim 🙏";
    form.reset();
  })
  .catch(() => {
    status.innerText = "Gagal mengirim, coba lagi ya 🙏";
  });
});
