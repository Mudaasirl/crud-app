const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')   
const MongoClient = require('mongodb').MongoClient

// Constants
const PORT = 8080;
const HOST = '127.0.0.1';
 

//EDH4uLzaVc2tJdzQ

app.set('view engine','ejs')

const connectionString = 'mongodb+srv://itsmudassir14:EDH4uLzaVc2tJdzQ@cluster0.mcwltob.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString)
  .then( client => {
    
    console.log('Connected to Database')
    const db = client.db('urdushayri')
    const quotesCollection = db.collection('quotes')    
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

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
          {name:'safa'},
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
    
    app.listen(PORT, HOST, () => {console.log(`Running on http://${HOST}:${PORT}`);})
  })
  .catch(error => console.error(error))


    



