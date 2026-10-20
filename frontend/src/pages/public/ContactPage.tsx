import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="primary">Get In Touch</Badge>
        <h1 className="text-4xl font-extrabold text-primary-text tracking-tight">
          Contact & Support
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto">
          Have questions regarding cognitive modeling, academic research partnerships, or platform support? Send us a note!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-primary-text text-base">Direct Inquiries</h4>
            <p className="text-xs text-muted">support@synapse.edu</p>
            <p className="text-xs text-muted">research@synapse.edu</p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-primary-text text-base">Community</h4>
            <p className="text-xs text-muted">Join our Discord of cognitive science researchers and engineers.</p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-success-light text-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-primary-text">Message Received!</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Thank you for reaching out, {name}. Our research and support team will respond to {email} within 24 hours.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl">Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we will get back to you promptly.</CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="alex@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="E.g., BKT Parameter calibration or API inquiries"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-primary-text/90 tracking-wide">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or question..."
                    className="glass-input px-3.5 py-2.5 text-sm text-primary-text placeholder:text-muted/60 focus:outline-none"
                    required
                  />
                </div>

                <Button variant="primary" type="submit" isLoading={isLoading} className="w-full">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
