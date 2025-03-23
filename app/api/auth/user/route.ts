import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { registerWebsite, getWebsite } from './controller';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { websiteUrl } = await req.json();
  try {
    // @ts-ignore
    const website = await registerWebsite(session.user.id, websiteUrl);
    return NextResponse.json(website);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register website' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // @ts-ignore
    const website = await getWebsite(session.user.id);
    return NextResponse.json(website);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch website' }, { status: 500 });
  }
}
