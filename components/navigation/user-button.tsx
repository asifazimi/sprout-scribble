"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const setSwitchState = () => {
    switch (theme) {
      case "dark":
        return setChecked(true);
      case "light":
        return setChecked(false);
      case "system":
        return setChecked(false);
    }
  };

  useEffect(() => {
    setSwitchState();
  }, []);

  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7 cursor-pointer">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name!}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary/25">
                <div className="font-bold ">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-6" align="end">
          <div className="mb-4 p-4 flex flex-col gap-1 items-center bg-primary/10 rounded-lg w-full max-w-xs ">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name!}
                width="36"
                height="36"
                className="rounded-full object-cover"
              />
            )}
            <p className="font-bold text-xs w-full text-center truncate ">
              {user.name}
            </p>
            <span className="text-xs font-medium text-secondary-foreground w-full text-center truncate ">
              {user.email}
            </span>
          </div>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className=" group py-2 font-medium cursor-pointer"
            onClick={() => router.push("/dashboard/orders")}
          >
            {" "}
            <TruckIcon
              size={14}
              className="mr-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            />
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="py-2 font-medium cursor-pointer group ease-in-out"
          >
            <Settings
              size={14}
              className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            />
            Settings
          </DropdownMenuItem>
          {theme && (
            <DropdownMenuItem className="py-2 font-medium cursor-pointer ease-in-out">
              <div
                className="flex items-center group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex mr-4">
                  <Sun
                    size={14}
                    className=" group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-750 ease-in-out"
                  />
                  <Moon
                    size={14}
                    className="group-hover:text-blue-400   scale-0 rotate-90 dark:rotate-0  dark:scale-100 transition-all ease-in-out duration-750"
                  />
                </div>
                <p className="dark:text-blue-400 mr-3  text-yellow-600">
                  {theme[0].toUpperCase() + theme.slice(1)} Mode
                </p>
                <Switch
                  className="scale-80"
                  checked={checked}
                  onCheckedChange={(e) => {
                    setChecked((prev) => !prev);
                    if (e) setTheme("dark");
                    if (!e) setTheme("light");
                  }}
                />
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="py-2 focus:bg-destructive/30
             group font-medium cursor-pointer transition-all duration-500"
            onClick={() => signOut()}
          >
            <LogOut
              size={14}
              className="mr-2 group-hover:scale-90 transition-all duration-300 ease-in-out"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default UserButton;
