import NextAuth from "next-auth";
import { authConfig } from "@/app/lib/auth.config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

// This is required for API routes
export const dynamic = 'force-dynamic'; 