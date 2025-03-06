import { type InferOutput } from 'valibot';
import { type AdminRegisterOrganizationToEvent } from '@schema';
import { API } from '@api';
import { error } from '@sveltejs/kit';

export const adminCreateRegistration = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<AdminRegisterOrganizationToEvent>;
}) => {
	const response = await API.post({
		route: `/admin/event-registration`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 201) {
		error(500, 'The registration could not be created');
	}
};

export const rejectEventRegistration = async ({
	accessToken,
	eventRegistrationId
}: {
	accessToken: string;
	eventRegistrationId: string;
}) => {
	const response = await API.post({
		route: `/admin/event-registration/${eventRegistrationId}/reject`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The registration could not be rejected');
	}
};

export async function confirmEventRegistration({
	accessToken,
	eventRegistrationId
}: {
	accessToken: string;
	eventRegistrationId: string;
}) {
	const response = await API.post({
		route: `/admin/event-registration/${eventRegistrationId}/confirm`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The registration could not be confirmed');
	}
}
