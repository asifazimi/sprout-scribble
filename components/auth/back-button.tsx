import { Button } from "@/components/ui/button";
import Link from "next/link";

const BackButton = ({ label, href }: { href: string; label: string }) => {
  return (
    <Button className="font-medium w-full" variant={"link"}>
      <Link href={href}></Link>
      {label}
    </Button>
  );
};

export default BackButton;
