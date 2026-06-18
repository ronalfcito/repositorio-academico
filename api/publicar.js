import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  const {
    semana,
    titulo,
    subtitulo,
    contenido,
    fecha,
    categoria,
    seccion,
    pdf_url
  } = req.body;

  const sql = neon(process.env.DATABASE_URL);

  try {

    // Convertir fecha a formato YYYY-MM-DD
    let fechaSQL = fecha;

    if (fecha) {
      const fechaConvertida = new Date(fecha);

      if (!isNaN(fechaConvertida.getTime())) {
        fechaSQL = fechaConvertida
          .toISOString()
          .split('T')[0];
      }
    }

    await sql`
      INSERT INTO apuntes (
        semana,
        titulo,
        subtitulo,
        contenido,
        fecha,
        categoria,
        seccion,
        pdf_url
      )
      VALUES (
        ${semana},
        ${titulo},
        ${subtitulo},
        ${contenido},
        ${fechaSQL},
        ${categoria},
        ${seccion},
        ${pdf_url || null}
      )
    `;

    return res.status(200).json({
      success: true,
      message: 'Apunte publicado correctamente'
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}