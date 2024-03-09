const express = require('express');
const { Pool } = require('pg');
const pool = require('../queries');
const { use } = require('./movies');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', (req, res)=>{
    const limit = req.query.limit || 10; 
    const offset = req.query.offset || 0;

    pool.query(`
    SELECT * FROM users
    LIMIT ${limit} OFFSET ${offset}
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

router.get('/', function(req, res){
    pool.query(`
    SELECT * FROM users ${req.query.limit ? 'limit ' + req.query.limit : '10'}
    `, (err, result) => {
        if(err) {
            throw err
        }
        res.json(result.rows)
    }    
    )
})

router.get('/login',async function(req, res){
    const email = req.body.email
    const password = req.body.password
    try {
        let result = await pool.query(`
        SELECT * FROM users 
        WHERE email='${email}'
        `  
        )
        let user = result.rows[0]
        if(!user){
            res.status(401).json({
                "message" : "email invalid"
            })
        }
        if (user.password==password){
            const token = jwt.sign(
                {
                    userID: user.id,
                    role: user.role
                },
                'buatapaancoba',
                { expiresIn: '1h'}
                );
                res.json({
                    "token": token
                })
        }else{
            res.status(401).json({
                "message" : "password invalid"
            })
        }
    } catch (error) {
        
    }
   
})

router.post('/', (req, res)=>{
    const email = req.body.email
    const gender = req.body.gender
    const password = req.body.password
    const id = req.body.id
    console.log(email,gender,password,id)
    pool.query(`
    INSERT INTO users (id, email, gender, password, role) 
    VALUES 
    (${id}, '${email}', '${gender}', '${password}', User)
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

router.delete('/', (req, res)=>{
    pool.query(`
    DELETE FROM users where id = 100
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

router.put('/', (req, res)=>{
    pool.query(`
    UPDATE users SET gender = 'Male' WHERE ID = 99
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

module.exports = router