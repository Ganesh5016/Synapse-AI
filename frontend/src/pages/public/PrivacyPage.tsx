import React from 'react';
import { Shield, Lock, EyeOff, Database, CheckCircle2 } from 'lucide-react';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="success">Privacy & Data Rights</Badge>
        <h1 className="text-4xl font-extrabold text-primary-text tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted text-sm max-w-xl mx-auto">
          Last updated: October 2026. Your knowledge and notes are your intellectual property.
        </p>
      </div>

      <Card className="space-y-6 text-sm text-muted leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-light text-success flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl">1. Our Core Privacy Guarantee</CardTitle>
        </div>
        <p>
          Synapse was architected on a fundamental premise: <strong className="text-primary-text">We do not sell, rent, monetize, or train global models on your private documents or notes.</strong> Your uploaded materials exist solely to serve your personal cognitive retention workflows.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">2. Technical Protections & Row-Level Security</h3>
        <p>
          All persistent records (documents, chunks, flashcards, mastery scores, goals) are saved in a Supabase PostgreSQL instance protected by PostgreSQL Row-Level Security (RLS). Database policies check the signed cryptographic JWT user identifier before returning or modifying any data.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">3. Vector Embeddings & Processing</h3>
        <p>
          Uploaded documents are converted into dense vector embeddings using hosted Hugging Face inference APIs. Embeddings are stored in private pgvector tables accessible solely by your account.
        </p>

        <h3 className="font-bold text-primary-text text-base pt-4">4. Data Portability & Complete Deletion</h3>
        <p>
          In accordance with GDPR, CCPA, and ethical data standards, you retain the continuous right to export all your notes, flashcards, and telemetry in standard JSON format. You may also initiate a complete account deletion from your Settings page, which irrevocably purges all stored documents, embeddings, and profile rows.
        </p>
      </Card>
    </div>
  );
};
