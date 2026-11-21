import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, enterDemoMode } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);

    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network') || msg.includes('521') || msg.includes('503')) {
        setAuthError('Supabase project is paused or sleeping. Please unpause/restore it in your Supabase Dashboard, or click "Continue as Demo Learner" below.');
      } else {
        setAuthError(msg || 'Invalid email or password');
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoSignIn = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary-text">Synapse</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-primary-text tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted">
          Resume your personalized knowledge journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Card className="p-6 sm:p-8">
          {authError && (
            <div className="mb-6 p-3 rounded-xl bg-error-light border border-error/20 flex items-center gap-2 text-xs text-error font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@university.edu"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-primary-text/90 tracking-wide">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`glass-input w-full px-3.5 py-2.5 text-sm text-primary-text placeholder:text-muted/60 ${
                  errors.password ? 'border-error' : 'border-muted-border/80'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-error font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick Demo Mode Access */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted-border/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/90 text-muted font-medium">Or instant access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleDemoSignIn}
            className="w-full border-primary/30 text-primary hover:bg-primary-light/40"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Continue as Guest Scholar
          </Button>

          <p className="mt-6 text-center text-xs text-muted">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up for free
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
