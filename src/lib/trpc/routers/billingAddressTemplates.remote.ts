import { query, command } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { object, nullish, parse, string } from 'valibot';
import { error } from '@sveltejs/kit';
import { apiFetcher } from '@api';
import { createApiClient } from '@api/client';

export const getBillingAddressTemplates = query(
  object({ organizationId: string(), page: nullish(string(), '0'), limit: nullish(string(), '10') }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());

    // create tokenized api client using session token
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);

    const response = await api.request('get', '/api/v2/organization/{organizationId}/billing-address-template', {
      path: { organizationId: input.organizationId },
      query: { page: Number(input.page), size: Number(input.limit) }
    });

    if (response.status !== 200) {
      error(500, `Could not get billing address templates: ${response.statusText}`);
    }

    return await response.json();
  }
);

export const createBillingAddressTemplate = command(
  object({ organizationId: string(), data: object() }),
  async ({ organizationId, data }) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);

    const response = await api.request('post', '/api/v2/organization/{organizationId}/billing-address-template', {
      path: { organizationId },
      body: data
    });

    if (response.status !== 200) {
      error(500, 'The billing address template could not be created');
    }

    return await response.json();
  }
);
