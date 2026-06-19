/**
 * Sesha Hemanth Konda — Portfolio Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initInteractiveNodes();
  initScrollReveal();
});

/* ==========================================================================
   1. LIGHT / DARK THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }

  // Toggle listener
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const currentTheme = body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", currentTheme);

    // Trigger pulse animation on center node during theme change
    const centerNode = document.querySelector(".center-node .node-pulse");
    if (centerNode) {
      centerNode.style.animation = "none";
      setTimeout(() => {
        centerNode.style.animation = "node-pulse-anim 1.5s ease-out";
      }, 10);
    }
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when a link is clicked
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE NODE ANIMATION (HERO GRAPHIC)
   ========================================================================== */
function initInteractiveNodes() {
  const container = document.querySelector(".interactive-graphic-container");
  const svg = document.querySelector(".interactive-nodes-svg");
  if (!container || !svg) return;

  // Node elements
  const nodes = {
    center: {
      el: document.getElementById("node-center"),
      base: { x: 250, y: 250 },
      current: { x: 250, y: 250 },
      factor: 0.04,
    },
    react: {
      el: document.getElementById("node-react"),
      base: { x: 150, y: 150 },
      current: { x: 150, y: 150 },
      factor: 0.12,
    },
    fastapi: {
      el: document.getElementById("node-fastapi"),
      base: { x: 350, y: 140 },
      current: { x: 350, y: 140 },
      factor: 0.08,
    },
    ai: {
      el: document.getElementById("node-ai"),
      base: { x: 360, y: 340 },
      current: { x: 360, y: 340 },
      factor: 0.15,
    },
    ts: {
      el: document.getElementById("node-ts"),
      base: { x: 130, y: 320 },
      current: { x: 130, y: 320 },
      factor: 0.1,
    },
  };

  // Connection lines elements
  const lines = {
    centerReact: {
      el: document.getElementById("line-center-react"),
      from: "center",
      to: "react",
    },
    centerFastapi: {
      el: document.getElementById("line-center-fastapi"),
      from: "center",
      to: "fastapi",
    },
    centerAi: {
      el: document.getElementById("line-center-ai"),
      from: "center",
      to: "ai",
    },
    centerTs: {
      el: document.getElementById("line-center-ts"),
      from: "center",
      to: "ts",
    },
    reactTs: {
      el: document.getElementById("line-react-ts"),
      from: "react",
      to: "ts",
    },
    fastapiAi: {
      el: document.getElementById("line-fastapi-ai"),
      from: "fastapi",
      to: "ai",
    },
  };

  let targetMouse = { x: 0, y: 0 };
  let currentMouse = { x: 0, y: 0 };
  let isHovering = false;

  // Listen to mouse movements in hero container
  const heroSection = document.querySelector(".hero-section");
  heroSection.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    targetMouse.x = e.clientX - centerX;
    targetMouse.y = e.clientY - centerY;
    isHovering = true;
  });

  heroSection.addEventListener("mouseleave", () => {
    targetMouse.x = 0;
    targetMouse.y = 0;
    isHovering = false;
  });

  // Physics / Interpolation animation loop
  function updateNodes() {
    // Smooth mouse movements (lerp)
    const ease = 0.08;
    currentMouse.x += (targetMouse.x - currentMouse.x) * ease;
    currentMouse.y += (targetMouse.y - currentMouse.y) * ease;

    // Apply translation to nodes
    for (const key in nodes) {
      const node = nodes[key];
      if (!node.el) continue;

      // Calculate drift offset
      const dx = currentMouse.x * node.factor;
      const dy = currentMouse.y * node.factor;

      // Idle floating animation (sine waves) if mouse is not hovering
      let idleX = 0;
      let idleY = 0;
      if (!isHovering) {
        const time = Date.now() * 0.0015;
        const phaseOffset = { center: 0, react: 1, fastapi: 2, ai: 3, ts: 4 }[
          key
        ];
        idleX = Math.sin(time + phaseOffset) * 6;
        idleY = Math.cos(time * 0.8 + phaseOffset) * 6;
      }

      node.current.x = node.base.x + dx + idleX;
      node.current.y = node.base.y + dy + idleY;

      node.el.setAttribute(
        "transform",
        `translate(${node.current.x}, ${node.current.y})`,
      );
    }

    // Update connection lines coordinates
    for (const key in lines) {
      const line = lines[key];
      if (!line.el) continue;

      const fromNode = nodes[line.from];
      const toNode = nodes[line.to];

      line.el.setAttribute("x1", fromNode.current.x);
      line.el.setAttribute("y1", fromNode.current.y);
      line.el.setAttribute("x2", toNode.current.x);
      line.el.setAttribute("y2", toNode.current.y);
    }

    requestAnimationFrame(updateNodes);
  }

  // Start loop
  updateNodes();

  // Figma tag interaction: Hovering roles highlights corresponding node
  const roleTags = document.querySelectorAll(".role-tag");
  roleTags.forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      const nodeType = tag.getAttribute("data-node");
      let nodeEl = null;
      if (nodeType === "ui") nodeEl = nodes.react.el;
      if (nodeType === "fullstack") nodeEl = nodes.center.el;
      if (nodeType === "ai") nodeEl = nodes.ai.el;

      if (nodeEl) {
        nodeEl.querySelector(".node-bg").style.stroke = "var(--accent-orange)";
        nodeEl.querySelector(".node-bg").style.strokeWidth = "3px";
      }
    });

    tag.addEventListener("mouseleave", () => {
      const nodeType = tag.getAttribute("data-node");
      let nodeEl = null;
      if (nodeType === "ui") nodeEl = nodes.react.el;
      if (nodeType === "fullstack") nodeEl = nodes.center.el;
      if (nodeType === "ai") nodeEl = nodes.ai.el;

      if (nodeEl) {
        nodeEl.querySelector(".node-bg").style.stroke = "";
        nodeEl.querySelector(".node-bg").style.strokeWidth = "";
      }
    });
  });
}

function initScrollReveal() {
  const style = document.createElement("style");
  style.innerHTML = `
        .reveal-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-element.reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
  document.head.appendChild(style);

  const revealTargets = [
    ".philosophy-quote-block",
    ".profile-grid",
    ".section-title",
    ".skill-card",
    ".serif-transition",
    ".project-card",
    ".resume-selector-container",
    ".contact-card",
  ];

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        obs.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  // Apply class and observe elements
  revealTargets.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.classList.add("reveal-element");

      // Add slight staggered delay to skill cards if in grid
      if (selector === ".skill-card") {
        const parent = el.parentNode;
        const index = Array.from(parent.children).indexOf(el);
        el.style.transitionDelay = `${index * 100}ms`;
      }

      observer.observe(el);
    });
  });
}
