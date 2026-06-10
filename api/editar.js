import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {

    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });
    }

    try {

        let body = req.body;

        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const {
            id,
            semana,
            titulo,
            subtitulo,
            contenido,
            fecha,
            categoria,
            seccion,
            pdf_url
        } = body;

        const sql = neon(process.env.DATABASE_URL);

        await sql`
            UPDATE apuntes
            SET
                semana = ${semana},
                titulo = ${titulo},
                subtitulo = ${subtitulo},
                contenido = ${contenido},
                fecha = ${fecha},
                categoria = ${categoria},
                seccion = ${seccion},
                pdf_url = ${pdf_url || null}
            WHERE id = ${id}
        `;

        return res.status(200).json({
            success: true,
            message: 'Apunte actualizado correctamente'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}