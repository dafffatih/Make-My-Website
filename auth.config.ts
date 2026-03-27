import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // Diisi di auth.ts saja agar kompatibel dengan Edge Runtime
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
