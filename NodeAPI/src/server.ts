import Express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import mysql from 'mysql2'

dotenv.config({path:`${process.cwd()}/.env`})
dotenv.config({path:`${process.cwd()}/../db.env`})

const app = Express(); // Express application

// TABLE CREATION /////////////////////////////////////////////////

const connection = mysql.createConnection({
    'host': process.env.DB_HOST,
    'user': 'root',
    'database': process.env.MYSQL_DATABASE,
    'password': process.env.MYSQL_ROOT_PASSWORD
})

const create_table_sql = fs.readFileSync(`${process.cwd()}/table_creation.sql`).toString()

const res = connection.query(create_table_sql);

// MIDDLEWARE /////////////////////////////////////////////////////

const router = app.router // Application Router (Middleware)
//const Router2 = Express.Router() // Generic Router. We can associate it with an app by using app.use(Router2)

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))

// ROUTES ////////////////////////////////////////////////////////

// Main Route
router.get('/', async (req, res) => {
    console.log(`GET Received`)
    return res.status(200).send('<h1>Hello, World</h1>');
})

// Add User Route
router.post('/user', async (req, res) => 
{
    // User input
    const {username, email, age} = req.body;
    console.log(`POST Received | values '${username}', '${email}' and '${Number(age)}'`);

    try
    {
        connection.execute('INSERT INTO users VALUES (?, ?, ?)', [username, email, Number(age)])
    }
    catch(exception)
    {
        return res.status(500).json({
        msg: 'An error occurred'
    });
    }

    return res.status(200).json({
        msg: 'Success'
    });
})

// Listening
app.listen(process.env.PORT, async (error)=>{
    console.log(`Hi! Process running on port ${process.env.PORT}`)
})


// LOG CHECKING //////////////////////////////////////////////////
const CHECK_TIME = 10000 // in ms 
setInterval(()=>{
    const data = fs.readFileSync(`${process.env.LOG_PATH ?? `${process.cwd()}/../shared`}/log.txt`);
    console.log('<!> CHECKING LOG SIZE: ', data.toString().split('\n').length, 'lines')
}, CHECK_TIME)