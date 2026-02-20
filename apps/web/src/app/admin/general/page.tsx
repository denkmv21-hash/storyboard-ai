'use client';

import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAdminStore } from '@/stores/admin-store';
import { Button, Input, Label, Card, Switch } from '@/components/ui';

export default function GeneralSettingsPage() {
  const { t } = useLanguage();
  const { generalSettings, setGeneralSettings } = useAdminStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.admin.generalSettings}</h1>
        <p className="text-muted-foreground">{t.admin.description}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings({ siteName: e.target.value })}
              placeholder="Storyboard AI"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({ siteDescription: e.target.value })}
              placeholder="AI-powered storyboard generation"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={generalSettings.maxFileSize}
                onChange={(e) => setGeneralSettings({ maxFileSize: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScenes">Max Scenes per Project</Label>
              <Input
                id="maxScenes"
                type="number"
                value={generalSettings.maxScenesPerProject}
                onChange={(e) => setGeneralSettings({ maxScenesPerProject: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableRegistration">Enable Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              id="enableRegistration"
              checked={generalSettings.enableRegistration}
              onCheckedChange={(checked) => setGeneralSettings({ enableRegistration: checked })}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button onClick={handleSave} className="gap-2">
            {saved && <Check className="h-4 w-4" />}
            {saved ? t.admin.saved : t.admin.save}
          </Button>
          <p className="text-sm text-muted-foreground">
            Settings are saved automatically
          </p>
        </div>
      </Card>

      {/* Preview Card */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Globe className="h-5 w-5" />
          Site Preview
        </h3>
        <div className="rounded-lg border bg-muted p-4">
          <h4 className="text-lg font-bold">{generalSettings.siteName}</h4>
          <p className="text-sm text-muted-foreground">{generalSettings.siteDescription}</p>
        </div>
      </Card>
    </div>
  );
}
