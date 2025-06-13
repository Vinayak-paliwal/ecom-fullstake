import { cn } from "../../utils/cn";

const Input = ({ className, type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-2 border rounded-md focus:outline-none mt-1",
        "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
};

export default Input;
