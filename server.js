const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var db_capacitors;
var all_info = {};
// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
MongoClient.connect('mongodb+srv://admin:admin@clusterdigikey-dt6y1.mongodb.net/digikey?retryWrites=true&w=majority', (err, database) => {
  if (err) return console.log(err)
  db = database.db('digikey')
  db.collection('digikey').distinct("Subcategory", function(err, result)
  {
    console.log("GETTING ALL CATEGORIES")
    all_info.categories = result;
  })
  MongoClient.connect('mongodb+srv://admin:admin@capacitors.khbor.mongodb.net/capacitors?retryWrites=true&w=majority', (err, database) => {
    if (err) return console.log(err)
    db_capacitors = database.db('capacitors')
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on 3000')
    })
  })

})




// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 




//For local DB
/* MongoClient.connect('mongodb://localhost:27017/config', (err, database) => {  
  if (err) return console.log(err)
  db = database.db('config')
  db.collection('ic_capacitors').distinct("Subcategory", function(err, result)
  {
    console.log("GETTING ALL CATEGORIES")
    all_info.categories = result;
    console.log("categories", all_info.categories)
  })
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
}) */
//End connection to local DB


/* const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@clusterdigikey-dt6y1.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

var options = {
  "limit": 10000,

}
//all_info.categories = categories
//new code section
var cat;

app.get('/', function(req, res) {
  cat =  req.query.selectpicker;
  console.log("value of selectPicket :", cat)
  if ((cat == undefined) || (cat == "clock-timing-clock-buffers-drivers"))
  {
    db.collection('digikey').aggregate([ { $match : {"Subcategory" : "clock-timing-clock-buffers-drivers"} } ]).toArray((err, result) => {
      all_info.allinfo = result;
    })
    all_info.categ = "clock-timing-clock-buffers-drivers";
    if (all_info.allinfo != null)
    {
      console.log("all_info.cat :", all_info.categ)
      console.log("RENDERING default PAGE AFTER ALL OK")  
      res.render('index.ejs', {digikey : all_info},);
    }
  }
  else
  {
    //all_info.allinfo = []
    db.collection('digikey').aggregate([ { $match : {"Subcategory" : cat} } ]).toArray((err, result) => {
      all_info.allinfosearch = result;
    })    
    all_info.categ = cat;
    if (all_info.allinfosearch)
    {
      console.log("all_info.cat :", all_info.categ)
      console.log("RENDERING search PAGE AFTER ALL OK")  
      res.render('index.ejs', {digikey : all_info},);
    }

  }
});

app.get('/capacitors', function(req, res) {
  db_capacitors.collection('cercaps').find({}).limit(5000).toArray((err, result) => {
    res.render('capacitors.ejs', {capacitors : result},);
  })
});

/* app.get('/', (req, res) => {
  var cat =  req.query.selectpicker;
  var search = false;
  if (cat == undefined)
  {
    search = false;
    console.log("value of selectpicker" , cat)
    console.log("1st time page with all results")
    db.collection('digikey').aggregate(
      [ { $match : {"Subcategory" : "clock-timing-clock-buffers-drivers"} } ]
  ).toArray((err, result) => {
    //if (err) return console.log(err)
    all_info.allinfo = result;
    //res.render('index.ejs', {digikey: result}, );
  })
  }
  else
  {
    console.log("value of selectpicker" , cat)
    console.log("Submitting a search")
    db.collection('digikey').aggregate(
      [ { $match : {"Subcategory" : cat} } ]
  ).toArray((err, result) => {
  if (err) return console.log(err)
    all_info.allinfo = result;
    console.log('*******REDIRECTING*********')
    //res.render('index.ejs', {digikey : all_info},);
    //res.render('/?selectpicker='+cat)
  //res.render('index.ejs', {digikey: result}, );
})
  }
  db.collection('digikey').distinct("Subcategory", function(err, result)
  {
    console.log("GETTING ALL CATEGORIES")
    //if (err) return console.log(err)
    all_info.categories = result;
    //if (all_info.allinfo && all_info.categories) 
    //{
      //res.render('index.ejs', {digikey : all_info},);
    //}
    //res.render('index.ejs', {entries : categories, digikey: all_records});
  })  
  //robot.keyTap('f5');
  if (all_info.allinfo && all_info.categories) 
    {
      if (search = false)
      {
      console.log("RENDERING PAGE AFTER ALL OK")
      res.render('index.ejs', {digikey : all_info},);
      }
      else
      {
      console.log("RENDERING PAGE AFTER Search  :   ", search)
      console.log("VALUE OF SELECT PICKER OF SEARCH", cat)
      res.redirect('/?selectpicker='+cat);
      }
    }
}) */


app.post('/digikey', (req, res) => {
  db.collection('digikey').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})




app.put('/digikey', (req, res) => {
  db.collection('digikey')
  .findOneAndUpdate({name: 'Description'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/digikey', (req, res) => {
  db.collection('digikey').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A record got deleted')
  })
})