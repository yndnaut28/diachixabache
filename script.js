// Bảng từ đồng nghĩa
const synonyms = {
  "ủy ban nhân dân": ["ubnd"],
  "ubnd": ["ủy ban nhân dân"],
  "ủy": ["ubnd"],
  "ủy ban": ["ubnd"],
  "ủy ban nhân": ["ubnd"],
  "trạm y tế": ["trung tâm y tế", "yt"],
  "trung tâm y tế": ["trạm y tế", "yt"],
  "trường mầm non": ["mẫu giáo", "mn"],
  "mẫu giáo": ["trường mầm non", "mn"],
  "trung": ["THCS", "THPT", "TH&THCS"],
  "tiểu": ["TH&THCS"],
  "tiểu học": ["TH&THCS"],
  "trung học": ["THCS", "THPT", "TH&THCS"],
  "trung học cơ": ["THCS", "TH&THCS"],
  "trung học cơ sở": ["THCS", "TH&THCS"],
  "trung học phổ": ["THPT"],
  "trung học phổ thông": ["THPT"]
};

// Hàm chuẩn hóa chữ: thường + bỏ dấu
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}

// Hàm mở rộng từ khóa theo synonyms
function expandKeywords(keyword) {
  let expanded = [keyword];
  for (let key in synonyms) {
    let keyNorm = normalizeText(key);
    let synNorms = synonyms[key].map(s => normalizeText(s));
    if (keyword === keyNorm || synNorms.includes(keyword)) {
      expanded = expanded.concat([keyNorm, ...synNorms]);
    }
  }
  return [...new Set(expanded)]; // loại bỏ trùng
}

function filterCards() {
  let inputRaw = document.getElementById("searchInput").value.trim();
  let input = normalizeText(inputRaw);
  let filter = document.getElementById("filterSelect").value;
  let cards = Array.from(document.querySelectorAll(".card"));
  let noResult = document.getElementById("noResult");
  let container = document.querySelector(".card-container");

  let keywords = expandKeywords(input);
  let visibleCards = [];
  let hiddenCards = [];

  cards.forEach(card => {
    let title = normalizeText(card.querySelector("h3").textContent);
    let desc = normalizeText(card.querySelector("p").textContent);
    let type = card.getAttribute("data-type");

    let matchText = keywords.some(kw => title.includes(kw) || desc.includes(kw));
    let matchFilter = (filter === "all" || filter === type);

    if (matchText && matchFilter) {
      card.classList.remove("hidden");
      visibleCards.push(card);
    } else {
      card.classList.add("hidden");
      hiddenCards.push(card);
    }
  });

  if (visibleCards.length === 0) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";

    // Gom card khớp về đầu
    visibleCards.forEach(card => container.appendChild(card));
    hiddenCards.forEach(card => container.appendChild(card));

    // Highlight
    visibleCards.forEach(card => {
      card.classList.add("highlight");
      setTimeout(() => card.classList.remove("highlight"), 1200);
    });
  }
}

// Event listeners
document.getElementById("filterSelect").addEventListener("change", filterCards);
document.getElementById("searchInput").addEventListener("keyup", filterCards);



const slidesContainer = document.getElementById("slides");
if (slidesContainer) {
  const images = slidesContainer.querySelectorAll("img");
  const dotsContainer = document.getElementById("dots");
  let index = 0;
  let timer;

  // tạo dots
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => {
      showSlide(i);
      resetTimer();
    });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll("span").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function showSlide(i) {
    images.forEach(img => img.classList.remove("active"));
    index = (i + images.length) % images.length;
    images[index].classList.add("active");
    updateDots();
  }

  function nextSlide() {
    showSlide(index + 1);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 4000);
  }

  // khởi tạo
  showSlide(0);
  resetTimer();
}
