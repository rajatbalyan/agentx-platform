# SiteSentry

SiteSentry is an AI-powered web maintenance platform that helps website owners automate routine maintenance tasks, detect issues, and optimize performance.

## Features

- Automated website monitoring
- AI-powered maintenance tasks
- Real-time alerts and notifications
- Performance optimization
- Content updates
- Security monitoring

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- GitHub account (for OAuth)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sitesentry.git
   cd sitesentry
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Set up GitHub OAuth:
     1. Go to GitHub Settings > Developer settings > OAuth Apps > New OAuth App
     2. Set Homepage URL to `http://localhost:3000`
     3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
     4. Copy the Client ID and Client Secret to your `.env.local` file
   - Generate a random string for NEXTAUTH_SECRET (at least 32 characters)

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

SiteSentry supports the following authentication methods:
- GitHub OAuth
- Email/Password (coming soon)

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- NextAuth.js
- Tailwind CSS
- PostCSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
