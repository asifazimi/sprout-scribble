import { AlertCircle } from "lucide-react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive flex items-center font-medium my-4 text-sm gap-2 text-secondary-foreground p-3 rounded-md">
      <AlertCircle />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
