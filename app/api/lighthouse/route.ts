import { NextResponse } from 'next/server';

const API_KEY = process.env.PAGESPEED_API_KEY || ''; // Add this to your .env.local

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`
    );

    if (!response.ok) {
      throw new Error('PageSpeed API request failed');
    }

    const data = await response.json();
    
    if (!data.lighthouseResult?.categories) {
      throw new Error('Invalid PageSpeed results');
    }

    // Extract main scores
    const scores = {
      performance: (data.lighthouseResult.categories.performance?.score ?? 0) * 100,
      accessibility: (data.lighthouseResult.categories.accessibility?.score ?? 0) * 100,
      bestPractices: (data.lighthouseResult.categories['best-practices']?.score ?? 0) * 100,
      seo: (data.lighthouseResult.categories.seo?.score ?? 0) * 100,
      
      // Add detailed metrics
      metrics: {
        firstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint']?.numericValue,
        speedIndex: data.lighthouseResult.audits['speed-index']?.numericValue,
        largestContentfulPaint: data.lighthouseResult.audits['largest-contentful-paint']?.numericValue,
        timeToInteractive: data.lighthouseResult.audits['interactive']?.numericValue,
        totalBlockingTime: data.lighthouseResult.audits['total-blocking-time']?.numericValue,
        cumulativeLayoutShift: data.lighthouseResult.audits['cumulative-layout-shift']?.numericValue,
      },

      // Filter and transform relevant audits
      audits: Object.entries(data.lighthouseResult.audits)
        .filter(([_, audit]: [string, any]) => 
          audit.score !== null && 
          audit.score < 1 &&
          audit.details?.type === 'opportunity'
        )
        .reduce((acc, [key, audit]: [string, any]) => ({
          ...acc,
          [key]: {
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue,
          }
        }), {})
    };

    return NextResponse.json(scores);
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
} 