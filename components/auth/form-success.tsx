import { CheckCircle2 } from "lucide-react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-teal-400/25 flex items-center font-medium my-4 text-sm gap-2 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
