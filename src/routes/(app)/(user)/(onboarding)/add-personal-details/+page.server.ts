import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateUserDetailsRequest } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import { updateMetadata } from '@/remote/functions';

export const load = async ({ parent }) => {
	// const { session } = await parent();
	// if (!session?.id) return;
	return {}
};