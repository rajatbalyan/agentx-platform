import { Website } from './models';
import mongoose from 'mongoose';
import { User, CreateUserDTO, UpdateUserDTO, CreateSentryJobDTO, SentryJob } from './models';

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function registerWebsite(userId: string, websiteUrl: string) {
  await connectDB();
  const website = await Website.findOneAndUpdate(
    { userId },
    { websiteUrl },
    { upsert: true, new: true }
  );
  return website;
}

export async function getWebsite(userId: string) {
  await connectDB();
  return await Website.findOne({ userId });
}

export async function updateAnalysisStatus(websiteId: string, isRunning: boolean) {
  await connectDB();
  return await Website.findByIdAndUpdate(
    websiteId,
    { isAnalysisRunning: isRunning, lastAnalysis: isRunning ? null : new Date() },
    { new: true }
  );
}

export class UserController {
  async getUser(id: string): Promise<User | null> {
    // Mock implementation
    return null;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    // Mock implementation
    return {
      id: 'mock-id',
      email: data.email,
      websiteUrl: data.websiteUrl,
      sentryJobs: [],
    };
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
    // Mock implementation
    return null;
  }

  async addSentryJob(userId: string, data: CreateSentryJobDTO): Promise<SentryJob> {
    // Mock implementation
    const job: SentryJob = {
      ...data,
      id: 'mock-job-id',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return job;
  }

  async updateSentryJob(userId: string, jobId: string, data: Partial<CreateSentryJobDTO>): Promise<SentryJob | null> {
    // Mock implementation
    return null;
  }

  async deleteSentryJob(userId: string, jobId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async toggleSentryJob(userId: string, jobId: string): Promise<SentryJob | null> {
    // Mock implementation
    return null;
  }
}
