import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    supabaseAccessToken?: string
    user: DefaultSession["user"] & {
      role?: string
    }
  }
} 