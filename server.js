const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')   
const MongoClient = require('mongodb').MongoClient
// const dotenv = require('dotenv');
// dotenv.config();

const port = process.env.PORT || 8080

app.set('view engine','ejs')

const connectionString = process.env.PASSWORD
MongoClient.connect(connectionString)
  .then( client => {
    
    console.log('Connected to Database')
    const db = client.db('urdushayri')
    const quotesCollection = db.collection('quotes')    
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    console.log('peepee poopoo')
    app.get('/',(req,res) => {
      db.collection('quotes')
        .find()
        .toArray()
        .then(results => {          
          res.render('index.ejs', { quotes:results })
        })
        .catch(error => console.error(error))      
    })

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {res.redirect('/')})
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        quotesCollection
        .findOneAndUpdate(
          {name:'me'},
          {
            $set:{
            name:req.body.name,
            quote:req.body.quote,
          },
        },
        {
          upsert:true,
        }
          )
        .then(result => {
          res.json({
            name:req.body.name,
            quote:req.body.quote,})
        })
        .catch(err => {console.error(err)})
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection
          .deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
          })      
          .catch(error => console.error(error))
    })
    
    app.listen(port, () => {console.log(`Running on http://localhost:${port}`);})
  })
  .catch(error => console.error(error))

