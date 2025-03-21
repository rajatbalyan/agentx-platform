import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// This is required for API routes
export const dynamic = 'force-dynamic'; 