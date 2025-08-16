"use client";

import { LogIn } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const UserButton = ({ user }: Session) => {
  return (
    <>
      <h1>{user?.name}</h1>
      <Button onClick={() => signOut()}>
        <LogIn size={10} />
        <span>Sign out</span>
      </Button>
    </>
  );
};

export default UserButton;
