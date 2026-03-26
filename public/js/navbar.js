document.addEventListener("DOMContentLoaded", function () {
  function updateNavbarState() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) {
      return;
    }

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  function notifyLocationChange() {
    window.requestAnimationFrame(updateNavbarState);
  }

  const originalPushState = history.pushState;
  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    notifyLocationChange();
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    notifyLocationChange();
    return result;
  };

  window.addEventListener("scroll", updateNavbarState, { passive: true });
  window.addEventListener("load", updateNavbarState);
  window.addEventListener("popstate", notifyLocationChange);

  updateNavbarState();
});
