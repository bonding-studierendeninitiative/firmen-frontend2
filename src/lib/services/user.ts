import { clerkClient } from 'svelte-clerk/server';
import type { UpdateUserDetails } from '@schema';
import type { InferOutput } from 'valibot';
import { makeSerializable } from '@/utils';

export const updateUserMetadata = async ({
	userId,
	data
}: {
	userId: string;
	data: InferOutput<UpdateUserDetails>;
}) => {
	await clerkClient.users.updateUserMetadata(userId, {
		publicMetadata: {
			...data
		}
	});
};

export const getUser = async ({ userId }: { userId: string }) => {
	const user = await clerkClient.users.getUser(userId);

	return makeSerializable(user);
};
