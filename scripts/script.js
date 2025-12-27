document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      items.forEach((i) => i.classList.remove("active"));
      if (!isOpen) item.classList.add("active");

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

  const sectionIds = [
    "accordion-theory",
    "accordion-activity",
    "accordion-exercise",
  ];
  sectionIds.forEach((id) => {
    const container = document.getElementById(id);
    if (container) {
      updateButtons(id, 0);
      const activeSlide = container.querySelector(
        ".content-slide.active-slide"
      );
      if (activeSlide) renderMathJax(activeSlide);

      const bodyInner = container.querySelector(".body-inner");
      if (bodyInner) {
        addSwipeSupport(bodyInner, id);
      }
    }
  });
  // Global Keyboard Arrows
  document.addEventListener("keydown", (e) => {
    const active = document.querySelector(".accordion-item.active");
    if (!active) return;
    if (e.key === "ArrowRight") changeSlide(active.id, 1);
    if (e.key === "ArrowLeft") changeSlide(active.id, -1);
  });

  // Initialize any custom drawings if present
  if (typeof drawDefRotation === "function") drawDefRotation();
  if (typeof updateSim === "function") updateSim();
});

function changeSlide(id, dir) {
  const container = document.getElementById(id);
  const track = container.querySelector(".slider-track");
  if (!track) return;
  const slides = track.querySelectorAll(".content-slide");
  let activeIdx = Array.from(slides).findIndex((s) =>
    s.classList.contains("active-slide")
  );

  let newIdx = activeIdx + dir;
  if (newIdx < 0) newIdx = 0;
  if (newIdx >= slides.length) newIdx = slides.length - 1;

  if (newIdx !== activeIdx) {
    updateSlidePosition(track, newIdx);
    slides[activeIdx].classList.remove("active-slide");
    slides[newIdx].classList.add("active-slide");
    updateButtons(id, newIdx);
    renderMathJax(slides[newIdx]);
  }
}

function updateSlidePosition(track, index) {
  track.style.transition = "transform 0.3s ease-out";
  track.style.transform = `translateX(-${index * 100}%)`;
}

function updateButtons(accordionId, index) {
  const container = document.getElementById(accordionId);
  const track = container.querySelector(".slider-track");
  if (!track) return;
  const slides = track.querySelectorAll(".content-slide");
  const btnPrev = container.querySelector(".btn-prev");
  const btnNext = container.querySelector(".btn-next");
  const bodyInner = container.querySelector(".body-inner");

  if (btnPrev) btnPrev.disabled = index === 0;
  if (btnNext) btnNext.disabled = index === slides.length - 1;
  if (bodyInner) {
    const total = bodyInner.getAttribute("data-total-slides");
    bodyInner.setAttribute("data-slide-indicator", `${index + 1}/${total}`);
  }
}

function addSwipeSupport(el, id) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  const track = el.querySelector(".slider-track");
  if (!track) return;

  el.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
      track.style.transition = "none";
    },
    { passive: true }
  );

  el.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;

      const slides = track.querySelectorAll(".content-slide");
      const activeIdx = Array.from(slides).findIndex((s) =>
        s.classList.contains("active-slide")
      );

      if (activeIdx === 0 && diff > 0) return;
      if (activeIdx === slides.length - 1 && diff < 0) return;

      const trackWidth = track.offsetWidth;
      const currentTranslate = -(activeIdx * 100);
      const movePercent = (diff / trackWidth) * 100;

      track.style.transform = `translateX(${currentTranslate + movePercent}%)`;
    },
    { passive: true }
  );

  el.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;
      isDragging = false;

      if (currentX === 0) currentX = startX;

      const diff = currentX - startX;
      const threshold = 50;

      const slides = track.querySelectorAll(".content-slide");
      const activeIdx = Array.from(slides).findIndex((s) =>
        s.classList.contains("active-slide")
      );

      if (activeIdx === 0 && diff > 0) {
        updateSlidePosition(track, activeIdx);
        startX = 0;
        currentX = 0;
        return;
      }
      if (activeIdx === slides.length - 1 && diff < 0) {
        updateSlidePosition(track, activeIdx);
        startX = 0;
        currentX = 0;
        return;
      }

      track.style.transition = "transform 0.3s ease-out";

      if (Math.abs(diff) > threshold) {
        const dir = diff > 0 ? -1 : 1;
        changeSlide(id, dir);
      } else {
        updateSlidePosition(track, activeIdx);
      }
      startX = 0;
      currentX = 0;
    },
    { passive: true }
  );
}

function renderMathJax(element) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([element]).catch((err) => console.error(err));
  }
}

function selectOption(el) {
  el.classList.toggle("selected");
}

function validateVraiFaux(activityId) {
  const options = document.querySelectorAll(`#${activityId} .qcm-option`);
  let errors = 0;

  options.forEach((opt) => {
    const isSelected = opt.classList.contains("selected");
    const truth = opt.getAttribute("data-answer");

    // Remove previous feedback classes
    opt.classList.remove("feedback-success", "feedback-error");

    // Only apply feedback to SELECTED options
    if (isSelected) {
      if (truth === "Vrai") {
        opt.classList.add("feedback-success");
      } else if (truth === "Faux") {
        opt.classList.add("feedback-error");
        errors++;
      }
    } else {
      // Count missing correct answers as errors, but DON'T highlight them
      if (truth === "Vrai") {
        errors++;
      }
    }
  });

  showFeedback(
    `feedback-${activityId}`,
    errors === 0,
    errors === 0
      ? "Excellent ! Toutes les réponses sont correctes."
      : "Certaines réponses sont incorrectes."
  );
}

function checkNumerical(inputId, correctVal, feedbackId, tolerance = 0.01) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const val = parseFloat(input.value);
  if (isNaN(val)) {
    showFeedback(feedbackId, false, "Veuillez entrer une valeur numérique.");
    return;
  }
  const isCorrect = Math.abs(val - correctVal) <= tolerance;
  showFeedback(
    feedbackId,
    isCorrect,
    isCorrect
      ? "Correct ! Bonne réponse."
      : "Réessayez, la valeur n'est pas exacte."
  );
}

function showFeedback(id, isSuccess, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = isSuccess
    ? "feedback-container feedback-success"
    : "feedback-container feedback-error";
  el.innerHTML = (isSuccess ? "✅ " : "❌ ") + msg;
  el.style.display = "block";
}

function toggleHint(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function toggleSol(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "block" ? "none" : "block";
  renderMathJax(el);
}
