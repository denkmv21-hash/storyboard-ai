'use client';

import Link from 'next/link';
import { Film, Wand2, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { AuthRedirect } from '@/components/auth-redirect';
import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/lib/translations';

export default function HomePage() {
  const { t } = useLanguage();
  const home = t.home;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 py-24 px-4 text-center">
        <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {home.heroTitle.split('Storyboards')[0]}
          <span className="text-primary"> Storyboards</span>
        </h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          {home.heroDescription}
        </p>

        <div className="flex gap-4">
          <AuthRedirect href="/signup">
            <Button size="lg" className="gap-2">
              <Wand2 className="h-4 w-4" />
              {home.startCreating}
            </Button>
          </AuthRedirect>
          <Link href="#features">
            <Button size="lg" variant="outline">
              {home.learnMore}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-16 px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">{home.howItWorks}</h2>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{home.step1Title}</h3>
            <p className="text-muted-foreground">
              {home.step1Description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{home.step2Title}</h3>
            <p className="text-muted-foreground">
              {home.step2Description}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Film className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{home.step3Title}</h3>
            <p className="text-muted-foreground">
              {home.step3Description}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">{home.simplePricing}</h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <PricingCard
              title={home.free}
              price="$0"
              description={home.freeDescription}
              features={[
                `10 ${home.creditsMonth}`,
                home.upToProjects.replace('{count}', '3'),
                home.standardQuality,
                home.watermarked,
              ]}
              t={home}
            />

            <PricingCard
              title={home.pro}
              price="$29.99"
              description={home.proDescription}
              features={[
                `500 ${home.creditsMonth}`,
                home.unlimitedProjects,
                home.highQuality,
                home.noWatermarks,
                home.prioritySupport,
              ]}
              popular
              t={home}
            />

            <PricingCard
              title={home.enterprise}
              price="$99.99"
              description={home.enterpriseDescription}
              features={[
                `2000 ${home.creditsMonth}`,
                home.unlimitedProjects,
                home.apiAccess,
                home.teamCollaboration,
                home.customModels,
              ]}
              t={home}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-16 px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">{home.readyToCreate}</h2>
        <p className="mb-8 text-muted-foreground">
          {home.readyToCreateDescription}
        </p>
        <AuthRedirect href="/signup">
          <Button size="lg">{home.getStartedFree}</Button>
        </AuthRedirect>
      </section>
    </div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  popular,
  t,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  t: typeof translations.en.home;
}) {
  return (
    <div className={`relative flex flex-col rounded-lg border p-6 ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          {t.mostPopular}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      <AuthRedirect href="/signup">
        <Button className="w-full" variant={popular ? 'default' : 'outline'}>
          {t.getStarted}
        </Button>
      </AuthRedirect>
    </div>
  );
}
