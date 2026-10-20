import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Brain, ChevronRight, Sparkles, Shield, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text flex flex-col relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Ambient background light glow meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-success/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/10 py-1.5 px-4 text-center text-xs font-medium text-primary flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Synapse v1.0 is live — Grounded AI and Bayesian Knowledge Tracing for serious learners.</span>
        <Link to="/signup" className="underline font-semibold ml-1 inline-flex items-center hover:opacity-80">
          Try it free <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-muted-border/60 bg-white/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-primary-text flex items-center gap-1.5">
                Synapse <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">v1.0</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light/50 font-semibold'
                      : 'text-muted hover:text-primary hover:bg-surface-secondary/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Start Learning <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-muted-border/70 bg-white/60 backdrop-blur-md pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-primary-text">Synapse</span>
              </Link>
              <p className="text-sm text-muted max-w-sm leading-relaxed">
                Personalized, evidence-based cognitive mastery platform. Synthesizing personal documents, Bayesian knowledge models, and interactive networks.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-light text-success text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>PostgreSQL Row-Level Security Enforced</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-muted">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features Overview</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Cognitive Science</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Personal Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-muted">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Synapse</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact & Support</Link></li>
                <li>
                  <a href="https://huggingface.co" target="_blank" rel="noreferrer" className="inline-flex items-center hover:text-primary transition-colors">
                    Hugging Face AI <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-4">Legal & Trust</h4>
              <ul className="space-y-2.5 text-sm text-muted">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><span className="text-xs text-muted/80">Zero User Data Training Guarantee</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-muted-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
            <p>© {new Date().getFullYear()} Synapse — AI Knowledge Evolution Platform. Strictly Light Glassmorphic Architecture.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-secondary transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-secondary transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
