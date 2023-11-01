import { ChangeEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { LogOutIcon, Search } from "lucide-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { login, logout, register, user } = useKindeAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");

  const handleSearchSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams((params) => {
      params.set("q", query);
      return params;
    });
  };

  return (
    <header className="bg-zinc-50 ">
      <nav className="flex h-14  items-center justify-between p-5 w-full max-w-7xl mx-auto">
        <Link to={"/"}>Do 📂</Link>
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-stretch gap-2 md:w-full max-w-lg "
        >
          <Input
            id="name"
            placeholder="my cool document"
            className="flex-1"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button type="submit">
            <Search className="w-4 h-4" />
          </Button>
        </form>
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.picture!} />
                  <AvatarFallback>
                    {user.given_name
                      ? user.given_name[0]
                      : user.family_name
                      ? user.family_name[0]
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  {user?.given_name} {user?.family_name}
                </DropdownMenuItem>
                <DropdownMenuItem>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button onClick={logout}>
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-stretch gap-2">
            <Button onClick={async () => await login({})}>login</Button>
            <Button onClick={async () => await register({})}>register</Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
