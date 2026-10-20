import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, Shield, Users, Award, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="primary">Mission & Values</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          About Synapse
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Building the next generation of cognitive infrastructure to accelerate how humanity masters complex domains.
        </p>
      </div>

      {/* Origin & Philosophy */}
      <Card className="space-y-6">
        <CardTitle className="text-2xl">The Information Paradox</CardTitle>
        <p className="text-sm text-muted leading-relaxed">
          Today's students, engineers, and researchers have access to an infinite deluge of textbooks, papers, video lectures, and AI summaries. Yet, despite having more information than ever before, true retention and deep conceptual mastery remain elusive.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Passive consumption creates an illusion of competence: you feel like you understand while reading, but fail when tasked with novel problem solving under examination or real-world application. Synapse was designed to bridge this gap through rigorous, verifiable cognitive modeling.
        </p>
      </Card>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Grounded Precision</h3>
          <p className="text-xs text-muted leading-relaxed">
            AI should never hallucinate in high-stakes education. All responses must link to verified citations in your source materials.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Mathematical Modeling</h3>
          <p className="text-xs text-muted leading-relaxed">
            We use empirical psychometric frameworks (Bayesian Knowledge Tracing and SM-2) rather than ad-hoc heuristics to quantify mastery.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-success-light text-success flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Privacy By Architecture</h3>
          <p className="text-xs text-muted leading-relaxed">
            PostgreSQL Row-Level Security ensures that your personal notes, intellectual property, and performance telemetry belong solely to you.
          </p>
        </Card>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link to="/signup">
          <Button variant="primary" size="lg">
            Join Synapse Today <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
