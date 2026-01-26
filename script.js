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

/* ===== COUNTDOWN ===== */
const weddingDate = new Date("2026-02-09T10:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff < 0) {
    document.getElementById("countdown").innerHTML = "Hari Bahagia 💍";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML =
    `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
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
