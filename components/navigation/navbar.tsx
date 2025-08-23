import { auth } from "@/server/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "./logo";
import UserButton from "./user-button";
import { Session } from "next-auth";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            {" "}
            <Link href="/" aria-label="sprout-scribble logo">
              <Logo />
            </Link>
          </li>

          {!session ? (
            <li>
              <Button asChild>
                <Link href="/auth/login" className="flex items-center gap-2">
                  <LogIn size={20} />
                  <span>Login </span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton
                expires={session?.expires ?? ""}
                user={session.user}
              />{" "}
              {/* It is like the login button */}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
