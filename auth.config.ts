import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // Filled in auth.ts only for Edge Runtime compatibility
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).name = user.name;
        (token as any).email = user.email;
        (token as any).role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = (token as any).id;
        session.user.name = (token as any).name;
        session.user.email = (token as any).email;
        session.user.role = (token as any).role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
