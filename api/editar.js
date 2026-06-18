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

    let fechaSQL = fecha;

    if (fecha) {

      const meses = {
        enero: '01',
        febrero: '02',
        marzo: '03',
        abril: '04',
        mayo: '05',
        junio: '06',
        julio: '07',
        agosto: '08',
        septiembre: '09',
        octubre: '10',
        noviembre: '11',
        diciembre: '12'
      };

      const match = fecha
        .toLowerCase()
        .match(/(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/);

      if (match) {

        const dia = match[1].padStart(2, '0');
        const mes = meses[match[2]];
        const anio = match[3];

        fechaSQL = `${anio}-${mes}-${dia}`;
      }
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      UPDATE apuntes
      SET
        semana = ${semana},
        titulo = ${titulo},
        subtitulo = ${subtitulo},
        contenido = ${contenido},
        fecha = ${fechaSQL},
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