import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {

  const sql = neon(process.env.DATABASE_URL);

  const { id } = req.body;

  try {

    await sql`
      DELETE FROM apuntes
      WHERE id = ${id}
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