const  { env } = process;

export const HOST = env.HOST;
export const PORT = Number(env.PORT) || 8081;
// export const DB_STRING=env.DB_STRING || '@localhost:5432/postgres'

export const PG_USER=process.env.PG_USER || 'postgres'
export const PG_PASSWORD='password'
export const PG_HOST=process.env.DB_HOST || 'localhost'
export const PG_PORT=Number(env.PG_PORT) || Number(5432)
export const PG_DATABASE=process.env.PG_DATABASE || 'dynaFood'
export const NODE_ENV=env.NODE_ENV
export const DATABASE_URL='hahaha'
