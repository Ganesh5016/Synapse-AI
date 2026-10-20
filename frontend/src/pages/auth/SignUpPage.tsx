import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, ArrowRight, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const signUpSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the Terms and Privacy Policy'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, enterDemoMode } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreeTerms: true,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setAuthError(null);

    const { error, user } = await signUp(data.email, data.password, data.displayName);
    setIsLoading(false);

    if (error) {
      setAuthError(error.message || 'Registration failed. Please check your credentials.');
    } else if (user) {
      // If user is returned immediately (or auto-confirmed), route to onboarding wizard
      navigate('/onboarding');
    } else {
      setEmailSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary-text">Synapse</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-primary-text tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted">
          Ground your knowledge in evidence and cognitive science
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Card className="p-6 sm:p-8">
          {emailSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-text">Verification Email Sent</h3>
              <p className="text-xs text-muted leading-relaxed">
                We sent a confirmation link to your email. Click the link to complete verification and begin your onboarding.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              {authError && (
                <div className="mb-6 p-3 rounded-xl bg-error-light border border-error/20 flex items-center gap-2 text-xs text-error font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Alex Chen"
                  error={errors.displayName?.message}
                  {...register('displayName')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@university.edu"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register('password')}
                />

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="mt-1 rounded text-primary focus:ring-primary h-4 w-4 border-muted-border"
                    {...register('agreeTerms')}
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-muted leading-tight">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-xs text-error font-medium">{errors.agreeTerms.message}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Create Account <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/90 text-muted font-medium">Or quick explore</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  enterDemoMode();
                  navigate('/dashboard');
                }}
                className="w-full border-primary/30 text-primary hover:bg-primary-light/40"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Try Instant Interactive Demo
              </Button>

              <p className="mt-6 text-center text-xs text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
