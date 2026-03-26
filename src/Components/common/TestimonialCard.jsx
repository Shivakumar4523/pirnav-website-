import useRevealOnScroll from "./useRevealOnScroll";

const TestimonialCard = ({ quote, name, role, delay = 0 }) => {
  const ref = useRevealOnScroll();

  return (
    <article
      ref={ref}
      className="testimonial-card reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-meta">
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
    </article>
  );
};

export default TestimonialCard;
