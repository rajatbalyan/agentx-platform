import mongoose from 'mongoose';

const WebsiteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  lastAnalysis: { type: Date },
  isAnalysisRunning: { type: Boolean, default: false },
}, { timestamps: true });

export const Website = mongoose.models.Website || mongoose.model('Website', WebsiteSchema);

export interface SentryJob {
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

export interface User {
  id: string;
  email: string;
  websiteUrl?: string;
  lastAnalysis?: Date;
  isAnalysisRunning?: boolean;
  sentryJobs: SentryJob[];
}

export type CreateUserDTO = Omit<User, 'id' | 'sentryJobs'>;
export type UpdateUserDTO = Partial<CreateUserDTO>;
export type CreateSentryJobDTO = Omit<SentryJob, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;
