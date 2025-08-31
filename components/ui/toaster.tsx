"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

const Toaster = () => {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      richColors
      theme={(theme as "light" | "dark" | "system" | undefined) || "system"}
    />
  );
};

export default Toaster;
