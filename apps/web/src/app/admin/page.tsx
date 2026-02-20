'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, Check, Loader2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAdminStore } from '@/stores/admin-store';
import { Button, Input, Label, Card } from '@/components/ui';

export default function ApiKeysPage() {
  const { t } = useLanguage();
  const { apiKeys, setApiKeys } = useAdminStore();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  const fields = [
    { key: 'supabaseUrl', label: 'Supabase URL', placeholder: 'https://your-project.supabase.co' },
    { key: 'supabaseKey', label: 'Supabase Anon Key', placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    { key: 'replicateApiKey', label: 'Replicate API Key', placeholder: 'r8_...' },
    { key: 'openaiApiKey', label: 'OpenAI API Key', placeholder: 'sk-...' },
    { key: 'stripeSecretKey', label: 'Stripe Secret Key', placeholder: 'sk_test_...' },
    { key: 'stripePublishableKey', label: 'Stripe Publishable Key', placeholder: 'pk_test_...' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async (key: string) => {
    setTesting(key);
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTesting(null);
  };

  const togglePassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t.admin.apiKeys}</h1>
          <Shield className="h-5 w-5 text-primary" />
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Admin Only
          </span>
        </div>
        <p className="text-muted-foreground">Manage API keys for external services</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {fields.map((field) => {
            const value = apiKeys[field.key as keyof typeof apiKeys] as string;
            const isPassword = field.key.toLowerCase().includes('key') || field.key.toLowerCase().includes('secret');
            const isVisible = showPasswords[field.key];

            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {value && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTest(field.key)}
                      disabled={testing === field.key}
                      className="h-7 text-xs"
                    >
                      {testing === field.key ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          {t.admin.testing}
                        </>
                      ) : (
                        <>
                          <Key className="mr-1 h-3 w-3" />
                          {t.admin.test}
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={field.key}
                      type={isVisible ? 'text' : 'password'}
                      value={value}
                      onChange={(e) => setApiKeys({ [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="pr-10"
                    />
                    {isPassword && value && (
                      <button
                        onClick={() => togglePassword(field.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        type="button"
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {value && (
                    <div className="flex items-center text-green-600 dark:text-green-500">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button onClick={handleSave} className="gap-2">
            {saved && <Check className="h-4 w-4" />}
            {saved ? t.admin.saved : t.admin.save}
          </Button>
          <p className="text-sm text-muted-foreground">
            Keys are stored locally in your browser
          </p>
        </div>
      </Card>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          name="Supabase"
          connected={!!apiKeys.supabaseUrl && !!apiKeys.supabaseKey}
        />
        <StatusCard
          name="Replicate"
          connected={!!apiKeys.replicateApiKey}
        />
        <StatusCard
          name="OpenAI"
          connected={!!apiKeys.openaiApiKey}
        />
        <StatusCard
          name="Stripe"
          connected={!!apiKeys.stripeSecretKey && !!apiKeys.stripePublishableKey}
        />
      </div>
    </div>
  );
}

function StatusCard({ name, connected }: { name: string; connected: boolean }) {
  const { t } = useLanguage();
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {connected ? t.admin.connected : t.admin.notConnected}
          </p>
        </div>
        <div
          className={`h-3 w-3 rounded-full ${
            connected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>
    </Card>
  );
}
