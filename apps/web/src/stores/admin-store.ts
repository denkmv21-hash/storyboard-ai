'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApiKeys {
  supabaseUrl: string;
  supabaseKey: string;
  replicateApiKey: string;
  openaiApiKey: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  maxFileSize: number;
  maxScenesPerProject: number;
  enableRegistration: boolean;
}

export interface ServiceSettings {
  supabaseEnabled: boolean;
  replicateEnabled: boolean;
  openaiEnabled: boolean;
  stripeEnabled: boolean;
  redisEnabled: boolean;
}

interface AdminState {
  apiKeys: ApiKeys;
  generalSettings: GeneralSettings;
  serviceSettings: ServiceSettings;
  
  // Actions
  setApiKeys: (keys: Partial<ApiKeys>) => void;
  setGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  setServiceSettings: (settings: Partial<ServiceSettings>) => void;
  resetToDefaults: () => void;
}

const defaultApiKeys: ApiKeys = {
  supabaseUrl: '',
  supabaseKey: '',
  replicateApiKey: '',
  openaiApiKey: '',
  stripeSecretKey: '',
  stripePublishableKey: '',
};

const defaultGeneralSettings: GeneralSettings = {
  siteName: 'Storyboard AI',
  siteDescription: 'AI-powered storyboard generation',
  maxFileSize: 10,
  maxScenesPerProject: 100,
  enableRegistration: true,
};

const defaultServiceSettings: ServiceSettings = {
  supabaseEnabled: false,
  replicateEnabled: false,
  openaiEnabled: false,
  stripeEnabled: false,
  redisEnabled: false,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      apiKeys: defaultApiKeys,
      generalSettings: defaultGeneralSettings,
      serviceSettings: defaultServiceSettings,
      
      setApiKeys: (keys) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, ...keys },
        })),
      
      setGeneralSettings: (settings) =>
        set((state) => ({
          generalSettings: { ...state.generalSettings, ...settings },
        })),
      
      setServiceSettings: (settings) =>
        set((state) => ({
          serviceSettings: { ...state.serviceSettings, ...settings },
        })),
      
      resetToDefaults: () =>
        set({
          apiKeys: defaultApiKeys,
          generalSettings: defaultGeneralSettings,
          serviceSettings: defaultServiceSettings,
        }),
    }),
    {
      name: 'admin-settings',
    }
  )
);
