import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password111",
    database: "tododb"
});

export default pool;
