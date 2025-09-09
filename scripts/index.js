// scripts/index.js
const categoryListEl = document.getElementById("categoryList");
const contentEl = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

// 카테고리 추출 (영문 경로 유지, UI에는 한글 표시)
const categories = [...new Set(iconsData.map((icon) => icon.catEng))];

// 사이드바 카테고리 렌더링
categories.forEach((catEng) => {
  const icon = iconsData.find((i) => i.catEng === catEng);
  const li = document.createElement("li");
  li.textContent = icon.catEng;
  li.addEventListener("click", () => {
    searchInput.value = "";
    renderIcons(catEng);
    setActiveCategory(catEng);
  });
  categoryListEl.appendChild(li);
});

// 사이드바 카테고리 활성화
function setActiveCategory(catEng) {
  document.querySelectorAll(".sidebar li").forEach((li) => {
    li.classList.toggle(
      "active",
      iconsData.find((i) => i.catEng === catEng)?.catEng === li.textContent
    );
  });
}

// 아이콘 렌더링
function renderIcons(filterCategory = null, searchTerm = "") {
  contentEl.innerHTML = "";
  const filteredData = iconsData.filter((icon) => {
    const matchCategory = filterCategory
      ? icon.catEng === filterCategory
      : true;
    const matchSearch = searchTerm
      ? icon.nameKor.includes(searchTerm) || icon.nameEng.includes(searchTerm)
      : true;
    return matchCategory && matchSearch;
  });

  const groupedByCategory = {};
  filteredData.forEach((icon) => {
    if (!groupedByCategory[icon.catKor]) groupedByCategory[icon.catKor] = [];
    groupedByCategory[icon.catKor].push(icon);
  });

  Object.keys(groupedByCategory).forEach((catKor) => {
    const catDiv = document.createElement("div");
    catDiv.className = "category-group";
    catDiv.innerHTML = `<h3>${catKor}</h3>`;
    const grid = document.createElement("div");
    grid.className = "icon-grid";

    groupedByCategory[catKor].forEach((icon) => {
      const img = document.createElement("img");
      img.src = `images/${icon.catEng}/${icon.nameEng}/1.png`; // 경로 영문화
      img.loading = "lazy";

      const card = document.createElement("div");
      card.className = "icon-card";
      card.appendChild(img);

      card.addEventListener("click", () => {
        const url = `/${icon.catEng}/${icon.nameEng}`;
        window.location.href = url;
      });

      grid.appendChild(card);
    });

    catDiv.appendChild(grid);
    contentEl.appendChild(catDiv);
  });
}

// 초기 렌더
renderIcons();

// 검색 기능
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim();
  document
    .querySelectorAll(".sidebar li")
    .forEach((li) => li.classList.remove("active"));
  renderIcons(null, term);
});
