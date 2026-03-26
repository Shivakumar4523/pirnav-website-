import { useEffect, useRef } from "react";

const useRevealOnScroll = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "active", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
};

export default useRevealOnScroll;
