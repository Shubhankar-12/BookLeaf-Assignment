"use client";

import { LogOut, User } from "lucide-react";

import { SocketIndicator } from "@/components/common/socket-indicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/30 px-4 md:px-6">
      <div className="md:hidden text-sm font-semibold">BookLeaf</div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <SocketIndicator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 px-2 hover:bg-muted"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              {user.role === "ADMIN" ? "Admin account" : "Author account"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => logout.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
