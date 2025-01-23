import { ContactPersonDetailsSchema, ContactPersonRegistrationRequest } from '@schema';
import * as v from 'valibot';
import { API } from '@api';
import { error, redirect } from '@sveltejs/kit';
import { contactPersonDetailsStore } from '@/stores/contactPersonStore';
import { t } from '@/utils/tuple';
import { goto } from '$app/navigation';

export const getContactPersonDetails = async ({ accessToken }: { accessToken: string }) => {
	const [e, response] = await t(
		API.get({
			route: '/contact-person/my-details',
			token: accessToken
		})
	);

	if (e) {
		error(500, e.stack || 'API error');
	}

	if (response.status === 400) {
		error(400, 'Bad Request');
	}

	if (response.status === 401) {
		redirect(302, '/');
	}

	if (response.status === 404) {
		error(404, 'Contact Person not found');
	}

	if (response.status === 412) {
		return undefined;
	}

	if (response.status === 422) {
		error(404, 'Contact Person not found');
	}

	const data = await response.json();
	const details = v.parse(ContactPersonDetailsSchema, data);

	contactPersonDetailsStore.set(details);
	return details;
};
export const registerContactPerson = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: ContactPersonRegistrationRequest;
}) => {
	const response = await API.post({
		route: '/contact-person',
		token: accessToken,
		data: formData
	});

	if (response.status === 400) {
		error(400, 'Bad Request');
	}

	if (response.status === 401) {
		error(401, 'Unauthorized');
	}

	if (response.status === 404) {
		error(404, 'Contact Person not found');
	}

	if (response.status === 409) {
		error(409, 'This mail is already registered');
	}

	if (response.status === 412) {
		return undefined;
	}

	if (response.status === 422) {
		error(404, 'Contact Person not found');
	}

	const data = await response.json();
	return v.parse(ContactPersonDetailsSchema, data);
};
