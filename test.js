import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_89UEWbBYPsLJ@ep-empty-dew-apj0xx7g-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function probarConexion() {
  try {
    const resultado = await sql`
      SELECT * FROM usuarios
    `;

    console.log(resultado);
  } catch(error) {
    console.error(error);
  }
}

probarConexion();