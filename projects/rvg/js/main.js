/*
 * RVG Construct homepage interactions.
 * Keep this file dependency-free so the prototype can be moved to WordPress
 * without introducing a front-end build step.
 */

(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* The header state is intentionally driven by one passive scroll listener. */
    const header = document.querySelector(".header");
    if (header) {
        const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 80);
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    /* Animate figures only once; fall back to their final value for reduced motion. */
    const counters = document.querySelectorAll("[data-count]");
    const animateCounter = (counter) => {
        const target = Number(counter.dataset.count);
        if (!Number.isFinite(target)) return;

        if (prefersReducedMotion) {
            counter.textContent = `${target}+`;
            return;
        }

        const duration = 900;
        const startTime = performance.now();
        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            counter.textContent = `${Math.round(target * progress)}+`;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.6 });
        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* Pointer events cover mouse and touch without duplicate event handlers. */
    const comparison = document.querySelector("#comparison");
    if (comparison) {
        const before = comparison.querySelector(".before");
        const handle = comparison.querySelector(".comparison-handle");
        let isDragging = false;

        const updateComparison = (clientX) => {
            const rect = comparison.getBoundingClientRect();
            const position = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            before.style.width = `${position}%`;
            handle.style.left = `${position}%`;
        };

        comparison.addEventListener("pointerdown", (event) => {
            isDragging = true;
            comparison.setPointerCapture(event.pointerId);
            updateComparison(event.clientX);
        });
        comparison.addEventListener("pointermove", (event) => {
            if (isDragging) updateComparison(event.clientX);
        });
        comparison.addEventListener("pointerup", () => { isDragging = false; });
        comparison.addEventListener("pointercancel", () => { isDragging = false; });
    }

    /* Reusable one-time reveal observer for editorial project cards. */
    const projectCards = document.querySelectorAll(".project-card");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });
        projectCards.forEach((card) => {
            card.classList.add("reveal-item");
            revealObserver.observe(card);
        });
    } else {
        projectCards.forEach((card) => card.classList.add("visible"));
    }

    /* Section-level reveals use one observer and never affect the hero content. */
    const revealTargets = document.querySelectorAll([
        ".trust-grid",
        ".comparison-slider",
        ".process-layout",
        ".reviews-layout",
        ".faq-layout",
        ".rvg-cta-grid",
        ".rvg-footer-top"
    ].join(","));

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealTargets.forEach((target) => {
            target.classList.add("scroll-reveal");
            sectionObserver.observe(target);
        });
    }

    /* The active process step is shared by hover, click and keyboard users. */
    const processTabs = [...document.querySelectorAll(".process-tab")];
    const processPreview = document.querySelector(".process-preview img");
    const previewLabel = document.querySelector(".preview-card strong");
    let previewTimer;

    const activateProcessTab = (tab) => {
        if (!processPreview || !tab?.dataset.image) return;
        processTabs.forEach((item) => item.classList.toggle("active", item === tab));
        window.clearTimeout(previewTimer);

        if (prefersReducedMotion) {
            processPreview.src = `assets/images/${tab.dataset.image}`;
        } else {
            processPreview.style.opacity = "0";
            previewTimer = window.setTimeout(() => {
                processPreview.src = `assets/images/${tab.dataset.image}`;
                processPreview.style.opacity = "1";
            }, 220);
        }

        if (previewLabel) previewLabel.textContent = tab.querySelector("h3")?.textContent || "";
    };

    processTabs.forEach((tab) => {
        tab.addEventListener("mouseenter", () => activateProcessTab(tab));
        tab.addEventListener("click", () => activateProcessTab(tab));
        tab.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateProcessTab(tab);
            }
        });
    });

    /* Review content remains data-driven, making a future CMS integration simple. */
    const reviews = [
        {
            text: "RVG ne-a ajutat să transformăm apartamentul vechi într-un spațiu modern și exact cum ni l-am imaginat.",
            client: "Maria & Andrei",
            project: "Apartament premium • 120 m²",
            image: "review-1.jpg"
        },
        {
            text: "Procesul a fost clar, echipa profesionistă, iar rezultatul a depășit așteptările.",
            client: "Elena",
            project: "Casă privată • 250 m²",
            image: "review-2.jpg"
        }
    ];

    const reviewQuote = document.querySelector(".review-content blockquote");
    const reviewClient = document.querySelector(".client strong");
    const reviewProject = document.querySelector(".client span");
    const reviewImage = document.querySelector(".review-image img");
    let currentReview = 0;

    const updateReview = () => {
        if (!reviewQuote || !reviewClient || !reviewProject || !reviewImage) return;
        const review = reviews[currentReview];
        reviewQuote.textContent = `“${review.text}”`;
        reviewClient.textContent = review.client;
        reviewProject.textContent = review.project;
        reviewImage.src = `assets/images/${review.image}`;
    };

    document.querySelector(".review-next")?.addEventListener("click", () => {
        currentReview = (currentReview + 1) % reviews.length;
        updateReview();
    });
    document.querySelector(".review-prev")?.addEventListener("click", () => {
        currentReview = (currentReview - 1 + reviews.length) % reviews.length;
        updateReview();
    });

    /* Only one FAQ answer stays expanded, reducing visual noise. */
    document.querySelectorAll(".faq-item").forEach((item) => {
        const button = item.querySelector("button");
        if (!button) return;
        button.addEventListener("click", () => {
            const willOpen = !item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach((other) => other.classList.remove("active"));
            item.classList.toggle("active", willOpen);
        });
    });

    /* This controls presentation only; a WordPress/AJAX handler will submit the form later. */
    const form = document.querySelector("#rvgLeadForm");
    if (form) {
        const steps = [...form.querySelectorAll(".rvg-step")];
        const indicators = [...document.querySelectorAll(".rvg-form-steps span")];
        let currentStep = 0;

        const showStep = (index) => {
            currentStep = Math.max(0, Math.min(index, steps.length - 1));
            steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === currentStep));
            indicators.forEach((indicator, stepIndex) => indicator.classList.toggle("active", stepIndex === currentStep));
        };

        form.querySelectorAll(".rvg-next").forEach((button) => {
            button.addEventListener("click", () => showStep(currentStep + 1));
        });
        form.querySelector(".rvg-back")?.addEventListener("click", () => showStep(currentStep - 1));
        form.addEventListener("submit", (event) => event.preventDefault());
    }

    /* The menu state is kept on both controls for future accessibility styling. */
    const menuButton = document.querySelector(".rvg-menu-toggle");
    const mobileMenu = document.querySelector(".rvg-mobile-menu");
    if (menuButton && mobileMenu) {
        const toggleMenu = (force) => {
            const isOpen = typeof force === "boolean" ? force : !mobileMenu.classList.contains("active");
            mobileMenu.classList.toggle("active", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("menu-open", isOpen);
        };
        menuButton.addEventListener("click", () => toggleMenu());
        mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") toggleMenu(false);
        });
    }
})();
