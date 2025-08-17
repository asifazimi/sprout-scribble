"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <span>Sign in with Google</span>
        <FcGoogle className="w-5 h-5 ml-2" />
      </Button>
      <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        <span>Sign in with Github</span>
        <FaGithub className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default Socials;
