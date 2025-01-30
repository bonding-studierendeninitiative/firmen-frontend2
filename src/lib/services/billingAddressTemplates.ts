import { API } from '@api';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import {
	BillingAddressTemplate,
	type CreateBillingAddressTemplateForm,
	GetBillingAddressTemplateForOrganizationResponse
} from '@schema';
import type { InferOutput } from 'valibot';
import { createLogger } from 'vite';

const logger = createLogger();

export const getBillingAddressTemplatesForOrganization = async ({
	accessToken,
	organizationId,
	fetch: fetchF
}: {
	accessToken: string;
	organizationId: string;
	fetch: typeof fetch;
}) => {
	const response = await API.get({
		route: `/organization/${organizationId}/billing-address-template`,
		token: accessToken,
		fetch: fetchF
	});

	logger.info(`In getBillingAddressTemplatesForOrganization, response.status: ${response.status}`);
	logger.info(`url was: ${response.url}`);

	if (response.status !== 200) {
		error(response.status, {
			message: `Could not get billing address templates: ${response.statusText}, ${await response.text()}`
		});
	}

	const data = await response.json();
	return v.parse(GetBillingAddressTemplateForOrganizationResponse, data);
};

export const createBillingAddressTemplate = async ({
	accessToken,
	organizationId,
	data: formData,
	fetch: fetchF
}: {
	accessToken: string;
	organizationId: string;
	data: InferOutput<CreateBillingAddressTemplateForm>;
	fetch: typeof fetch;
}) => {
	const response = await API.post({
		route: `/organization/${organizationId}/billing-address-template`,
		token: accessToken,
		data: formData,
		fetch: fetchF
	});

	if (response.status !== 200) {
		error(500, 'The billing address template could not be created');
	}

	const data = await response.json();
	return v.parse(BillingAddressTemplate, data);
};

export const deleteBillingAddressTemplate = async ({
	accessToken,
	organizationId,
	billingAddressTemplateId,
	fetch: fetchF
}: {
	accessToken: string;
	organizationId: string;
	billingAddressTemplateId: string;
	fetch: typeof fetch;
}) => {
	const response = await API.delete({
		route: `/organization/${organizationId}/billing-address-template/${billingAddressTemplateId}`,
		token: accessToken,
		fetch: fetchF
	});

	if (response.status !== 204) {
		error(500, 'The billing address template could not be deleted');
	}
};

export const makeBillingAddressTemplateDefault = async ({
	accessToken,
	organizationId,
	billingAddressTemplateId,
	fetch: fetchF
}: {
	accessToken: string;
	organizationId: string;
	billingAddressTemplateId: string;
	fetch: typeof fetch;
}) => {
	const response = await API.post({
		route: `/organization/${organizationId}/billing-address-template/${billingAddressTemplateId}/make-default`,
		token: accessToken,
		fetch: fetchF
	});

	if (response.status !== 204) {
		error(500, 'The billing address template could not be set as the default');
	}
};
