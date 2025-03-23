'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui/skeleton";
import { RadialProgress } from "@/app/components/ui/radial-progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";

interface WebsiteData {
  websiteUrl: string;
  lastAnalysis: Date;
  isAnalysisRunning: boolean;
}

interface LighthouseData {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  metrics?: {
    firstContentfulPaint?: number;
    speedIndex?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
  };
  audits?: {
    [key: string]: {
      score: number;
      title: string;
      description: string;
    };
  };
}

interface SentryJobFormData {
  name: string;
  interval: 5 | 10 | 30 | 60;
  githubToken: string;
  repoUrl?: string;
  repoOwner?: string;
  repoName?: string;
  githubTrigger: boolean;
  branches?: string[];
}

const formSchema = z.object({
  websiteUrl: z.string().url('Please enter a valid URL'),
});

const sentryJobSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  interval: z.enum(['5', '10', '30', '60']).transform(val => parseInt(val) as 5 | 10 | 30 | 60),
  githubToken: z.string().min(1, 'GitHub token is required'),
  repoUrl: z.string().url('Please enter a valid URL').optional(),
  repoOwner: z.string().min(1, 'Repository owner is required').optional(),
  repoName: z.string().min(1, 'Repository name is required').optional(),
  githubTrigger: z.boolean().default(false),
  branches: z.array(z.string()).optional(),
});

const MetricCard = ({ title, value, description, isLoading }: { 
  title: string; 
  value: number | undefined; 
  description?: string;
  isLoading: boolean;
}) => (
  <div className="flex flex-col items-center text-center p-4">
    {isLoading ? (
      <div className="space-y-3">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    ) : (
      <>
        <RadialProgress 
          value={value ?? 0} 
          size="md"
          className="mb-3"
        />
        <h3 className="text-sm font-medium text-gray-600">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </>
    )}
  </div>
);

const CoreVitalMetric = ({ title, value, unit, target, isLoading }: {
  title: string;
  value: number | undefined;
  unit: string;
  target: string;
  isLoading: boolean;
}) => (
  <div className="flex items-start space-x-4 p-4 border rounded-lg">
    {isLoading ? (
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    ) : (
      <>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {value ? `${value.toFixed(1)}${unit}` : 'N/A'}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Target: {target}
        </div>
      </>
    )}
  </div>
);

const SentryJobForm = () => {
  const form = useForm<z.infer<typeof sentryJobSchema>>({
    resolver: zodResolver(sentryJobSchema),
    defaultValues: {
      interval: 5,
      githubTrigger: false,
      branches: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof sentryJobSchema>) => {
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to create sentry job');
      }

      // Reset form and close dialog
      form.reset();
    } catch (error) {
      console.error('Failed to create sentry job:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder="My Sentry Job" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Analysis Interval</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Personal Access Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="ghp_..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/owner/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-gray-500">
            Or enter repository details manually:
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repoOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="owner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Name</FormLabel>
                  <FormControl>
                    <Input placeholder="repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="githubTrigger"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">GitHub Trigger</FormLabel>
                <FormDescription>
                  Enable analysis on GitHub events
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('githubTrigger') && (
          <FormField
            control={form.control}
            name="branches"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger Branches</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value || [], value])}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branches" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="main">main</SelectItem>
                      <SelectItem value="develop">develop</SelectItem>
                      <SelectItem value="staging">staging</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((branch) => (
                    <div
                      key={branch}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{branch}</span>
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value?.filter(b => b !== branch))}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Create Sentry Job
        </Button>
      </form>
    </Form>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [lighthouseData, setLighthouseData] = useState<LighthouseData | null>(null);
  const [nextAnalysis, setNextAnalysis] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteUrl: '',
    },
  });

  // Load website data and handle initial analysis
  useEffect(() => {
    const loadWebsite = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const data = await res.json();
        setWebsite(data);
        
        if (data?.websiteUrl) {
          // Load cached data
          const cached = localStorage.getItem(`lighthouse-${data.websiteUrl}`);
          const lastAnalysis = localStorage.getItem(`lastAnalysis-${data.websiteUrl}`);
          const nextScheduledAnalysis = localStorage.getItem(`nextAnalysis-${data.websiteUrl}`);
          
          if (cached) {
            setLighthouseData(JSON.parse(cached));
          }

          // Check if analysis is needed
          const now = Date.now();
          const lastAnalysisTime = lastAnalysis ? parseInt(lastAnalysis) : 0;
          const nextAnalysisTime = nextScheduledAnalysis ? parseInt(nextScheduledAnalysis) : 0;
          
          if (!lastAnalysisTime || now >= nextAnalysisTime) {
            // Run analysis if never run or time has passed
            runAnalysis();
          } else {
            // Set the remaining time
            setNextAnalysis(Math.max(0, Math.floor((nextAnalysisTime - now) / 1000)));
          }
        }
      }
    };
    loadWebsite();
  }, [session]);

  // Timer countdown
  useEffect(() => {
    if (!website?.websiteUrl || isAnalyzing) return;

    // Update timer every second
    const timer = setInterval(() => {
      const now = Date.now();
      const nextAnalysisTime = parseInt(localStorage.getItem(`nextAnalysis-${website.websiteUrl}`) || '0');
      
      if (now >= nextAnalysisTime) {
        runAnalysis();
      } else {
        setNextAnalysis(Math.max(0, Math.floor((nextAnalysisTime - now) / 1000)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [website, isAnalyzing]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch('/api/auth/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteUrl: values.websiteUrl }),
    });

    if (res.ok) {
      const data = await res.json();
      setWebsite(data);
      runAnalysis();
    }
  };

  const runAnalysis = async () => {
    if (!website?.websiteUrl || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: website.websiteUrl }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const analysis = await res.json();
      setLighthouseData(analysis);
      
      // Update localStorage with analysis results and timing
      const now = Date.now();
      const nextAnalysisTime = now + (120 * 1000); // 120 seconds from now
      
      localStorage.setItem(`lighthouse-${website.websiteUrl}`, JSON.stringify(analysis));
      localStorage.setItem(`lastAnalysis-${website.websiteUrl}`, now.toString());
      localStorage.setItem(`nextAnalysis-${website.websiteUrl}`, nextAnalysisTime.toString());
      
      setNextAnalysis(120);
    } catch (error) {
      console.error('Failed to run analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">Website Analysis Dashboard</h1>
          {website && (
            <Button variant="outline" asChild>
              <a href="/action">Configure Actions</a>
            </Button>
          )}
        </div>

        {!website ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Register Website</CardTitle>
              <CardDescription>
                Enter your website URL to start monitoring its performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Register Website
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg text-gray-900">
                        <a href={website.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:cursor-pointer">
                          {website.websiteUrl}
                        </a>
                      </h2>
                      <p className="text-sm text-gray-500">
                        Last analyzed: {lighthouseData ? new Date().toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {!isAnalyzing && (
                        <p className="text-sm text-gray-600">
                          Next analysis in: {Math.floor(nextAnalysis / 60)}:
                          {(nextAnalysis % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                      <Button
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        variant="outline"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg shadow">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b">
                <MetricCard
                  title="Performance"
                  value={lighthouseData?.performance}
                  isLoading={isAnalyzing}
                />
                <MetricCard
                  title="Accessibility"
                  value={lighthouseData?.accessibility}
                  isLoading={isAnalyzing}
                />
                <MetricCard
                  title="Best Practices"
                  value={lighthouseData?.bestPractices}
                  isLoading={isAnalyzing}
                />
                <MetricCard
                  title="SEO"
                  value={lighthouseData?.seo}
                  isLoading={isAnalyzing}
                />
              </div>

              {lighthouseData?.metrics && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CoreVitalMetric
                      title="First Contentful Paint"
                      value={lighthouseData.metrics.firstContentfulPaint ? lighthouseData.metrics.firstContentfulPaint / 1000 : undefined}
                      unit="s"
                      target="< 1.8s"
                      isLoading={isAnalyzing}
                    />
                    <CoreVitalMetric
                      title="Total Blocking Time"
                      value={lighthouseData.metrics.totalBlockingTime}
                      unit="ms"
                      target="< 200ms"
                      isLoading={isAnalyzing}
                    />
                    <CoreVitalMetric
                      title="Cumulative Layout Shift"
                      value={lighthouseData.metrics.cumulativeLayoutShift}
                      unit=""
                      target="< 0.1"
                      isLoading={isAnalyzing}
                    />
                  </div>
                </div>
              )}

              {lighthouseData?.audits && Object.keys(lighthouseData.audits).length > 0 && (
                <div className="p-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Opportunities</h3>
                  <div className="space-y-4">
                    {Object.entries(lighthouseData.audits)
                      .filter(([_, audit]) => audit.score < 1)
                      .map(([key, audit]) => (
                        <div key={key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{audit.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{audit.description}</p>
                          </div>
                          <div className="flex items-center">
                            <RadialProgress value={audit.score * 100} size="sm" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 