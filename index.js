const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./queries.js');
const jwt = require('jsonwebtoken');
const app = express();
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const fileMovies = fs.readFileSync('./documentation/movies_api.yaml', 'utf8');
const swaggerDocument = YAML.parse(fileMovies)
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/', (req, res) => {
    const token = jwt.sign(
        {
            userID: 101,
            role: 'Engineer'
        },
        'buatapaancoba',
        { expiresIn: '1h'}
    );
    res.json({
        token: token,
    });
})

app.get('/verify/:token', (req, res) => {
    const token = jwt.verify(
        req.params.token,
        `buatapaancoba`
    );
    res.json({
        data: token,
    });        
})

const movies = require('./routes/movies.js');
const users = require('./routes/users.js');
const swaggerJSDoc = require('swagger-jsdoc');
const { version } = require('os');
const { url } = require('inspector');

pool.connect((err, res)=>{
    console.log(err)
    console.log('Connected')
})

app.use('/users', users);
app.use('/movies', movies);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.1.0',
            description:
            'This is a simple CRUD API application made with express and documented with swagger',
        },
        servers:[
            {
                url:'http://localhost:3000',
            }
        ]
    },
    apis:['./routes/*']  
};
const specs = swaggerJSDoc(options);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


app.listen(3000)
