import { auth } from "@/server/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "./logo";
import UserButton from "./user-button";
import CartDrawer from "../cart/cart-drawer";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            {" "}
            <Link href="/" aria-label="sprout-scribble logo">
              <Logo />
            </Link>
          </li>

          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link href="/auth/login" className="flex gap-2">
                  <LogIn size={20} />
                  <span>Login </span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
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
