import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {

    if (request.method !== 'DELETE') {
        return response.status(405).json({
            error: 'Método no permitido'
        });
    }

    const { id } = request.body;

    const sql = neon(process.env.DATABASE_URL);

    try {

        await sql`
            DELETE FROM apuntes
            WHERE id = ${id}
        `;

        return response.status(200).json({
            success: true
        });

    } catch (error) {

        return response.status(500).json({
            error: error.message
        });

    }
}