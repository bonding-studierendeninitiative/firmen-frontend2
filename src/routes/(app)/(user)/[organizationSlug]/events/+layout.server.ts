import { createCaller } from '@/trpc/router'

export const load = async (event) => {
    const {initialState, organization} = await event.parent()

    const api = await createCaller(event)

    const org = await organization;

    return {
        orgSlug: initialState.orgSlug,
        orgId: org.id,
        eventRegistrations: await api.eventRegistrations.forOrganization({
            orgId: org.id,
            cursor: 0,
            limit: 10
        })
    }
}