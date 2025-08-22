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
import Image from "next/image";

const UserButton = ({ user }: Session) => {
  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar>
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name!}
                width={32}
                height={32}
                className="rounded-full object-cover cursor-pointer"
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
          <div className="mb-4 p-4 flex flex-col gap-1 items-center bg-primary/10 rounded-lg">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name!}
                width="36"
                height="36"
                className="rounded-full"
              />
            )}
            <p className="font-bold text-xs">{user.name}</p>
            <span className="text-xs font-medium text-secondary-foreground">
              {user.email}
            </span>
          </div>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className=" group py-2 font-medium cursor-pointer transition-all duration-500">
            {" "}
            <TruckIcon
              size={14}
              className="mr-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            />
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 group">
            <Settings
              size={14}
              className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
            <div className="flex items-center">
              <Sun size={14} className="mr-2" />
              <Moon size={14} className="mr-2" />
              <p>
                Theme <span>theme</span>
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2 focus:bg-destructive/30
             group font-medium cursor-pointer transition-all duration-500"
            onClick={() => signOut()}
          >
            <LogOut
              size={14}
              className="mr-3 group-hover:scale-90 transition-all duration-300 ease-in-out"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default UserButton;
