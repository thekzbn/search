const input = document.querySelector(".search-input");
const searchBox = document.querySelector(".search-box");
const engineSelect = document.querySelector(".search-engine");
const submitBtn = document.querySelector(".submit-btn");
const shortcutKeys = document.querySelectorAll(".shortcut .key");
const suggestionsDropdown = document.getElementById("suggestionsDropdown");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const searchCountEl = document.getElementById("searchCount");
const historyBtn = document.querySelector(".history-btn");
const historyBackdrop = document.getElementById("historyBackdrop");

const isMac = navigator.platform.toUpperCase().includes("MAC");
shortcutKeys[0].textContent = isMac ? "⌘" : "Ctrl";

let currentSuggestionIndex = -1;
let suggestions = [];
let searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
let searchCount = parseInt(localStorage.getItem("searchCount") || "0");
let suggestionTimeout;

updateSearchCount();
updateHistoryDisplay();
updateSubmitButton();

function updateSubmitButton() {
    const engine = engineSelect.value;
    const config = {
        "google-web": { icon: "<i class='bx bxl-google'></i>", color: "#4285F4" },
        "google-images": { icon: "<i class='bx bxl-google'></i>", color: "#4285F4" },
        "youtube": { icon: "<i class='bx bxl-youtube'></i>", color: "#FF0000" },
        "claude": { icon: "<i class='bx bx-robot'></i>", color: "#F28C38" },
        "claude-docs": { icon: "<i class='bx bx-book-content'></i>", color: "#F28C38" },
        "claude-projects": { icon: "<i class='bx bx-folder'></i>", color: "#F28C38" },
        "perplexity": { icon: "<i class='bx bx-brain'></i>", color: "#00A699" },
        "searchgpt": { icon: "<i class='bx bxs-gift'></i>", color: "#10A37F" },
        "bing": { icon: "<i class='bx bxl-microsoft'></i>", color: "#008373" },
        "duckduckgo": { 
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#DE5833"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#FFFFFF"/>
            </svg>`, 
            color: "#DE5833" 
        },
        "yahoo": { icon: "<i class='bx bxl-yahoo'></i>", color: "#410093" },
        "yandex": { 
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 9.5V20h20V9.5L12 2zm0 2.24L19.5 10v8H4.5v-8L12 4.24z" fill="#FFCC00"/>
                <path d="M12 8l-6 6h12l-6-6z" fill="#FFFFFF"/>
            </svg>`, 
            color: "#FFCC00" 
        }
    };
    submitBtn.innerHTML = config[engine].icon;
    submitBtn.style.backgroundColor = config[engine].color;
}

engineSelect.addEventListener("change", updateSubmitButton);

async function fetchGoogleSuggestions(query) {
    const proxy = 'https://corsproxy.io/?';
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    try {
        const res = await fetch(proxy + url);
        const data = await res.json();
        return data[1].slice(0, 5);
    } catch (err) {
        console.warn("Google suggestions failed:", err);
        return [];
    }
}

async function showSuggestions(query) {
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', 'suggestionsDropdown');

    const apiSuggestions = await fetchGoogleSuggestions(query);
    const historySuggestions = searchHistory
        .filter(item => item.query.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(item => ({
            text: item.query,
            type: "history",
            icon: "🕒",
            action: () => {
                input.value = item.query;
                engineSelect.value = item.engine;
                updateSubmitButton();
                performSearch();
            }
        }));
    
    const quickSuggestions = getQuickSuggestions(query);
    
    suggestions = [
        ...historySuggestions,
        ...apiSuggestions.map(text => ({
            text,
            type: "suggestion",
            icon: "🔍",
            action: () => {
                input.value = text;
                performSearch();
            }
        })),
        ...quickSuggestions
    ].slice(0, 8);
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsDropdown.innerHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-item" id="suggestion-${index}" data-index="${index}" onclick="selectSuggestion(${index})" role="option" tabindex="0">
            <span class="suggestion-icon">${suggestion.icon}</span>
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-type">${suggestion.type}</span>
        </div>
    `).join("");
    
    suggestionsDropdown.classList.add("show");
    currentSuggestionIndex = -1;
}

function getQuickSuggestions(query) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("how to")) {
        suggestions.push({
            text: `${query} tutorial`,
            type: "suggestion",
            icon: "📚",
            action: () => searchWithSuffix(" tutorial")
        });
    }
    
    if (lowerQuery.includes("what is")) {
        suggestions.push({
            text: `${query} definition`,
            type: "suggestion",
            icon: "📖",
            action: () => searchWithSuffix(" definition")
        });
    }
    
    const suffixes = [
        { suffix: " 2025", icon: "📅", type: "recent" },
        { suffix: " review", icon: "⭐", type: "review" },
        { suffix: " vs", icon: "⚖️", type: "compare" }
    ];
    
    suffixes.forEach(({ suffix, icon, type }) => {
        if (!lowerQuery.includes(suffix.trim())) {
            suggestions.push({
                text: `${query}${suffix}`,
                type: type,
                icon: icon,
                action: () => searchWithSuffix(suffix)
            });
        }
    });
    
    return suggestions.slice(0, 3);
}

function searchWithSuffix(suffix) {
    input.value += suffix;
    performSearch();
}

input.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        clearTimeout(suggestionTimeout);
        suggestionTimeout = setTimeout(() => showSuggestions(query), 150);
    } else {
        hideSuggestions();
    }
});

input.addEventListener("focus", () => {
    const query = input.value.trim();
    if (query.length > 0) {
        showSuggestions(query);
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (suggestionsDropdown.classList.contains("show") && currentSuggestionIndex >= 0) {
            selectSuggestion(currentSuggestionIndex);
        } else {
            performSearch();
        }
    }
});

document.addEventListener("keydown", (e) => {
    if ((isMac && e.metaKey && e.key.toLowerCase() === "k") || 
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        input.focus();
        return;
    }
    
    if ((isMac && e.metaKey && e.key.toLowerCase() === "h") || 
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "h")) {
        e.preventDefault();
        toggleHistory();
        return;
    }
    
    if (suggestionsDropdown.classList.contains("show")) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            navigateSuggestions(1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            navigateSuggestions(-1);
        } else if (e.key === "Enter" && currentSuggestionIndex >= 0) {
            e.preventDefault();
            selectSuggestion(currentSuggestionIndex);
        } else if (e.key === "Escape") {
            hideSuggestions();
        }
    }
});

document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target) && !suggestionsDropdown.contains(e.target) && !historyBtn.contains(e.target) && !historyPanel.contains(e.target)) {
        hideSuggestions();
        hideHistory();
    }
});

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
});

historyBtn.addEventListener("click", () => {
    toggleHistory();
});

function performSearch() {
    const query = input.value.trim();
    if (!query) return;
    
    const engine = engineSelect.value;
    const url = getSearchUrl(engine, query);
    
    addToHistory(query, engine);
    searchCount++;
    localStorage.setItem("searchCount", searchCount.toString());
    updateSearchCount();
    
    showLoading();
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        hideLoading();
        hideSuggestions();
    }, 300);
}

function getSearchUrl(engine, query) {
    const encodedQuery = encodeURIComponent(query);
    switch (engine) {
        case "google-web":
            return `https://www.google.com/search?q=${encodedQuery}&udm=14&gl=us&hl=en`;
        case "google-images":
            return `https://www.google.com/search?tbm=isch&q=${encodedQuery}`;
        case "youtube":
            return `https://www.youtube.com/results?search_query=${encodedQuery}`;
        case "claude":
            return `https://www.anthropic.com/search?q=${encodedQuery}`;
        case "claude-docs":
            return `https://docs.anthropic.com/search?q=${encodedQuery}`;
        case "claude-projects":
            return `https://www.anthropic.com/projects/search?q=${encodedQuery}`;
        case "perplexity":
            return `https://www.perplexity.ai/search?q=${encodedQuery}`;
        case "searchgpt":
            return `https://chat.openai.com/?q=${encodedQuery}`;
        case "bing":
            return `https://www.bing.com/search?q=${encodedQuery}`;
        case "duckduckgo":
            return `https://duckduckgo.com/?q=${encodedQuery}`;
        case "yahoo":
            return `https://search.yahoo.com/search?p=${encodedQuery}`;
        case "yandex":
            return `https://yandex.com/search/?text=${encodedQuery}`;
        default:
            return `https://www.google.com/search?q=${encodedQuery}&udm=14`;
    }
}

function selectSuggestion(index) {
    if (index >= 0 && index < suggestions.length) {
        suggestions[index].action();
        hideSuggestions();
    }
}

function navigateSuggestions(direction) {
    const items = suggestionsDropdown.querySelectorAll(".suggestion-item");
    if (currentSuggestionIndex >= 0) {
        items[currentSuggestionIndex].classList.remove("highlighted");
        items[currentSuggestionIndex].removeAttribute('aria-selected');
    }
    
    currentSuggestionIndex += direction;
    if (currentSuggestionIndex < 0) {
        currentSuggestionIndex = items.length - 1;
    } else if (currentSuggestionIndex >= items.length) {
        currentSuggestionIndex = 0;
    }
    
    items[currentSuggestionIndex].classList.add("highlighted");
    items[currentSuggestionIndex].setAttribute('aria-selected', 'true');
    items[currentSuggestionIndex].scrollIntoView({ block: "nearest" });
    input.setAttribute('aria-activedescendant', items[currentSuggestionIndex].id);
}

function hideSuggestions() {
    suggestionsDropdown.classList.remove("show");
    currentSuggestionIndex = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
}

function addToHistory(query, engine) {
    const historyItem = {
        query,
        engine,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString()
    };
    
    searchHistory = searchHistory.filter(item => 
        !(item.query === query && item.engine === engine)
    );
    
    searchHistory.unshift(historyItem);
    searchHistory = searchHistory.slice(0, 50);
    
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 2rem;">No search history yet</div>';
        return;
    }
    
    historyList.innerHTML = searchHistory.slice(0, 10).map(item => `
        <div class="history-item" onclick="repeatSearch('${item.query}', '${item.engine}')" role="listitem">
            <span class="history-query">${item.query}</span>
            <span class="history-engine">${getEngineName(item.engine)}</span>
            <span class="history-time">${getTimeAgo(item.timestamp)}</span>
        </div>
    `).join("");
}

function repeatSearch(query, engine) {
    input.value = query;
    engineSelect.value = engine;
    updateSubmitButton();
    hideHistory();
    performSearch();
}

function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem("searchHistory");
    updateHistoryDisplay();
    hideHistory();
}

function toggleHistory() {
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 2rem;">No search history yet</div>';
        return;
    }
    if (historyPanel.classList.contains("show")) {
        hideHistory();
    } else {
        showHistory();
    }
}

function showHistory() {
    updateHistoryDisplay();
    historyPanel.classList.add("show");
    if (window.innerWidth > 768) {
        historyBackdrop.classList.add("show");
    }
    hideSuggestions();
    
    const closeBtn = document.querySelector('.close-history');
    closeBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
}

function hideHistory() {
    historyPanel.classList.remove("show");
    historyBackdrop.classList.remove("show");
    document.body.style.overflow = '';
}

function getEngineName(engine) {
    const names = {
        "google-web": "Google",
        "google-images": "Images",
        "youtube": "YouTube",
        "claude": "Claude",
        "claude-docs": "Claude Docs",
        "claude-projects": "Claude Projects",
        "perplexity": "Perplexity",
        "searchgpt": "SearchGPT",
        "bing": "Bing",
        "duckduckgo": "DuckDuckGo",
        "yahoo": "Yahoo",
        "yandex": "Yandex"
    };
    return names[engine] || "Google";
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
}

function updateSearchCount() {
    searchCountEl.textContent = searchCount;
}

function showLoading() {
    submitBtn.innerHTML = '<span class="loading"></span>';
    submitBtn.disabled = true;
}

function hideLoading() {
    updateSubmitButton();
    submitBtn.disabled = false;
}

const today = new Date().toDateString();
const lastResetDate = localStorage.getItem("lastResetDate");

if (lastResetDate !== today) {
    searchCount = 0;
    localStorage.setItem("searchCount", "0");
    localStorage.setItem("lastResetDate", today);
    updateSearchCount();
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}