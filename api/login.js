import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {

  const sql = neon(process.env.DATABASE_URL);

  const { username, password } = req.body;

  try {

    const usuario = await sql`
      SELECT *
      FROM usuarios
      WHERE username = ${username}
      AND password = ${password}
    `;

    if (usuario.length > 0) {
      return res.status(200).json({
        success: true
      });
    }

    return res.status(401).json({
      success: false
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
}