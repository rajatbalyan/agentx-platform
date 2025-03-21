'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface Configuration {
  llmApiKey: string;
  githubToken: string;
  productionSite: string;
  enabledAgents: {
    contentUpdate: boolean;
    seoOptimization: boolean;
    errorFixing: boolean;
    contentGeneration: boolean;
    performanceMonitoring: boolean;
  };
  maintenanceSchedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

export default function Configuration() {
  const [config, setConfig] = useState<Configuration>({
    llmApiKey: '',
    githubToken: '',
    productionSite: '',
    enabledAgents: {
      contentUpdate: true,
      seoOptimization: true,
      errorFixing: true,
      contentGeneration: false,
      performanceMonitoring: true,
    },
    maintenanceSchedule: {
      frequency: 'daily',
      time: '00:00',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement configuration update logic
    console.log('Configuration updated:', config);
  };

  const handleAgentToggle = (agent: keyof Configuration['enabledAgents']) => {
    setConfig(prev => ({
      ...prev,
      enabledAgents: {
        ...prev.enabledAgents,
        [agent]: !prev.enabledAgents[agent],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuration</h1>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>

      <div className="bg-card shadow rounded-lg divide-y divide-border">
        {/* API Keys Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">API Keys</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="llmApiKey" className="block text-sm font-medium text-foreground">
                LLM API Key
              </label>
              <input
                type="password"
                id="llmApiKey"
                value={config.llmApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, llmApiKey: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="githubToken" className="block text-sm font-medium text-foreground">
                GitHub Token
              </label>
              <input
                type="password"
                id="githubToken"
                value={config.githubToken}
                onChange={(e) => setConfig(prev => ({ ...prev, githubToken: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Site Configuration */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Site Configuration</h2>
          <div>
            <label htmlFor="productionSite" className="block text-sm font-medium text-foreground">
              Production Site URL
            </label>
            <input
              type="url"
              id="productionSite"
              value={config.productionSite}
              onChange={(e) => setConfig(prev => ({ ...prev, productionSite: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Enabled Agents */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Enabled Agents</h2>
          <div className="space-y-4">
            {Object.entries(config.enabledAgents).map(([agent, enabled]) => (
              <div key={agent} className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {agent.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <button
                  type="button"
                  onClick={() => handleAgentToggle(agent as keyof Configuration['enabledAgents'])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Maintenance Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-foreground">
                Frequency
              </label>
              <select
                id="frequency"
                value={config.maintenanceSchedule.frequency}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  maintenanceSchedule: {
                    ...prev.maintenanceSchedule,
                    frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                  },
                }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-foreground">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={config.maintenanceSchedule.time}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  maintenanceSchedule: {
                    ...prev.maintenanceSchedule,
                    time: e.target.value,
                  },
                }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 