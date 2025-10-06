import { query, command } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { file, literal, nonEmpty, nullish, object, parse, pipe, string, union } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { apiFetcher } from '@api';
import { createApiClient } from '@api/client';
import { error } from '@sveltejs/kit';

export const uploadCatalogueData = command(
  object({ title: string(), file: file(), orgId: string(), documentType: union([literal('logo'), literal('advert')]) }),
  async (input) => {
    try {
      const buf = Buffer.from(input.file.name, 'utf-8');
      const base64Enc = buf.toString('base64');
      const ctx = await createContext(getRequestEvent());
      const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
      const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);

      const response = await api.request('post', '/api/v2/organization/{organizationId}/catalogue-data/request-upload-url', {
        path: { organizationId: input.orgId },
        body: {
          title: input.title,
          mimeType: input.file.type,
          originalFilename: base64Enc,
          type: input.documentType
        }
      });

      if (!response.ok) {
        error(500, 'The upload could not be completed');
      }

      const { url } = await response.json();
      const uploadResponse = await fetch(url, { method: 'PUT', body: input.file, headers: { 'x-amz-meta-original-filename': base64Enc } });

      if (!uploadResponse.ok) {
        const txt = await uploadResponse.text();
        console.error(txt);
        error(500, 'The upload could not be completed');
      }
    } catch (e) {
      error(500, e instanceof Error ? e.message : 'Failed to upload');
    }
  }
);

export const getCatalogueByType = query(
  object({ documentType: union([literal('logo'), literal('advert')]), limit: nullish(string(), '10'), cursor: nullish(string(), '0') }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.get('/api/v2/organization/{organizationId}/catalogue-data/by-document-type/{documentType}', {
      path: { organizationId: ctx.session.activeOrganizationId, documentType: input.documentType },
      query: { limit: Number(input.limit), page: Number(input.cursor) }
    });
    return response;
  }
);

export const pickDocument = command(
  object({ eventRegistrationId: string(), documentId: string(), versionId: string() }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.request('post', '/api/v2/event-registration/{eventRegistrationId}/pick-document/{documentId}/{versionId}', { path: input });
    if (response.status !== 204) {
      error(500, 'The document could not be picked');
    }
  }
);

export const generateDownloadLink = query(
  object({ organizationId: string(), documentId: string() }),
  async (input) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.request('get', '/api/v2/organization/{organizationId}/catalogue-data/{documentId}/download', { path: input });
    if (response.status !== 204) {
      error(500, 'Download link could not be generated');
    }
    return response.headers.get('location');
  }
);

export const deleteDocument = command(
  object({ documentId: string() }),
  async ({ documentId }) => {
    const ctx = await createContext(getRequestEvent());
    const token = await ctx.auth.getToken({ headers: { Authorization: `Bearer ${ctx.session.token}` } });
    const api = createApiClient(apiFetcher({ session: ctx.session, token: { jwt: token.token } }), process.env.PUBLIC_BACKEND_HOST);
    const response = await api.request('delete', '/api/v2/organization/{organizationId}/catalogue-data/{documentId}', {
      path: { documentId, organizationId: ctx.session.activeOrganizationId },
      query: { 'ignore-conflict': false }
    });
    if (response.status !== 204) {
      const problem = await response.json();
      error(409, problem.detail || 'Conflict');
    }
  }
);
