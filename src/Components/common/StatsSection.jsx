import { useEffect, useRef } from "react";
import useRevealOnScroll from "./useRevealOnScroll";

const StatsSection = ({ items, className = "" }) => {
  const ref = useRevealOnScroll();
  const statsRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = statsRef.current;
    if (!section) return undefined;

    const animateNumbers = () => {
      const numbers = section.querySelectorAll(".stat-number");
      numbers.forEach((el) => {
        const target = Number(el.dataset.target);
        if (!Number.isFinite(target)) return;
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const startTime = window.performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);
          const value = Math.round(eased * target);
          el.textContent = `${value}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          } else {
            el.textContent = `${target}${suffix}`;
            el.classList.add("stat-bounce");
            window.setTimeout(() => {
              el.classList.remove("stat-bounce");
            }, 480);
          }
        };

        window.requestAnimationFrame(tick);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasAnimatedRef.current) return;
          section.classList.add("stats-animate");
          animateNumbers();
          hasAnimatedRef.current = true;
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const renderValue = (value) => {
    const stringValue = String(value);
    const match = stringValue.match(/(\d+)(.*)/);
    const numberPart = match ? match[1] : stringValue.replace(/\D/g, "");
    const suffixPart = match ? match[2] : stringValue.replace(/\d/g, "");
    const initialValue = `${numberPart ? "0" : stringValue}${suffixPart}`;

    return (
      <span
        className="stat-number"
        data-target={numberPart}
        data-suffix={suffixPart}
        aria-label={stringValue}
      >
        {initialValue}
      </span>
    );
  };

  return (
    <section
      ref={statsRef}
      className={`section-block section-wrapper stats-section ${className}`.trim()}
    >
      <div ref={ref} className="section-shell reveal">
        <div className="stats-grid">
          {items.map((item, index) => (
              <article
                key={item.label}
                className="stat-card reveal"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
              <h2>{renderValue(item.value)}</h2>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
