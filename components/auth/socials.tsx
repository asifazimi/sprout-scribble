"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

const Socials = () => {
  return (
    <>
      <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Sign in with Google
      </Button>
      <Button onClick={() => signIn("github", { callbackUrl: "/" })}>
        Sign in Github
      </Button>
    </>
  );
};

export default Socials;
