import { cn } from "../../utils/cn";

const Card = ({ className, children }) => {
  return (
    <div className={cn("border border-gray-200 rounded-lg shadow-sm bg-white p-4 ", className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => {
  return (
    <div className={cn("text-lg font-semibold border-b pb-2 mb-2", className)}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children }) => {
  return <div className={cn("text-gray-700", className)}>{children}</div>;
};

const CardFooter = ({ className, children }) => {
  return <div className={cn("border-t pt-2 mt-2 text-sm", className)}>{children}</div>;
};

// Export components for modular use
export { Card, CardHeader, CardContent, CardFooter };
