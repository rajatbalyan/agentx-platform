'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";

interface SentryJob {
  id: string;
  name: string;
  interval: 5 | 10 | 30 | 60;
  githubToken: string;
  repoName: string;
  repoOwner: string;
  githubTrigger: boolean;
  branches?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sentryJobSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  interval: z.enum(['5', '10', '30', '60']).transform(val => parseInt(val) as 5 | 10 | 30 | 60),
  githubToken: z.string().min(1, 'GitHub token is required'),
  repoUrl: z.string().url('Please enter a valid URL').optional(),
  repoOwner: z.string().min(1, 'Repository owner is required').optional(),
  repoName: z.string().min(1, 'Repository name is required').optional(),
  githubTrigger: z.boolean().default(false),
  branches: z.array(z.string()).optional(),
}).refine(
  data => (data.repoUrl || (data.repoOwner && data.repoName)),
  {
    message: "Either repository URL or owner/name pair is required",
    path: ["repoUrl"],
  }
);

export default function ActionPage() {
  const [jobs, setJobs] = useState<SentryJob[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof sentryJobSchema>>({
    resolver: zodResolver(sentryJobSchema),
    defaultValues: {
      interval: 5,
      githubTrigger: false,
      branches: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof sentryJobSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to create sentry job');
      }

      const newJob = await res.json();
      setJobs([...jobs, newJob]);
      form.reset();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create sentry job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleJob = async (jobId: string) => {
    try {
      const res = await fetch('/api/action', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle job');
      }

      const updatedJob = await res.json();
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (error) {
      console.error('Failed to toggle job:', error);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const res = await fetch('/api/action', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete job');
      }

      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">Configure Sentry Actions</h1>
          <Button variant="outline" asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>
                  Manage your configured sentry jobs
                </CardDescription>
              </div>
              <Button 
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "secondary" : "default"}
              >
                {showForm ? 'Cancel' : 'Add New Job'}
              </Button>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No sentry jobs configured yet
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{job.name}</h3>
                        <p className="text-sm text-gray-500">
                          {job.repoOwner}/{job.repoName} • Every {job.interval} minutes
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={job.isActive}
                          onCheckedChange={() => toggleJob(job.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Sentry Job</CardTitle>
                <CardDescription>
                  Configure automated performance analysis for your GitHub repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <FormDescription>
                            Create a classic token at{" "}
                            <a
                              href="https://github.com/settings/tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              GitHub Settings
                            </a>
                          </FormDescription>
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

                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Sentry Job'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
