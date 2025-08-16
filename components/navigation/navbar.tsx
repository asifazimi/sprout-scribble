import { auth } from "@/server/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import UserButton from "./user-button";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <header className="bg-slate-500 p-4">
      <nav>
        <ul className="flex justify-between">
          <li>logo</li>

          {!session ? (
            <li>
              <Button asChild>
                <Link href="auth/login">
                  <LogIn size={10} />
                  <span>Sign in</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires ?? ""} user={user} />{" "}
              {/* It is like the login button */}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
