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
    console.log("FECHA original:", fecha);

    // Convertir fecha a formato YYYY-MM-DD
    let fechaSQL = fecha;

    const spanishMonths = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };

    function parseSpanishDate(input) {
      const regex = /^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})$/i;
      const match = String(input).trim().match(regex);
      if (!match) return null;
      const day = match[1].padStart(2, '0');
      const month = spanishMonths[match[2].toLowerCase()];
      const year = match[3];
      return month ? `${year}-${month}-${day}` : null;
    }

    if (fecha) {
      const fechaConvertida = new Date(fecha);

      if (!isNaN(fechaConvertida.getTime())) {
        fechaSQL = fechaConvertida.toISOString().split('T')[0];
      } else {
        const fechaParseada = parseSpanishDate(fecha);
        if (fechaParseada) fechaSQL = fechaParseada;
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