"use strict";

const DEFAULT_PAGE_SIZE = 30;
const DEFAULT_SORT = "created_at,desc";
let controller;

document.addEventListener("DOMContentLoaded", () => {
  const elements = getPageElements();
  const config = getPageConfig(elements.vocabList);
  const state = {
    currentPage: 0,
    searchWordString: "",
  };

  bindEvents(elements, config, state);
  void refreshWords(elements, config, state);
});

function getPageElements() {
  return {
    vocabList: getRequiredElement("vocabList"),
    modal: getRequiredElement("addWordModal"),
    addWordForm: getRequiredElement("addWordForm"),
    openModalButton: getRequiredElement("open-add-word-modal"),
    closeModalButton: getRequiredElement("close-add-word-modal"),
    pageInfo: getRequiredElement("page-info"),
    wordsContainer: getRequiredElement("words-container"),
    prevButton: getRequiredElement("prev-page"),
    nextButton: getRequiredElement("next-page"),
    wordInput: getRequiredElement("word"),
    meaningInput: getRequiredElement("meaning"),
    contextInput: getRequiredElement("context"),
    searchWordInput: getRequiredElement("search-word"),
  };
}

function getRequiredElement(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing required element: #${id}`);
  }

  return element;
}

function getPageConfig(vocabList) {
  const {
    wordsApiUrl,
    learnedIconUrl,
    notLearnedIconUrl,
    deleteIconUrl,
  } = vocabList.dataset;

  if (!wordsApiUrl || !learnedIconUrl || !notLearnedIconUrl || !deleteIconUrl) {
    throw new Error("Vocabulary page config is incomplete");
  }

  return {
    wordsApiUrl,
    learnedIconUrl,
    notLearnedIconUrl,
    deleteIconUrl,
  };
}

function bindEvents(elements, config, state) {
  elements.openModalButton.addEventListener("click", () => {
    openModal(elements.modal);
  });

  elements.closeModalButton.addEventListener("click", () => {
    closeModal(elements.modal);
  });

  window.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal(elements.modal);
    }
  });

  elements.prevButton.addEventListener("click", () => {
    if (state.currentPage === 0) {
      return;
    }

    state.currentPage -= 1;
    void refreshWords(elements, config, state);
  });

  elements.nextButton.addEventListener("click", () => {
    state.currentPage += 1;
    void refreshWords(elements, config, state);
  });

  elements.addWordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      word: elements.wordInput.value,
      meaning: elements.meaningInput.value,
      context: elements.contextInput.value,
    };

    try {
      await createWord(config.wordsApiUrl, payload);
      elements.addWordForm.reset();
      closeModal(elements.modal);

      state.currentPage = 0;
      await refreshWords(elements, config, state);
    } catch (error) {
      console.error("Failed to create word", error);
    }
  });

  elements.wordsContainer.addEventListener("click", async (event) => {
    const delete_button = event.target.closest(".word-delete-button");
    if (!delete_button) return;
    const { wordId } = delete_button.dataset;

    try {
      await deleteWord(config.wordsApiUrl, wordId);
      await refreshWords(elements, config, state)
    } catch (error) {
      console.error("Failed to delete word", error);
    }
  })

  elements.searchWordInput.addEventListener(
    "input", (event) => debouncedSearch(event.target.value, elements, config, state)
  );
}

async function refreshWords(elements, config, state) {
  try {
    const pageData = await loadWordsPage(
      config.wordsApiUrl,
      state.currentPage,
      DEFAULT_PAGE_SIZE,
      state.searchWordString);
    state.currentPage = pageData.page;
    renderPage(elements, pageData, config);
  } catch (error) {
    console.error("Failed to load words", error);
  }
}

async function loadWordsPage(wordsApiUrl, page = 0, size = DEFAULT_PAGE_SIZE, searchWordString) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: DEFAULT_SORT,
    searchSubStr: searchWordString,
  });

  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  const response = await fetch(`${wordsApiUrl}?${params.toString()}`, {
    signal: controller.signal
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function createWord(wordsApiUrl, payload) {
  const response = await fetch(wordsApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

function renderPage(elements, pageData, config) {
  elements.wordsContainer.innerHTML = "";

  if (pageData.wordsDto.length === 0) {
    elements.pageInfo.textContent = "No words yet";
  } else {
    elements.pageInfo.textContent = `Page ${pageData.page + 1} of ${pageData.totalPages}`;
  }

  pageData.wordsDto.forEach((word) => {
    elements.wordsContainer.appendChild(createWordCard(word, config));
  });

  elements.prevButton.disabled = !pageData.hasPrevious;
  elements.nextButton.disabled = !pageData.hasNext;
}

function createWordCard(word, config) {
  const wordDiv = document.createElement("div");
  wordDiv.className = `word ${word.isLearned ? "learned" : "not-learned"}`;

  const wordData = document.createElement("div");
  wordData.className = "word-data";

  const wordValue = document.createElement("p");
  wordValue.className = "word_value";
  wordValue.textContent = word.word;

  const wordMeaning = document.createElement("p");
  wordMeaning.className = "word_meaning";
  wordMeaning.textContent = word.meaning;

  wordData.append(wordValue, wordMeaning);
  wordDiv.appendChild(wordData);

  if (word.context && word.context.trim()) {
    wordDiv.classList.add("has-context");

    const contextDiv = document.createElement("div");
    contextDiv.className = "word-context";

    const contextValue = document.createElement("p");
    contextValue.className = "word-context-value";
    contextValue.textContent = word.context;

    contextDiv.appendChild(contextValue);
    wordDiv.appendChild(contextDiv);
  }

  const statusDiv = document.createElement("div");
  statusDiv.className = "word-status";

  const statusIcon = document.createElement("img");
  statusIcon.className = "word-status-icon";
  statusIcon.src = word.isLearned ? config.learnedIconUrl : config.notLearnedIconUrl;
  statusIcon.alt = word.isLearned ? "Learned word" : "Word in progress";

  statusDiv.appendChild(statusIcon);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "word-delete-button";
  deleteButton.title = "Delete word";
  deleteButton.setAttribute("aria-label", `Delete ${word.word}`);
  deleteButton.dataset.wordId = word.id;

  const deleteIcon = document.createElement("img");
  deleteIcon.className = "word-delete-icon";
  deleteIcon.src = config.deleteIconUrl;
  deleteIcon.alt = "";
  deleteIcon.setAttribute("aria-hidden", "true");

  deleteButton.appendChild(deleteIcon);

  const wordActions = document.createElement("div");
  wordActions.className = "word-actions";
  wordActions.append(statusDiv, deleteButton);

  wordDiv.appendChild(wordActions);

  return wordDiv;
}

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}

async function deleteWord(wordsApiUrl, id) {
  await fetch(`${wordsApiUrl}/${id}`, {
    method: "DELETE"
  })
}

const debouncedSearch = debounce(async (query, elements, config, state) => {
  state.searchWordString = query;
  state.currentPage = 0;

  refreshWords(elements, config, state);
}, 300)

function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);

    }, delay);
  }
}