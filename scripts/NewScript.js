let idleTimeout;
const IDLE_TIME = 2500;

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      items.forEach((i) => i.classList.remove("active"));
      if (!isOpen) {
        item.classList.add("active");
        resetIdleTimer();
      }
      const anyActive = Array.from(items).some((i) =>
        i.classList.contains("active")
      );
      document.body.classList.toggle("accordion-active", anyActive);

      if (!isOpen) {
        const body = item.querySelector(".accordion-body");
        if (body) {
          renderMathJax(body);
        }
      }
    });
  });

  const initialSections = [
    "accordion-theory",
    "accordion-activity",
    "accordion-exercise",
  ];
  initialSections.forEach((id) => {
    const container = document.getElementById(id);
    if (container) {
      updateButtons(id, 0);
      updateSlideIndicator(id, 0);
      const activeSlide = container.querySelector(
        ".content-slide.active-slide"
      );
      if (activeSlide) renderMathJax(activeSlide);
    }
  });
    // Initialize any custom drawings if present
    if (typeof drawDefRotation === "function") drawDefRotation();
    if (typeof updateSim === "function") updateSim();
    setupIdleDetection();
});

function setupIdleDetection() {
  const events = [
    "mousemove",
    "mousedown",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];
    navElements = document.querySelectorAll(".nav-arrows, .slide-indicator");

  events.forEach((event) => {
    document.removeEventListener(event, resetIdleTimer);
    document.addEventListener(event, resetIdleTimer);
  });

  resetIdleTimer();
}

function resetIdleTimer() {
  navElements.forEach((el) => {
    el.classList.remove("hidden");
  });

  clearTimeout(idleTimeout);

  idleTimeout = setTimeout(() => {
    navElements.forEach((el) => {
      el.classList.add("hidden");
    });
  }, IDLE_TIME);
}

function updateSlideIndicator(accordionId, currentIndex) {
  const container = document.getElementById(accordionId);
  const bodyInner = container.querySelector(".body-inner");
  const indicator = container.querySelector(".slide-indicator");

  if (bodyInner && indicator) {
    const totalSlides = bodyInner.getAttribute("data-total-slides");
    indicator.textContent = `${currentIndex + 1}/${totalSlides}`;
  }
}

function changeSlide(accordionId, direction) {
  const container = document.getElementById(accordionId);
  const slidesContainer = container.querySelector(".slides-container");
  const slides = container.querySelectorAll(".content-slide");
  let activeIndex = -1;

  slides.forEach((slide, index) => {
    if (slide.classList.contains("active-slide")) {
      activeIndex = index;
    }
  });

  let newIndex = activeIndex + direction;
  const maxIndex = slides.length - 1;

  if (newIndex < 0) newIndex = 0;
  if (newIndex > maxIndex) newIndex = maxIndex;

  slides.forEach((slide) => slide.classList.remove("active-slide"));
  slides[newIndex].classList.add("active-slide");

  slides[newIndex].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });

  updateButtons(accordionId, newIndex);
  updateSlideIndicator(accordionId, newIndex);
  resetIdleTimer();

  setTimeout(() => {
    renderMathJax(slides[newIndex]);
  }, 300);
}

document.querySelectorAll(".slides-container").forEach((container) => {
  let scrollTimeout;

  container.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const slides = container.querySelectorAll(".content-slide");
      const containerRect = container.getBoundingClientRect();

      let mostVisibleSlide = null;
      let maxVisibility = 0;

      slides.forEach((slide, index) => {
        const slideRect = slide.getBoundingClientRect();
        const visibleWidth =
          Math.min(slideRect.right, containerRect.right) -
          Math.max(slideRect.left, containerRect.left);

        if (visibleWidth > maxVisibility) {
          maxVisibility = visibleWidth;
          mostVisibleSlide = { slide, index };
        }
      });

      if (mostVisibleSlide) {
        slides.forEach((s) => s.classList.remove("active-slide"));
        mostVisibleSlide.slide.classList.add("active-slide");

        const accordionBody = container.closest(".accordion-body");
        const accordionItem = accordionBody.closest(".accordion-item");
        const accordionId = accordionItem.id;

        updateButtons(accordionId, mostVisibleSlide.index);
        updateSlideIndicator(accordionId, mostVisibleSlide.index);
        resetIdleTimer();

        renderMathJax(mostVisibleSlide.slide);
      }
    }, 150);
  });
});
document.addEventListener("keydown", (e) => {
  const activeAccordion = document.querySelector(".accordion-item.active");
  if (!activeAccordion) return;

  const accordionId = activeAccordion.id;

  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    changeSlide(accordionId, -1);
  } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    changeSlide(accordionId, 1);
  }
});

function updateButtons(accordionId, index) {
  const container = document.getElementById(accordionId);
  const slides = container.querySelectorAll(".content-slide");

  const btnPrev = container.querySelector(".btn-prev");
  const btnNext = container.querySelector(".btn-next");

  if (btnPrev) {
    btnPrev.disabled = index === 0;
    btnPrev.style.display = "flex";
  }

  if (btnNext) {
    btnNext.disabled = index === slides.length - 1;
    btnNext.style.display = "flex";
  }

  const arrowPrev = container.querySelector(".arrow-nav-btn.arrow-prev");
  const arrowNext = container.querySelector(".arrow-nav-btn.arrow-next");

  if (arrowPrev) {
    arrowPrev.disabled = index === 0;
  }

  if (arrowNext) {
    arrowNext.disabled = index === slides.length - 1;
  }
}

function renderMathJax(element) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([element]).catch((err) => console.error(err));
  }
}

function selectOption(el) {
  el.classList.toggle("selected");
}

function validateVraiFaux(containerId) {
  const options = document.querySelectorAll(`#${containerId} .qcm-option`);
  let errors = 0;
  options.forEach((opt) => {
    const isSelected = opt.classList.contains("selected");
    const truth = opt.getAttribute("data-answer");
    opt.classList.remove("feedback-success", "feedback-error");
    if (isSelected && truth === "Vrai") opt.classList.add("feedback-success");
    else if (isSelected && truth === "Faux") {
      opt.classList.add("feedback-error");
      errors++;
    } else if (!isSelected && truth === "Vrai") {
      opt.classList.add("feedback-error");
      errors++;
    }
  });
  showFeedback(
    "feedback-" + containerId,
    errors === 0,
    errors === 0 ? "Excellent !" : "Certaines réponses sont incorrectes."
  );
}

function checkNumerical(inputId, correctVal, feedbackId, tolerance = 0.01) {
  const val = parseFloat(document.getElementById(inputId).value);
  const isCorrect = Math.abs(val - correctVal) <= tolerance;
  showFeedback(
    feedbackId,
    isCorrect,
    isCorrect ? "Correct !" : "Réessayez, la valeur n'est pas exacte."
  );
}

function showFeedback(id, isSuccess, msg) {
  const el = document.getElementById(id);
  el.className = isSuccess
    ? "feedback-container feedback-success"
    : "feedback-container feedback-error";
  el.innerHTML = (isSuccess ? "✅ " : "❌ ") + msg;
  el.style.display = "block";
}

function toggleHint(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function toggleSol(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
  renderMathJax(el);
}