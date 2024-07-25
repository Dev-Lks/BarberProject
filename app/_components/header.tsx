"use client";

import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { signOut, signIn, useSession } from "next-auth/react";

const Header = () => {
  const { data } = useSession();
  const handleLogoutClick = () => signOut();
  const handleLoginClick = () => signIn("google");
  return (
    <header>
      <Card>
        <CardContent className="p-5 justify-between flex flex-row items-center">
          <Link href={"/"}>
            <p className="text-sm font-extrabold text-white">
              Barbearia<span className="text-primary">Caio</span>
            </p>
          </Link>

          <div className="hidden lg:block">
            {data?.user ? (
              <div className="flex justify-between items-center px-2 py-3 gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      className="rounded-full"
                      src={data.user?.image ?? "a"}
                    />
                  </Avatar>
                  <h2 className="font-bold">{data.user.name}</h2>
                </div>

                <Button
                  onClick={handleLogoutClick}
                  size="icon"
                  variant="secondary"
                >
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <div className="flex items-center px-2 py-3 gap-3">
                <div className="flex items-center gap-2 ">
                  <UserIcon size={32} />
                </div>
                <Button
                  onClick={handleLoginClick}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <LogInIcon className="mr-2" size={18} />
                  Fazer Login
                </Button>
              </div>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" variant="outline" size="icon">
                <MenuIcon size={16} />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
