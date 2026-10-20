import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  LayoutDashboard, 
  Network, 
  BookOpen, 
  FileText, 
  Layers, 
  Clock, 
  Compass, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  User, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CommandPalette } from '../common/CommandPalette';
import { useAuth } from '../../hooks/useAuth';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isDemoMode } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Knowledge Graph', path: '/dashboard?tab=graph', icon: Network, badge: 'Live' },
    { label: 'Documents & Library', path: '/dashboard?tab=library', icon: BookOpen },
    { label: 'Research Notes', path: '/dashboard?tab=notes', icon: FileText },
    { label: 'Practice Center', path: '/dashboard?tab=practice', icon: Layers, badge: '6 Due' },
    { label: 'Flashcards Queue', path: '/dashboard?tab=flashcards', icon: Clock, badge: '14' },
    { label: 'Knowledge Gaps', path: '/dashboard?tab=gaps', icon: Compass, badge: '3' },
    { label: 'Study Planner', path: '/dashboard?tab=planner', icon: Calendar },
    { label: 'Grounded Assistant', path: '/dashboard?tab=assistant', icon: Sparkles },
    { label: 'Mastery Analytics', path: '/dashboard?tab=analytics', icon: BarChart3 },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'Settings & Export', path: '/settings', icon: Settings },
    { label: 'Help & Docs', path: '/faq', icon: HelpCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-primary-text flex relative overflow-x-hidden">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* MOBILE BACKDROP */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white/85 backdrop-blur-xl border-r border-muted-border/60 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-muted-border/60">
            <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-primary-text leading-tight">
                    Synapse
                  </span>
                  <span className="text-[10px] text-muted font-medium">Cognitive Engine</span>
                </div>
              )}
            </Link>

            {/* Collapse toggle (Desktop) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-secondary transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Close toggle (Mobile) */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-muted hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname + location.search === item.path ||
                               (item.path === '/dashboard' && location.pathname === '/dashboard' && !location.search);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold shadow-sm'
                      : 'text-muted hover:text-primary hover:bg-surface-secondary/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-muted-border/60">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-xl bg-surface-secondary/60`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full gradient-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-primary-text truncate">
                    {profile?.display_name || user?.email?.split('@')[0] || 'Learner'}
                  </p>
                  <p className="text-[10px] text-muted capitalize truncate">
                    {profile?.role || 'Student'} {isDemoMode && '(Demo)'}
                  </p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleSignOut}
                className="p-1 rounded-lg text-muted hover:text-error hover:bg-error-light/50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-muted-border/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-primary hover:bg-surface-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search / Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-muted-border/80 bg-surface-secondary/50 text-xs text-muted hover:border-primary/40 hover:bg-white transition-all w-72"
            >
              <Search className="w-3.5 h-3.5 text-muted" />
              <span className="flex-1 text-left">Search concepts, notes...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white rounded border border-muted-border shadow-2xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Command palette icon button for mobile */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="sm:hidden p-2 rounded-xl text-muted hover:text-primary hover:bg-surface-secondary"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-muted hover:text-primary hover:bg-surface-secondary relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card p-4 rounded-2xl shadow-xl border border-muted-border z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-muted-border/40 mb-3">
                    <span className="text-xs font-bold text-primary-text">Cognitive Alerts</span>
                    <Badge variant="primary">2 New</Badge>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-secondary/70 border border-muted-border/40">
                      <div className="font-semibold text-primary-text mb-0.5">Spaced Review Due</div>
                      <p className="text-muted text-[11px]">Transformer Positional Encoding is scheduled for retrieval to prevent decay.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-secondary/70 border border-muted-border/40">
                      <div className="font-semibold text-primary-text mb-0.5">Knowledge Gap Detected</div>
                      <p className="text-muted text-[11px]">Eigenvectors & SVD prerequisite check recommended before spectral clustering.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-accent text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-primary-text">
                  {profile?.display_name || 'My Account'}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card p-2 rounded-2xl shadow-xl border border-muted-border z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-primary-text hover:bg-surface-secondary transition-colors"
                  >
                    <User className="w-4 h-4 text-muted" />
                    <span>Profile & Knowledge Level</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-primary-text hover:bg-surface-secondary transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted" />
                    <span>Settings & Export</span>
                  </Link>
                  <div className="border-t border-muted-border/40 my-1" />
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-error hover:bg-error-light/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* OUTLET PAGE CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
