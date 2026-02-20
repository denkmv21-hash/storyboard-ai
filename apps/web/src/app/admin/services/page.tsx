'use client';

import { Check, Database, Cpu, CreditCard, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAdminStore } from '@/stores/admin-store';
import { Card, Switch, Label, Button } from '@/components/ui';

const services = [
  {
    key: 'supabaseEnabled',
    name: 'Supabase',
    description: 'Database & Authentication',
    icon: Database,
  },
  {
    key: 'replicateEnabled',
    name: 'Replicate',
    description: 'AI Image Generation (SDXL)',
    icon: Cpu,
  },
  {
    key: 'openaiEnabled',
    name: 'OpenAI',
    description: 'AI Text Processing (GPT-4)',
    icon: Zap,
  },
  {
    key: 'stripeEnabled',
    name: 'Stripe',
    description: 'Payment Processing',
    icon: CreditCard,
  },
  {
    key: 'redisEnabled',
    name: 'Redis',
    description: 'Caching & Job Queues',
    icon: Database,
  },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  const { serviceSettings, setServiceSettings, apiKeys } = useAdminStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.admin.services}</h1>
        <p className="text-muted-foreground">Enable or disable external services</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const isEnabled = serviceSettings[service.key as keyof typeof serviceSettings] as boolean;
          const isConfigured = checkServiceConfigured(service.key, apiKeys);

          return (
            <Card key={service.key} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${isEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => setServiceSettings({ [service.key]: checked })}
                  disabled={!isConfigured}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isConfigured ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {isConfigured ? 'API keys configured' : 'API keys required'}
                  </span>
                </div>
                {isEnabled && isConfigured && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="mb-2 font-semibold">Service Status</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Configure API keys in the API Keys section to enable services
        </p>
        <div className="space-y-2">
          {services.map((service) => {
            const isEnabled = serviceSettings[service.key as keyof typeof serviceSettings] as boolean;
            const isConfigured = checkServiceConfigured(service.key, apiKeys);

            return (
              <div key={service.key} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <service.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{service.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isConfigured ? 'Configured' : 'Not configured'}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isEnabled && isConfigured ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function checkServiceConfigured(serviceKey: string, apiKeys: any): boolean {
  switch (serviceKey) {
    case 'supabaseEnabled':
      return !!apiKeys.supabaseUrl && !!apiKeys.supabaseKey;
    case 'replicateEnabled':
      return !!apiKeys.replicateApiKey;
    case 'openaiEnabled':
      return !!apiKeys.openaiApiKey;
    case 'stripeEnabled':
      return !!apiKeys.stripeSecretKey && !!apiKeys.stripePublishableKey;
    case 'redisEnabled':
      return true; // Redis is local
    default:
      return false;
  }
}
