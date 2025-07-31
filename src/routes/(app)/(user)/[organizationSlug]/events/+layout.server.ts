import { createCaller } from '@/trpc/router'

export const load = async (event) => {
    const {initialState, organization} = await event.parent()

    const api = await createCaller(event)

    return {
        orgSlug: initialState.orgSlug,
        orgId: organization.id,
        eventRegistrations: await api.eventRegistrations.forOrganization({
            orgId: organization.id,
            cursor: 0,
            limit: 10
        })
    }
}