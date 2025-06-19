import path from "node:path";

export function GET() {
    return Response.json({
        workspace: {
            root: path.resolve(),
            uuid: '7035f548-0320-4ed9-a14a-403423cdaf02',
        }
    })
}