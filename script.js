document.addEventListener("DOMContentLoaded", () => {
  const isTouch = !window.matchMedia("(hover:hover)").matches;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion:reduce)",
  ).matches;

  // === DYNAMIC TAB TITLE ===
  const originalTitle = document.title;
  window.addEventListener("blur", () => {
    document.title = "Come back! | Chandresh Sharma";
  });
  window.addEventListener("focus", () => {
    document.title = originalTitle;
  });

  // === THEME ===
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  html.setAttribute("data-theme", localStorage.getItem("theme") || "dark");
  if (toggle)
    toggle.addEventListener("click", () => {
      const n = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", n);
      localStorage.setItem("theme", n);
    });

  // === CURSOR ===
  const cDot = document.querySelector(".cursor-dot");
  const cRing = document.querySelector(".cursor-ring");
  const cGlow = document.querySelector(".cursor-glow");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0,
    gx = 0,
    gy = 0;
  if (!isTouch && cDot && !reduceMotion) {
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cDot.style.left = mx + "px";
      cDot.style.top = my + "px";
    });
    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      gx += (mx - gx) * 0.05;
      gy += (my - gy) * 0.05;
      cRing.style.left = rx + "px";
      cRing.style.top = ry + "px";
      cGlow.style.left = gx + "px";
      cGlow.style.top = gy + "px";
      requestAnimationFrame(loop);
    })();
    document
      .querySelectorAll(
        "a, button, .tilt-card, .email-pill-container, .magnetic-link",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cRing.classList.add("hovering");
          cDot.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
          cRing.classList.remove("hovering");
          cDot.classList.remove("hovering");
        });
      });
    window.addEventListener("mousedown", () => {
      if (cRing) cRing.classList.add("pulse");
      setTimeout(() => {
        if (cRing) cRing.classList.remove("pulse");
      }, 300);
    });
  }

  // === NAVBAR ===
  const header = document.querySelector(".glass-header");
  const hamburger = document.getElementById("hamburger");
  const mobMenu = document.getElementById("mobileMenu");
  const mobLinks = document.querySelectorAll(".mobile-nav-link");
  let menuOpen = false;

  if (hamburger && mobMenu) {
    hamburger.addEventListener("click", () => {
      menuOpen = !menuOpen;
      hamburger.classList.toggle("active");
      mobMenu.classList.toggle("active");
      if (mobMenu.classList.contains("active")) {
        mobLinks.forEach((l, i) => {
          l.style.transitionDelay = 0.08 + i * 0.04 + "s";
        });
        header.classList.remove("nav-hidden");
        header.classList.add("nav-visible");
      } else {
        mobLinks.forEach((l) => {
          l.style.transitionDelay = "0s";
        });
      }
    });
    mobLinks.forEach((l) =>
      l.addEventListener("click", () => {
        menuOpen = false;
        hamburger.classList.remove("active");
        mobMenu.classList.remove("active");
      }),
    );
  }

  // Throttled Scroll Direction Detection for Navbar Visibility
  let lastScrollTop = window.scrollY;
  const scrollThreshold = 15; // Minimum scroll delta in pixels to trigger transition
  let isThrottled = false;

  const handleScroll = () => {
    const currentScrollTop = window.scrollY;
    const diff = currentScrollTop - lastScrollTop;

    if (Math.abs(diff) >= scrollThreshold) {
      if (currentScrollTop <= 50) {
        // Near the top: always show the navbar
        header.classList.remove("nav-hidden");
        header.classList.add("nav-visible");
      } else if (diff > 0 && currentScrollTop > 120) {
        // Scrolling down: hide the navbar
        if (!menuOpen) {
          header.classList.add("nav-hidden");
          header.classList.remove("nav-visible");
        }
      } else if (diff < 0) {
        // Scrolling up: show the navbar
        header.classList.remove("nav-hidden");
        header.classList.add("nav-visible");
      }
      lastScrollTop = currentScrollTop;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!isThrottled) {
        handleScroll();
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, 100); // 100ms throttle for ultra-smooth rendering with zero jitter
      }
    },
    { passive: true },
  );

  // Active links
  const secs = document.querySelectorAll("section,footer,[id]");
  const navLs = document.querySelectorAll(".nav-link,.mobile-nav-link");

  // === REVEAL (IntersectionObserver) ===
  if (!reduceMotion) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            e.target
              .querySelectorAll(".stagger-child")
              .forEach((c, i) =>
                setTimeout(() => c.classList.add("visible"), 120 * i),
              );
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".reveal-section")
      .forEach((el) => obs.observe(el));
  } else {
    document
      .querySelectorAll(".reveal-section,.stagger-child")
      .forEach((el) => el.classList.add("visible"));
  }

  // === 3D TILT (smooth lerp interaction) ===
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      let currentX = 0,
        currentY = 0,
        targetX = 0,
        targetY = 0;
      let currentMouseX = 50,
        currentMouseY = 50,
        targetMouseX = 50,
        targetMouseY = 50;
      let isHovering = false;
      let animationFrameId = null;

      card.addEventListener("mouseenter", () => {
        isHovering = true;
        if (!animationFrameId) animateCard();
      });

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        // Subtle rotation range (reduced from 6 to 3.5)
        targetY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 3.5;
        targetX = ((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 3.5;

        // Track mouse percentage for glow
        targetMouseX = ((e.clientX - r.left) / r.width) * 100;
        targetMouseY = ((e.clientY - r.top) / r.height) * 100;
      });

      card.addEventListener("mouseleave", () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        targetMouseX = 50;
        targetMouseY = 50;
      });

      function animateCard() {
        // Lerp factor
        const ease = 0.08;

        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        currentMouseX += (targetMouseX - currentMouseX) * ease;
        currentMouseY += (targetMouseY - currentMouseY) * ease;

        // Only apply transform if hovering or if it hasn't returned to rest
        if (
          isHovering ||
          Math.abs(currentX) > 0.01 ||
          Math.abs(currentY) > 0.01
        ) {
          const scale = isHovering ? 1.01 : 1;
          const translateZ = isHovering ? 10 : 0;

          // Update transform (smooth 3D tilt)
          card.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(${translateZ}px) scale(${scale})`;

          // Update ambient glow position
          card.style.setProperty("--mouse-x", `${currentMouseX}%`);
          card.style.setProperty("--mouse-y", `${currentMouseY}%`);

          animationFrameId = requestAnimationFrame(animateCard);
        } else {
          // Reset to clean state when fully rested
          card.style.transform = "";
          animationFrameId = null;
        }
      }
    });
  }

  // === CANVAS ===
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  const scrollSec = document.querySelector(".scroll-canvas-section");
  const frameCount = 120;
  const images = new Array(frameCount);
  let currentFrame = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(currentFrame);
  }
  window.addEventListener("resize", resizeCanvas);

  function framePath(i) {
    return (
      "sequence/frame_" + i.toString().padStart(3, "0") + "_delay-0.066s.png"
    );
  }

  function renderFrame(idx) {
    const img = images[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cR = canvas.width / canvas.height,
      iR = img.width / img.height;
    let dw = canvas.width,
      dh = canvas.height,
      dx = 0,
      dy = 0;
    if (cR > iR) {
      dh = canvas.width / iR;
      dy = (canvas.height - dh) / 2;
    } else {
      dw = canvas.height * iR;
      dx = (canvas.width - dw) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Lazy preload: first 10 priority, rest in batches
  function loadFrame(i) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        images[i] = img;
        resolve();
      };
      img.onerror = resolve;
    });
  }
  const priority = [];
  for (let i = 0; i < 10 && i < frameCount; i++) priority.push(loadFrame(i));
  Promise.all(priority).then(() => {
    resizeCanvas();
    let idx = 10;
    (function batch() {
      if (idx >= frameCount) return;
      const b = [];
      for (let j = 0; j < 5 && idx < frameCount; j++, idx++)
        b.push(loadFrame(idx));
      Promise.all(b).then(() => requestAnimationFrame(batch));
    })();
  });

  // === MASTER LOOP ===
  const progressBar = document.querySelector(".progress-bar");
  const t1 = document.getElementById("text-1");
  const t2 = document.getElementById("text-2");
  const t3 = document.getElementById("text-3");
  const parallaxBgs = document.querySelectorAll(".parallax-bg");

  let targetScroll = window.scrollY,
    currentScroll = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      targetScroll = window.scrollY;
    },
    { passive: true },
  );

  function masterLoop() {
    currentScroll += (targetScroll - currentScroll) * 0.1;
    const docH = document.body.scrollHeight - window.innerHeight;

    // Progress bar
    if (docH > 0) progressBar.style.width = (currentScroll / docH) * 100 + "%";

    // Navbar scrolled state (smooth padding & dark-theme background transition)
    if (currentScroll > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    // Active link
    let cur = "";
    const targets = [
      "hero",
      "summary",
      "skills",
      "projects",
      "experience",
      "education",
      "certifications",
      "contact",
    ];
    targets.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        cur = id;
      }
    });
    navLs.forEach((l) => {
      if (l.getAttribute("href") === "#" + cur) l.classList.add("active");
      else l.classList.remove("active");
    });

    // Canvas
    const secTop = scrollSec.offsetTop,
      secH = scrollSec.offsetHeight - window.innerHeight;
    let p = secH > 0 ? (currentScroll - secTop) / secH : 0;
    p = Math.max(0, Math.min(1, p));
    const fi = Math.floor(p * (frameCount - 1));
    if (fi !== currentFrame) {
      currentFrame = fi;
      renderFrame(fi);
    }
    // animText(t1, p, 0, .25);
    // animText(t2, p, .35, .60);
    // animText(t3, p, .70, .95);
    // Text stays visible longer and transitions much tighter
    animText(t1, p, 0, 0.39); // Text 1 stays up all the way to 40% scroll
    animText(t2, p, 0.42, 0.74); // Text 2 takes over immediately and lasts till 75%
    animText(t3, p, 0.77, 1); // Text 3 handles the home-stretch of the scroll section

    // Sticky 3D
    const sticky = document.querySelector(".sticky-container");
    if (p > 0 && p < 1) {
      sticky.style.transform =
        "scale(" + (1 + p * 0.04) + ") rotateX(" + (p - 0.5) * 3 + "deg)";
    } else sticky.style.transform = p >= 1 ? "scale(1.04) rotateX(1.5deg)" : "";

    // Parallax blobs
    if (!reduceMotion) {
      parallaxBgs.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.02;
        el.style.transform =
          "translateY(" + currentScroll * speed * -60 + "px)";
      });
    }

    requestAnimationFrame(masterLoop);
  }

  // function animText(el, p, start, end) {
  //     if (!el) return;
  //     const range = end - start, mid = start + range / 2;
  //     if (p >= start && p <= end) {
  //         let o = p <= mid ? (p - start) / (range / 2) : 1 - (p - mid) / (range / 2);
  //         const y = 50 * (1 - (p - start) / range), b = 8 * (1 - o);
  //         el.style.opacity = o;
  //         el.style.transform = 'translate(-50%,calc(-50% + ' + y + 'px))';
  //         el.style.filter = 'blur(' + b + 'px)';
  //         el.querySelectorAll('.parallax-text').forEach(c => {
  //             const sp = parseFloat(c.dataset.speed) || .1;
  //             c.style.transform = 'translateY(' + ((p - mid) * 180 * sp) + 'px)';
  //         });
  //     } else { el.style.opacity = 0; el.style.filter = 'blur(8px)'; }
  // }

  function animText(el, p, start, end) {
    if (!el) return;
    const range = end - start;

    if (p >= start && p <= end) {
      // Calculate progress percentage inside this specific text block (0 to 1)
      const localP = (p - start) / range;
      let o = 1;

      // ─── PLATEAU MATH ───
      if (localP < 0.2) {
        // Fade in smoothly during the first 20% of its scroll life
        o = localP / 0.2;
      } else if (localP > 0.8) {
        // Fade out smoothly only during the last 20% of its scroll life
        o = (1 - localP) / 0.2;
      } else {
        // STAY 100% VISIBLE for the middle 60% of the scroll track!
        o = 1;
      }

      const y = 30 * (1 - localP); // Reduced movement (30px instead of 50px) for stability
      const b = 6 * (1 - o); // Slightly cleaner max blur threshold

      el.style.opacity = o;
      el.style.transform = "translate(-50%, calc(-50% + " + y + "px))";
      el.style.filter = "blur(" + b + "px)";

      // Keep individual text element offsets tight and controlled
      el.querySelectorAll(".parallax-text").forEach((c) => {
        const sp = parseFloat(c.dataset.speed) || 0.1;
        c.style.transform = "translateY(" + (localP - 0.5) * 60 * sp + "px)";
      });
    } else {
      el.style.opacity = 0;
      el.style.filter = "blur(6px)";
    }
  }

  // === TYPEWRITER EFFECT ===
  const terminalBody = document.querySelector(".terminal-body");
  if (terminalBody) {
    const lines = [
      "> Strong foundation in semantic HTML, CSS3, JavaScript, Tailwind CSS, and Java.",
      "> Experience in responsive web design, UI/UX basics, website management, GitHub workflow, and frontend development.",
      "> Familiar with tools like VS Code, GitHub, Figma, Canva, Chrome DevTools, and LaTeX.",
    ];
    let lineIdx = 0;
    let charIdx = 0;
    let isTyping = false;
    const cursor = document.querySelector(".terminal-cursor");

    function typeLine() {
      if (lineIdx >= lines.length) return;
      if (charIdx === 0) {
        const p = document.createElement("p");
        p.className = "typewriter-text";
        p.id = "typewriter-line-" + lineIdx;
        terminalBody.insertBefore(p, cursor);
      }
      const p = document.getElementById("typewriter-line-" + lineIdx);
      p.textContent += lines[lineIdx].charAt(charIdx);
      charIdx++;
      if (charIdx < lines[lineIdx].length) {
        setTimeout(typeLine, 25 + Math.random() * 20);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(typeLine, 400);
      }
    }

    if (!reduceMotion) {
      const termObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !isTyping) {
              isTyping = true;
              setTimeout(typeLine, 600);
              termObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      termObs.observe(terminalBody);
    } else {
      lines.forEach((text) => {
        const p = document.createElement("p");
        p.className = "typewriter-text";
        p.textContent = text;
        terminalBody.insertBefore(p, cursor);
      });
    }
  }

  // Footer Interactions
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = copyEmailBtn.getAttribute("data-email");
      navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById("emailToast");
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => {
            toast.classList.remove("show");
          }, 2500);
        }
      });
    });
  }

  // Footer scroll reveal
  const footerEl = document.querySelector(".footer-premium");
  if (footerEl) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footerEl.classList.add("revealed");
            footerObserver.unobserve(footerEl);
          }
        });
      },
      { threshold: 0.15 },
    );
    footerObserver.observe(footerEl);

    // === Footer Mouse Follow Glow & Magnetic Hover ===
    if (!isTouch && !reduceMotion) {
      footerEl.addEventListener("mousemove", (e) => {
        const rect = footerEl.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        footerEl.style.setProperty("--footer-mouse-x", `${x}%`);
        footerEl.style.setProperty("--footer-mouse-y", `${y}%`);
      });

      // Magnetic link implementation
      const magneticElements = footerEl.querySelectorAll(
        ".magnetic-link, .magnetic-icon",
      );
      magneticElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
          el.style.transition = "none";
        });

        el.addEventListener("mouseleave", () => {
          el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
          el.style.transform = "translate(0px, 0px)";
        });
      });
    }
  }

  // === GLOBAL SPOTLIGHT MOUSE TRACKER ===
  if (!isTouch) {
    let activeSpotlightElement = null;

    window.addEventListener("mousemove", (e) => {
      // Target any core text element the mouse is currently moving over
      const targetText = e.target.closest(
        "h1, h2, h3, h4, p, a, button, span, li"
      );

      if (targetText) {
        // If we switched to a new element, clean up the old one
        if (activeSpotlightElement && activeSpotlightElement !== targetText) {
          activeSpotlightElement.style.removeProperty("--global-x");
          activeSpotlightElement.style.removeProperty("--global-y");
        }
        activeSpotlightElement = targetText;

        const rect = targetText.getBoundingClientRect();
        // Calculate exact X/Y relative to this specific element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Assign variables directly to the active element
        targetText.style.setProperty("--global-x", `${x}px`);
        targetText.style.setProperty("--global-y", `${y}px`);
      } else if (activeSpotlightElement) {
        // Mouse moved over empty space: clean up the active element
        activeSpotlightElement.style.removeProperty("--global-x");
        activeSpotlightElement.style.removeProperty("--global-y");
        activeSpotlightElement = null;
      }
    });

    document.addEventListener("mouseleave", () => {
      if (activeSpotlightElement) {
        activeSpotlightElement.style.removeProperty("--global-x");
        activeSpotlightElement.style.removeProperty("--global-y");
        activeSpotlightElement = null;
      }
    });
  }

  // === PROJECTS DRAG SCROLL ===
  const sliderTrack = document.querySelector(".projects-slider-track");
  if (sliderTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    sliderTrack.addEventListener("mousedown", (e) => {
      isDown = true;
      sliderTrack.classList.add("dragging");
      startX = e.pageX - sliderTrack.offsetLeft;
      scrollLeft = sliderTrack.scrollLeft;
    });

    sliderTrack.addEventListener("mouseleave", () => {
      isDown = false;
      sliderTrack.classList.remove("dragging");
    });

    sliderTrack.addEventListener("mouseup", () => {
      isDown = false;
      sliderTrack.classList.remove("dragging");
    });

    sliderTrack.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderTrack.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      sliderTrack.scrollLeft = scrollLeft - walk;
    });
  }

  masterLoop();
});
