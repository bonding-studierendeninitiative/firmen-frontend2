// src/routes/api/avatar/[userId].svg/+server.ts
import { PrismaClient } from '@prisma-app/client/client';
export async function GET({ params }) {
	const { userId } = params;

	const db = new PrismaClient();

	// Fetch user from auth db to get initials/name
	const user = await db.user.findFirst({
		where: { id: userId },
		select: { name: true, email: true }
	});
	const initials = user?.name
		?.split(' ')
		.slice(0, 2)
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	// Deterministic hash-based color
	const bgColor = hashToColor(userId);

	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect fill="${bgColor}" width="128" height="128"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" 
            fill="white" font-size="54" font-family="Poppins, sans-serif" font-weight="lighter">
        ${initials}
      </text>
    </svg>
  `;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}

function hashToColor(userId: string) {
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		hash = userId.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return `hsl(${hue}, 70%, 50%)`;
}
