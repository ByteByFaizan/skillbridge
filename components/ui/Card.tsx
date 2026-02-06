import { type HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`skillbridge-card ${hover ? "hover:-translate-y-0.5" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 pt-6 pb-2 ${className}`} {...props} />
);

export const CardTitle = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-[var(--foreground)] ${className}`} {...props} />
);

export const CardContent = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 pb-6 ${className}`} {...props} />
);

export default Card;
