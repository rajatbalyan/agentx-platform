'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface UserSettings {
  name: string;
  email: string;
  companyName: string;
  notifications: {
    email: boolean;
    push: boolean;
    maintenanceAlerts: boolean;
    errorAlerts: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export default function AccountSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'John Doe',
    email: 'john@example.com',
    companyName: 'Acme Corp',
    notifications: {
      email: true,
      push: true,
      maintenanceAlerts: true,
      errorAlerts: true,
    },
    theme: 'system',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update logic
    console.log('Settings updated:', settings);
  };

  const handleNotificationToggle = (key: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>

      <div className="bg-card shadow rounded-lg divide-y divide-border">
        {/* Personal Information */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle(key as keyof UserSettings['notifications'])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    value ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Theme Settings</h2>
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-foreground">
              Theme
            </label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                theme: e.target.value as 'light' | 'dark' | 'system',
              }))}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-red-500 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" className="mt-2">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 