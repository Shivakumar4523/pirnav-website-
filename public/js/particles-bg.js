document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("particles-js");

  if (!container || !window.tsParticles) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.tsParticles.load("particles-js", {
    fullScreen: {
      enable: false,
    },
    fpsLimit: prefersReducedMotion ? 30 : 60,
    detectRetina: true,
    background: {
      color: "transparent",
    },
    particles: {
      number: {
        value: prefersReducedMotion ? 24 : 60,
      },
      color: {
        value: "#ffffff",
      },
      links: {
        enable: true,
        distance: 150,
        color: "#4dabff",
        opacity: 0.4,
      },
      move: {
        enable: true,
        speed: prefersReducedMotion ? 0.35 : 1,
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
      },
      opacity: {
        value: 0.6,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
        resize: true,
      },
    },
  });
});
