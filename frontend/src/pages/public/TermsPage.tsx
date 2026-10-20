import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="secondary">Legal Agreement</Badge>
        <h1 className="text-4xl font-extrabold text-primary-text tracking-tight">
          Terms of Service
        </h1>
        <p className="text-muted text-sm max-w-xl mx-auto">
          Effective October 2026. Please read these terms carefully before utilizing Synapse.
        </p>
      </div>

      <Card className="space-y-6 text-sm text-muted leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
        </div>
        <p>
          By creating an account or accessing the Synapse platform, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">2. Academic Integrity & Lawful Use</h3>
        <p>
          Synapse is designed to assist independent study, concept consolidation, and self-assessment. Users agree not to utilize the platform for academic dishonesty, test proctoring circumvention, unauthorized document scraping, or infringement of copyright.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">3. User Content Ownership</h3>
        <p>
          You retain complete copyright and intellectual property rights over any notes, documents, or content you upload to the platform.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">4. Service Availability & Disclaimers</h3>
        <p>
          The platform is provided "as is" and "as available". While we maintain continuous high availability and automated backup protocols, users are encouraged to maintain copies of essential primary documents.
        </p>
      </Card>
    </div>
  );
};
