'use client';

import Link from 'next/link';
import { Film, Video, Mountain, Wand2, Upload, Sparkles, Share2, Zap, Shield, ChevronRight, Star, Play, ArrowRight, Clock, Users, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui';
import { AuthRedirect } from '@/components/auth-redirect';
import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/lib/translations';

export default function HomePage() {
  const { t, language } = useLanguage();
  const home = language === 'ru' ? t.home : t.homeEn;
  const features = t.features;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        
        <div className="container relative mx-auto flex flex-col items-center justify-center gap-8 py-32 px-4 text-center sm:py-40 lg:py-48">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{home.badgeText}</span>
          </div>

          <h1 className="max-w-6xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {home.heroTitlePart1}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> {home.heroTitlePart2}</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-muted-foreground">{home.heroTitlePart3}</span>
          </h1>

          <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl leading-relaxed">
            {home.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#services">
              <Button size="lg" className="gap-2 h-12 px-8 text-base">
                {home.exploreServices}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                <Play className="h-4 w-4" />
                {home.contactUs}
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 sm:gap-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">2020</div>
              <div className="text-sm text-muted-foreground">{home.foundedYear}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">{home.projectsInDev}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">{home.fullCycle}</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--background)"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="container relative mx-auto py-24 px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">{home.aboutTitle}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {home.aboutText1}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {home.aboutText2}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <AboutStat icon={<Clock className="h-6 w-6" />} value="2020" label={home.founded} />
              <AboutStat icon={<Film className="h-6 w-6" />} value="4" label={home.flagshipProjects} />
              <AboutStat icon={<Mountain className="h-6 w-6" />} value="СКФО" label={home.region} />
              <AboutStat icon={<Target className="h-6 w-6" />} value="100%" label={home.turnkey} />
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border p-8 flex items-center justify-center">
              <div className="text-center">
                <Film className="h-32 w-32 mx-auto text-primary opacity-50" />
                <p className="mt-4 text-lg font-semibold">{home.productionHouse}</p>
                <p className="text-muted-foreground">Пятигорск, Ставропольский край</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-muted/50 py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">{home.servicesTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {home.servicesDescription}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ServiceCard
              icon={<Video className="h-10 w-10" />}
              title={home.service1Title}
              description={home.service1Description}
              features={home.service1Features}
              gradient="from-blue-500/20 to-cyan-500/20"
              link="/services/video"
            />
            <ServiceCard
              icon={<Film className="h-10 w-10" />}
              title={home.service2Title}
              description={home.service2Description}
              features={home.service2Features}
              gradient="from-purple-500/20 to-pink-500/20"
              link="/services/animation"
            />
            <ServiceCard
              icon={<Mountain className="h-10 w-10" />}
              title={home.service3Title}
              description={home.service3Description}
              features={home.service3Features}
              gradient="from-orange-500/20 to-red-500/20"
              link="/services/caucasus"
              popular
            />
          </div>
        </div>
      </section>

      {/* Production Cycle Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{home.cycleTitle}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {home.cycleDescription}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <CycleCard
            number="01"
            title={home.preProduction}
            icon={<Upload className="h-6 w-6" />}
            items={home.preProductionItems}
          />
          <CycleCard
            number="02"
            title={home.production}
            icon={<Film className="h-6 w-6" />}
            items={home.productionItems}
          />
          <CycleCard
            number="03"
            title={home.postProduction}
            icon={<Share2 className="h-6 w-6" />}
            items={home.postProductionItems}
          />
        </div>
      </section>

      {/* AI Storyboard Service */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-24 px-4">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Wand2 className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">{home.storyboardTitle}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {home.storyboardDescription}
              </p>
              <ul className="space-y-4 mb-8">
                {home.storyboardFeatures.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <AuthRedirect href="/signup">
                <Button size="lg" className="gap-2">
                  <Wand2 className="h-5 w-5" />
                  {home.tryStoryboard}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </AuthRedirect>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border p-8 flex items-center justify-center">
                <div className="text-center">
                  <Wand2 className="h-24 w-24 mx-auto text-primary opacity-50" />
                  <p className="mt-4 text-lg font-semibold">AI Storyboard Generator</p>
                  <p className="text-muted-foreground">Быстрее в 40-60%</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Caucasus Production Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{home.caucasusTitle}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {home.caucasusDescription}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <LocationCard
            title={home.locationsNature}
            items={home.locationsNatureItems}
            gradient="from-green-500/20 to-emerald-500/20"
          />
          <LocationCard
            title={home.locationsHistorical}
            items={home.locationsHistoricalItems}
            gradient="from-amber-500/20 to-orange-500/20"
          />
          <LocationCard
            title={home.locationsEthno}
            items={home.locationsEthnoItems}
            gradient="from-blue-500/20 to-indigo-500/20"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <AdvantageCard
            icon={<Users className="h-8 w-8" />}
            title={home.castingTitle}
            description={home.castingDescription}
          />
          <AdvantageCard
            icon={<Shield className="h-8 w-8" />}
            title={home.logisticsTitle}
            description={home.logisticsDescription}
          />
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-muted/50 py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">{home.projectsTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {home.projectsDescription}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProjectCard number="01" type={home.project1Type} status={home.project1Status} />
            <ProjectCard number="02" type={home.project2Type} status={home.project2Status} />
            <ProjectCard number="03" type={home.project3Type} status={home.project3Status} />
            <ProjectCard number="04" type={home.project4Type} status={home.project4Status} />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{home.advantagesTitle}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {home.advantagesDescription}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AdvantageSmall icon={<Award className="h-6 w-6" />} title={home.adv1} />
          <AdvantageSmall icon={<Film className="h-6 w-6" />} title={home.adv2} />
          <AdvantageSmall icon={<Mountain className="h-6 w-6" />} title={home.adv3} />
          <AdvantageSmall icon={<Zap className="h-6 w-6" />} title={home.adv4} />
          <AdvantageSmall icon={<Target className="h-6 w-6" />} title={home.adv5} />
          <AdvantageSmall icon={<Share2 className="h-6 w-6" />} title={home.adv6} />
          <AdvantageSmall icon={<Star className="h-6 w-6" />} title={home.adv7} />
          <AdvantageSmall icon={<Shield className="h-6 w-6" />} title={home.adv8} />
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="container mx-auto py-24 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center text-primary-foreground">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
          
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{home.ctaTitle}</h2>
            <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
              {home.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:info@danimak-studio.ru">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2 bg-white text-primary hover:bg-white/90">
                  <Play className="h-4 w-4" />
                  {home.contactEmail}
                </Button>
              </Link>
              <AuthRedirect href="/signup">
                <Button size="lg" className="h-12 px-8 text-base gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Wand2 className="h-4 w-4" />
                  {home.tryStoryboardTool}
                </Button>
              </AuthRedirect>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="h-6 w-6" />
                <span className="font-bold text-lg">DANIMAK</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {home.footerDescription}
              </p>
              <p className="text-sm text-muted-foreground">
                📍 {home.footerLocation}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{home.footerServices}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#services" className="hover:text-foreground">{home.service1Title}</Link></li>
                <li><Link href="#services" className="hover:text-foreground">{home.service2Title}</Link></li>
                <li><Link href="#services" className="hover:text-foreground">{home.service3Title}</Link></li>
                <li><Link href="#" className="hover:text-foreground">AI Storyboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{home.footerCompany}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#about" className="hover:text-foreground">{home.aboutTitle}</Link></li>
                <li><Link href="#projects" className="hover:text-foreground">{home.projectsTitle}</Link></li>
                <li><Link href="#advantages" className="hover:text-foreground">{home.advantagesTitle}</Link></li>
                <li><Link href="#contact" className="hover:text-foreground">{home.contactUs}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{home.footerContact}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📧 info@danimak-studio.ru</li>
                <li>🕒 {home.workHours}</li>
                <li>🌐 Русский, English</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2026 DANIMAK Animation Studio. {home.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AboutStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  features,
  gradient,
  link,
  popular,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  link: string;
  popular?: boolean;
}) {
  return (
    <Link href={link} className={`group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all hover:shadow-lg ${popular ? 'border-primary shadow-xl' : ''}`}>
      {popular && (
        <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          <Star className="h-3 w-3 inline fill-current mr-1" />
          Popular
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

function CycleCard({
  number,
  title,
  icon,
  items,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
          {number}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LocationCard({
  title,
  items,
  gradient,
}: {
  title: string;
  items: string[];
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-6">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ul className="space-y-2">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AdvantageCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function AdvantageSmall({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
}

function ProjectCard({
  number,
  type,
  status,
}: {
  number: string;
  type: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center">
      <div className="text-4xl font-bold text-primary/20 mb-2">{number}</div>
      <h3 className="text-lg font-semibold mb-2">{type}</h3>
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        {status}
      </div>
    </div>
  );
}
