const ServiceContent = ({ title, description, items, className = "" }) => {
  return (
    <article className={`service-content-card ${className}`.trim()}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <div className="service-content-list">
        {items.map((item) => (
          <div key={item} className="service-content-item">
            <span className="service-content-bullet" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ServiceContent;
