import { command, form, query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import type {
	GetDraftsOutput,
	PreviewBulkEmailOutput,
	SimpleEmailDraftDTO
} from '@api/admin-client';
import { error } from '@sveltejs/kit';
import {
	pipe,
	string,
	nonEmpty,
	transform,
	object,
	optional,
	array,
	number,
	minValue,
	maxLength
} from 'valibot';

export const getEmailDrafts = query(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		page: pipe(number(), minValue(0)),
		size: pipe(number(), minValue(1))
	}),
	async ({ eventId, page, size }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'get',
			'/api/v2/admin/event/{eventId}/email/draft',
			{
				path: { eventId: eventId as string },
				query: { page, size }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to retrieve email drafts');
		}

		return (await response.json()) as GetDraftsOutput;
	}
);

export const getEmailDraft = query(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		draftId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		)
	}),
	async ({ draftId, eventId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'get',
			'/api/v2/admin/event/{eventId}/email/draft/{draftId}',
			{
				path: { draftId: draftId as string, eventId: eventId as string }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to retrieve email draft');
		}

		return await response.json();
	}
);

export const deleteEmailDraft = command(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		draftId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		)
	}),
	async ({ draftId, eventId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/event/{eventId}/email/draft/{draftId}',
			{
				path: { draftId: draftId as string, eventId: eventId as string }
			}
		);

		if (response.status !== 204) {
			error(500, 'Failed to delete email draft');
		}
	}
);

export const createEmailDraft = form(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Event ID cannot be empty')
		),
		subject: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Der Betreff kann nicht leer sein'),
			maxLength(200, 'Der Betreff darf maximal 200 Zeichen lang sein')
		),
		replyTo: optional(string())
	}),
	async ({ eventId, subject, replyTo }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event/{eventId}/email/draft',
			{
				path: { eventId: eventId as string },
				body: { subject, replyToEmail: replyTo }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to create email draft');
		}

		return (await response.json()) as SimpleEmailDraftDTO;
	}
);

export const updateEmailDraft = form(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Event ID cannot be empty')
		),
		draftId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Draft ID cannot be empty')
		),
		subject: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Der Betreff kann nicht leer sein'),
			maxLength(200, 'Der Betreff darf maximal 200 Zeichen lang sein')
		),
		bodyMarkdown: string(),
		replyTo: optional(string())
	}),
	async ({ eventId, draftId, subject, bodyMarkdown, replyTo }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'put',
			'/api/v2/admin/event/{eventId}/email/draft/{draftId}',
			{
				path: { eventId: eventId as string, draftId: draftId as string },
				body: { subject, bodyMarkdown, replyToEmail: replyTo }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to update email draft');
		}

		return (await response.json()) as SimpleEmailDraftDTO;
	}
);

export const sendBulkEmail = form(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Event ID cannot be empty')
		),
		draftId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Draft ID cannot be empty')
		),
		recipients: object({
			registrationIds: optional(array(string())),
			organizationIds: optional(array(string())),
			userIds: optional(array(string()))
		})
	}),
	async ({ eventId, draftId, recipients }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event/{eventId}/email/draft/{draftId}/send',
			{
				path: { eventId: eventId as string, draftId: draftId as string },
				body: { recipients }
			}
		);

		if (response.status !== 202) {
			error(500, 'Failed to send bulk email');
		}

		return await response.json();
	}
);

export const previewBulkEmail = query(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Event ID cannot be empty')
		),
		draftId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty('Draft ID cannot be empty')
		),
		recipients: object({
			registrationIds: optional(array(string())),
			organizationIds: optional(array(string())),
			userIds: optional(array(string()))
		})
	}),
	async ({ eventId, draftId, recipients }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event/{eventId}/email/draft/{draftId}/preview',
			{
				path: { eventId: eventId as string, draftId: draftId as string },
				body: { recipients }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to preview bulk email');
		}

		return (await response.json()) as PreviewBulkEmailOutput;
	}
);

export const sendTestEmail = form(
	object({
		eventId: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		subject: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		bodyMarkdown: pipe(string(), nonEmpty()),
		replyTo: optional(
			pipe(
				string(),
				transform((str) => str?.trim() ?? ''),
				nonEmpty()
			)
		),
		testEmailAddress: pipe(
			string(),
			transform((str) => str.trim()),
			nonEmpty()
		),
		recipientSelection: optional(
			object({
				registrationIds: optional(array(string())),
				organizationIds: optional(array(string())),
				userIds: optional(array(string()))
			}),
			{}
		)
	}),
	async ({ eventId, subject, bodyMarkdown, replyTo, testEmailAddress, recipientSelection }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event/{eventId}/email/test',
			{
				path: { eventId: eventId as string },
				body: { subject, bodyMarkdown, replyToEmail: replyTo, testEmailAddress, recipientSelection }
			}
		);

		if (response.status !== 200) {
			error(500, 'Failed to send test email');
		}

		return await response.json();
	}
);
