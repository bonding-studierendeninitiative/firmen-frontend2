import { createCaller } from '@/trpc/router'

export const load = async (event) => {
    const {initialState} = await event.parent()

    const api = await createCaller(event)

    return {
        orgSlug: initialState.orgSlug,
        eventRegistrations: await api.eventRegistrations.forOrganization({
            cursor: 0,
            limit: 10
        })
    }
}