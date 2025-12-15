import mysql from 'mysql2/promise';

export async function connectBD() 
{
    try{
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'futbolreact'
        });
        console.log('conexion establecida');
        return connection;
    }
    catch(err)
    {
        console.log('error de conexion: ', err);
    }
}