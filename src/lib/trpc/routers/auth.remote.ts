import { command } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { object, parse, string } from 'valibot';
import { error } from '@sveltejs/kit';

export const signIn = command(
  object({ email: string() }),
  async (input) => {
    const { email } = input;
    if (!email) {
      error(400, 'Email is required');
    }

  const ctx = await createContext(getRequestEvent());

    if (email.endsWith('@bonding.de')) {
      console.log(ctx.session);

      const response = await ctx.auth.signInSSO({
        body: {
          email,
          providerId: 'entra',
          providerType: 'oidc',
          callbackURL: `${process.env.PUBLIC_APP_URL}/dashboard`
        }
      });

      console.log(response);
      return response;
    } else {
      await ctx.auth.signInMagicLink({
        body: {
          email,
          callbackURL: `${process.env.PUBLIC_APP_URL}`
        },
        headers: {
          Authorization: `Bearer ${process.env.BETTER_AUTH_SECRET}`
        }
      });
      return { ok: true };
    }
  }
);
