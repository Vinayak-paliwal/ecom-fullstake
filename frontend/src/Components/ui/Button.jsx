import { cn } from "../../utils/cn";

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-all",
        "bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
