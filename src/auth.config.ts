import type { NextAuthConfig } from 'next-auth';

import Nodemailer from 'next-auth/providers/nodemailer';
import { env } from './lib/env';

export default {
  providers: [
    Nodemailer({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
  ],
} satisfies NextAuthConfig;
