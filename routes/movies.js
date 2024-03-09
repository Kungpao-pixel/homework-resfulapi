const express = require('express');
const { Pool, Query } = require('pg');
const pool = require('../queries');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use('/', (req, res, next) => {
    let token = req.headers.token
    let payload = jwt.verify(token, 'buatapaancoba')
    if(payload) {
        next();
    }
})

router.get('/', (req, res)=>{
    const limit = req.query.limit || 10; 
    const offset = req.query.offset || 0;

    pool.query(`
    SELECT * FROM movies
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
    SELECT * FROM movies ${req.query.limit ? 'limit ' + req.query.limit : '10'}
    `, (err, result) => {
        if(err) {
            throw err
        }
        res.json(result.rows)
    }    
    )
})

router.post('/', (req, res)=>{
    pool.query(`
    INSERT INTO movies (id, title, genres, year) 
    VALUES 
    ('101', 'Dead Man', 'Thriller', 2012),
    ('102', 'The Flinstone', 'Comedy', 2001)
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

router.delete('/', (req, res)=>{
    pool.query(`
    DELETE FROM movies where id = 201
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})

router.put('/', (req, res)=>{
    pool.query(`
    UPDATE movies SET genres = 'Documentation' WHERE ID = 102
    `, (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
})





module.exports = router
