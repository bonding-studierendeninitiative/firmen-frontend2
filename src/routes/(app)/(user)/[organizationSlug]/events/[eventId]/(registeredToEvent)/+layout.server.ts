
import { createCaller } from '@/trpc/router.js';


export const load = async(event) => {

    const api = await createCaller(event)

    const eventRegistration = await api.events.isOrgRegistered(event.params.eventId)

    return {
        eventRegistration
    }
}