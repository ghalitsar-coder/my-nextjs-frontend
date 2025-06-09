"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import CartButton from "@/app/components/cart/CartButton";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
}

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data) {
          setUser({
            id: session.data.user.id,
            name: session.data.user.name || session.data.user.email,
            email: session.data.user.email,
            role: "customer", // Better-auth user doesn't have role by default
            image: session.data.user.image || undefined,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Remove cart count logic since we're using Zustand store
  useEffect(() => {}, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navigationItems = [
    {
      title: "Menu",
      href: "/coffee-list",
      description: "Browse our coffee selection",
    },
    {
      title: "About",
      href: "/about",
      description: "Learn about our coffee journey",
    },
    {
      title: "Contact",
      href: "/contact",
      description: "Get in touch with us",
    },
  ];

  if (isLoading) {
    return (
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className} `}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <TooltipProvider>
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className} `}
      >
        <div className="container flex h-16 items-center justify-between  mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#c08450] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-[#c08450]">
                CoffeeShop
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {" "}
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      asChild
                    >
                      <Link href={item.href}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>{" "}
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <CartButton />

            {/* Auth Section */}
            {isLoading ? (
              // Loading State
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            ) : user ? (
              // Authenticated User Menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-[#c08450] text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>{" "}
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        {user.role && (
                          <Badge
                            variant={
                              user.role === "admin"
                                ? "destructive"
                                : user.role === "cashier"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/order-history">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated Actions
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#c08450] hover:bg-[#a0703e]">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#c08450] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="font-bold text-xl text-[#c08450]">
                        CoffeeShop
                      </span>
                    </div>
                    <Separator />
                    <nav className="flex flex-col space-y-2">
                      {navigationItems.map((item) => (
                        <Button
                          key={item.title}
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href={item.href}>{item.title}</Link>
                        </Button>
                      ))}
                    </nav>{" "}
                    <Separator />
                    {isLoading ? (
                      <div className="flex items-center space-x-3 p-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    ) : user ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-3 p-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback className="bg-[#c08450] text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>{" "}
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{user.name}</p>
                              {user.role && (
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "destructive"
                                      : user.role === "cashier"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/order");
                          }}
                        >
                          Order History
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/profile");
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="destructive"
                          className="justify-start"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/login");
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="bg-[#c08450] hover:bg-[#a0703e]"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/register");
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
