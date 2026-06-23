import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {

    if (request.method !== 'DELETE') {
        return response.status(405).json({
            error: 'Método no permitido'
        });
    }

    const id = request.body?.id || request.query?.id;

    if (!id) {
        return response.status(400).json({
            error: 'Falta el identificador del apunte a eliminar.'
        });
    }

    const registroId = Number(id);
    if (Number.isNaN(registroId)) {
        return response.status(400).json({
            error: 'El identificador del apunte debe ser un número válido.'
        });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {

        await sql`
            DELETE FROM apuntes
            WHERE id = ${registroId}
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