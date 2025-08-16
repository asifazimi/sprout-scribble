import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

const BackButton = ({ label, href }: { href: string; label: string }) => {
  return (
    <Button className="font-medium w-full">
      <Link href={href}></Link>
      {label}
    </Button>
  );
};

export default BackButton;
