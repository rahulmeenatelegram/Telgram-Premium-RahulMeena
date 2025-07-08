import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { User, Settings, LogOut, Shield, Moon, Sun, Monitor, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const { setTheme, theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const isAdmin = user?.email === "disruptivefounder@gmail.com";

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-lg sm:text-xl lg:text-2xl font-light tracking-wide text-foreground hover:text-primary transition-colors cursor-pointer">
                Onetapay
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/">
              <div className={`text-sm font-light transition-colors cursor-pointer ${
                location === "/" ? "text-primary" : "text-foreground hover:text-primary"
              }`}>
                Home
              </div>
            </Link>
            <Link href="/about">
              <div className={`text-sm font-light transition-colors cursor-pointer ${
                location === "/about" ? "text-primary" : "text-foreground hover:text-primary"
              }`}>
                About
              </div>
            </Link>
            <Link href="/contact">
              <div className={`text-sm font-light transition-colors cursor-pointer ${
                location === "/contact" ? "text-primary" : "text-foreground hover:text-primary"
              }`}>
                Contact
              </div>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border-white/10">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && user.emailVerified ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect border-white/10" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-3">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button className="bg-white text-black hover:bg-white/90 text-sm px-4 py-2 font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border-white/10">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5">
            <div className="py-4 space-y-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`block px-3 py-2 text-sm font-light transition-colors ${
                  location === "/" ? "text-primary" : "text-foreground hover:text-primary"
                }`}>
                  Home
                </div>
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`block px-3 py-2 text-sm font-light transition-colors ${
                  location === "/about" ? "text-primary" : "text-foreground hover:text-primary"
                }`}>
                  About
                </div>
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`block px-3 py-2 text-sm font-light transition-colors ${
                  location === "/contact" ? "text-primary" : "text-foreground hover:text-primary"
                }`}>
                  Contact
                </div>
              </Link>
              
              <div className="pt-4 border-t border-white/5">
                {user && user.emailVerified ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center px-3 py-2 text-sm font-light text-foreground hover:text-primary transition-colors">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </div>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center px-3 py-2 text-sm font-light text-foreground hover:text-primary transition-colors">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center px-3 py-2 text-sm font-light text-foreground hover:text-primary transition-colors w-full text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="bg-white text-black hover:bg-white/90 text-sm px-4 py-2 font-medium w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}