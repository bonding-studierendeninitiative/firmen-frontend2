import { query, command } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { object, parse, string, number, partial } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { apiFetcher } from '@api';
import { createApiClient } from '@api/client';
import { UpdatePortraitTemplateRequestSchema } from '@schema';
import { error } from '@sveltejs/kit';

export const getAll = query(object({ page: number(), query: string() }), async (input) => {
  try {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.get('/api/v2/portrait-template', { query: { organizationId: ctx.session.orgId, title: input.query, page: input.page, limit: 9 } });
    return response;
  } catch (error) {
    console.error(error);
    return { portraitTemplates: [], totalElements: 0, totalPages: 0, pageNumber: 0 };
  }
});

export const get = query(string(), async (portraitTemplateId) => {
  const ctx = await createContext(getRequestEvent());
  const api = createApiClient(apiFetcher({ session: ctx.session }), process.env.PUBLIC_BACKEND_HOST);
  const response = await api.get('/api/v2/portrait-template/{portraitTemplateId}', { path: { portraitTemplateId } });
  return response;
});

export const editForm = query(string(), async (portraitTemplateId) => {
  const ctx = await createContext(getRequestEvent());
  const api = createApiClient(apiFetcher({ session: ctx.session }), process.env.PUBLIC_BACKEND_HOST);
  const response = await api.get('/api/v2/portrait-template/{portraitTemplateId}', { path: { portraitTemplateId } });
  return await superValidate(response, valibot(UpdatePortraitTemplateRequestSchema));
});

export const create = command(object({}), async (input) => {
  const ctx = await createContext(getRequestEvent());
  const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
  const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
  const response = await api.post('/api/v2/portrait-template', { query: { organizationId: ctx.session.orgId }, body: input });
  return response;
});

export const deleteTemplate = command(string(), async (id) => {
  const ctx = await createContext(getRequestEvent());
  const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
  const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
  const response = await api.request('delete', '/api/v2/portrait-template/{portraitTemplateId}', { path: { portraitTemplateId: id } });
  if (response.status !== 204) {
    error(404, 'Portrait template not found');
  }
});

export const update = command(object({ id: string(), data: partial(object()) }), async ({ id, data }) => {
  const ctx = await createContext(getRequestEvent());
  const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
  const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
  const response = await api.put('/api/v2/portrait-template/{portraitTemplateId}', { path: { portraitTemplateId: id }, body: data });
  return response;
});
