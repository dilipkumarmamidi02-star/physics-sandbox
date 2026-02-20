import { useAuth } from '@/lib/AuthContext';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Atom,
  Home,
  FlaskConical,
  BookOpen,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authUser) setUser(authUser);
  }, [authUser]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await Promise.resolve(null);
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const navLinks = [
    { name: 'Home', href: 'Home', icon: Home },
    { name: 'Laboratory', href: 'Laboratory', icon: FlaskConical },
    { name: 'My Progress', href: 'Progress', icon: BarChart3 },
    { name: 'Learn', href: 'Learn', icon: BookOpen },
    { name: 'Assignments', href: 'StudentAssignments', icon: BookOpen },
    { name: 'My Teachers', href: 'ConnectTeacher', icon: User },
  ];

  const isActive = (href) => {
    const currentPage = location.pathname.split('/').pop() || 'Home';
    return currentPage === href;
  };

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isStudent = !isTeacher;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Atom className="w-6 h-6 lg:w-7 lg:h-7 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PHX-MASTER
                </h1>
                <p className="text-[10px] lg:text-xs text-slate-500 -mt-1">Virtual Physics Lab</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.name} to={createPageUrl(link.href)}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 rounded-xl transition-all ${
                        isActive(link.href)
                          ? 'text-cyan-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.name}
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isTeacher && (
                <Link to={createPageUrl('TeacherDashboard')}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden lg:flex border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Teacher
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link to={createPageUrl('AdminDashboard')}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden lg:flex border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5"
                    >
                      <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{user.full_name || 'User'}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      {isAdmin && (
                        <Badge className="mt-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Profile')} className="text-slate-300 hover:text-white cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Progress')} className="text-slate-300 hover:text-white cursor-pointer">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        My Progress
                      </Link>
                    </DropdownMenuItem>
                    {isTeacher && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('TeacherDashboard')} className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Teacher Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('StudentAssignments')} className="text-slate-300 hover:text-white cursor-pointer">
                        <FlaskConical className="w-4 h-4 mr-2" />
                        My Assignments
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('AdminDashboard')} className="text-purple-400 hover:text-purple-300 cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => logout()}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2 items-center">
                  <Link to={createPageUrl('RoleSelect')}>
                    <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hidden sm:flex">
                      Choose Role
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => (window.location.href = "/ConnectTeacher")}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-slate-900/98 backdrop-blur-xl border-b border-white/5"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={createPageUrl(link.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive(link.href) ? 'bg-white/5 text-cyan-400' : 'text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {link.name}
                    </Button>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to={createPageUrl('AdminDashboard')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start text-purple-400">
                    <Crown className="w-5 h-5 mr-3" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
}
