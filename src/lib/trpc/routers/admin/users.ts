import { adminProcedure, router } from "@/trpc/server";
import { clerkClient } from "svelte-clerk/server";
import { nullish, number, object, parse, string } from "valibot";

export const adminUsersRouter = router({
    getAll: adminProcedure
    .input((input) => parse(object({
        page: nullish(number(), 0),
        query: nullish(string(), ""),
        limit: nullish(number(), 10),
    }), input))
    .query(async ({input: {query, page, limit}}) => {
        return await clerkClient.users.getUserList({
            query,
            offset: page * limit,
            limit
        })
    })
})