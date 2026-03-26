import { Link } from "react-router-dom";

const Button = ({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const classes = `button button-${variant} button-${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
