'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  agent: string;
  message: string;
}

const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: '2024-03-21T10:00:00Z',
    level: 'info',
    agent: 'Content Update Agent',
    message: 'Successfully updated blog post content',
  },
  {
    id: '2',
    timestamp: '2024-03-21T09:45:00Z',
    level: 'warning',
    agent: 'SEO Agent',
    message: 'Meta description length exceeds recommended limit',
  },
  {
    id: '3',
    timestamp: '2024-03-21T09:30:00Z',
    level: 'error',
    agent: 'Error Fixing Agent',
    message: 'Failed to fix broken link: /about-us',
  },
];

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>(mockLogs);
  const [filters, setFilters] = useState({
    level: 'all',
    agent: 'all',
    search: '',
  });

  const filteredLogs = logs.filter(log => {
    if (filters.level !== 'all' && log.level !== filters.level) return false;
    if (filters.agent !== 'all' && log.agent !== filters.agent) return false;
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level: Log['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Logs</Button>
          <Button>Clear Logs</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-foreground mb-1">
              Log Level
            </label>
            <select
              id="level"
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label htmlFor="agent" className="block text-sm font-medium text-foreground mb-1">
              Agent
            </label>
            <select
              id="agent"
              value={filters.agent}
              onChange={(e) => setFilters(prev => ({ ...prev, agent: e.target.value }))}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Agents</option>
              <option value="Content Update Agent">Content Update Agent</option>
              <option value="SEO Agent">SEO Agent</option>
              <option value="Error Fixing Agent">Error Fixing Agent</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search logs..."
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {log.agent}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 