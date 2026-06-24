const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

// Scroll progress bar
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}, { passive: true });

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a:not(.nav-cta)");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { root: null, rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

document.querySelector("#hero")?.classList.add("visible");

function initTilt(selector, maxTilt = 12) {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;
  document.querySelectorAll(selector).forEach((el) => {
    if (el.classList.contains("no-tilt")) return;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

initTilt(".tilt-card", 8);
initTilt("#hero-tilt", 14);
initTilt(".gallery-card", 10);

const heroScene = document.getElementById("hero-scene");
if (heroScene) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroScene.style.transform = `perspective(1200px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg)`;
  });
}


// Resume modal
(function () {
  const modal   = document.getElementById("resume-modal");
  const iframe  = document.getElementById("resume-iframe");
  const openBtn = document.getElementById("preview-resume-btn");
  const closeBtn = document.getElementById("modal-close");
  const PDF_SRC = "./assets/Sanjana_S_Resume_Updated (4).pdf";

  function openModal() {
    if (!iframe.src || iframe.src === window.location.href) {
      iframe.src = PDF_SRC;
    }
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    openBtn.focus();
  }

  openBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) closeModal();
  });
})();

// Typewriter effect
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;
  const phrases = [
    "Software Engineer @ PayPal",
    "AI Researcher",
    "Full-Stack Developer",
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 65);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 800);
})();

// Animated stat counters
function animateCounter(el, target, suffix, decimals, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = decimals > 0 ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
  }
  requestAnimationFrame(update);
}

const statConfigs = [
  { suffix: "+", target: 1, decimals: 0 },
  { suffix: "",  target: 4, decimals: 0 },
  { suffix: "",  target: 9.48, decimals: 2 },
  { suffix: "",  target: 3, decimals: 0 },
];

let statsAnimated = false;
const statsSection = document.querySelector(".stats-grid");
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll(".stat-number").forEach((el, i) => {
          const cfg = statConfigs[i];
          if (cfg) animateCounter(el, cfg.target, cfg.suffix, cfg.decimals, 1400);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}

// Section title underline expand on reveal
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("underline-expanded");
      titleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".section-title").forEach((el) => titleObserver.observe(el));
