import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {

  const sql = neon(process.env.DATABASE_URL);

  const {
    semana,
    titulo,
    subtitulo,
    contenido,
    categoria,
    seccion
  } = req.body;

  try {

    await sql`
      INSERT INTO apuntes(
        semana,
        titulo,
        subtitulo,
        contenido,
        fecha,
        categoria,
        seccion
      )
      VALUES(
        ${semana},
        ${titulo},
        ${subtitulo},
        ${contenido},
        CURRENT_DATE,
        ${categoria},
        ${seccion}
      )
    `;

    res.status(200).json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}