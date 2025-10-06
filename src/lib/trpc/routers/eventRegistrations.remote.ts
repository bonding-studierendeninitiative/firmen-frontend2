import { query, command } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { array, nullish, number, object, parse, safeParse, string } from 'valibot';
import { apiFetcher } from '@api';
import { createApiClient } from '@api/client';
import { error } from '@sveltejs/kit';

export const changeContactPeople = command(
  object({ eventRegistrationId: string(), contactPeople: array(string()) }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const result = await api.request('post', '/api/v2/event-registration/{eventRegistrationId}/change-contact-people', { path: input, body: { contactPeople: input.contactPeople } });
    if (!result.ok) {
      error(500, 'Something went wrong');
    }
    return await result.json();
  }
);

export const forOrganization = query(
  object({ orgId: string(), cursor: nullish(number(), 0), limit: nullish(number(), 10) }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.get('/api/v2/event-registration', { query: { organizationId: input.orgId, limit: input.limit, page: input.cursor } });
    return response;
  }
);

export const submitPortrait = command(
  object({ eventRegistrationId: string(), data: object() }),
  async ({ eventRegistrationId, data }) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.request('post', '/api/v2/event-registration/{eventRegistrationId}/portrait/submit', { path: { eventRegistrationId }, body: data });
    if (response.status !== 204) {
      error(400, 'The portrait could not be submitted!');
    }
  }
);

export const registerOrganizationToEvent = command(
  object({}),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.request('post', '/api/v2/event-registration', { body: input });
    if (response.status === 409) {
      error(409, 'A registration to this event already exists for your organization!');
    }
    if (response.status !== 201) {
      error(500, 'The registration could not be completed');
    }
    const data = await response.json();
    return data;
  }
);
