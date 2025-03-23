import { NextResponse } from 'next/server';
import { UserController } from '../auth/user/controller';
import { CreateSentryJobDTO } from '../auth/user/models';

const userController = new UserController();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userId = 'mock-user-id'; // TODO: Get from session

    // Extract repo owner and name from URL if provided
    let { repoUrl, repoOwner, repoName, ...rest } = data;
    if (repoUrl) {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        [, repoOwner, repoName] = match;
      } else {
        return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
      }
    }

    const jobData: CreateSentryJobDTO = {
      ...rest,
      repoOwner,
      repoName,
    };

    const job = await userController.addSentryJob(userId, jobData);
    return NextResponse.json(job);
  } catch (error) {
    console.error('Failed to create sentry job:', error);
    return NextResponse.json(
      { error: 'Failed to create sentry job' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const userId = 'mock-user-id'; // TODO: Get from session
    const { jobId, ...updates } = data;

    const job = await userController.updateSentryJob(userId, jobId, updates);
    if (!job) {
      return NextResponse.json(
        { error: 'Sentry job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Failed to update sentry job:', error);
    return NextResponse.json(
      { error: 'Failed to update sentry job' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { jobId } = await request.json();
    const userId = 'mock-user-id'; // TODO: Get from session

    const success = await userController.deleteSentryJob(userId, jobId);
    if (!success) {
      return NextResponse.json(
        { error: 'Sentry job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sentry job:', error);
    return NextResponse.json(
      { error: 'Failed to delete sentry job' },
      { status: 500 }
    );
  }
}
