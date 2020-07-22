const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var timeout = require('connect-timeout')
const MongoClient = require('mongodb').MongoClient

var db;
var db_capacitors;
var all_info = {};
var fields = {};
// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
MongoClient.connect('mongodb+srv://admin:admin@clusterdigikey-dt6y1.mongodb.net/digikey?retryWrites=true&w=majority', (err, database) => {
  if (err) return console.log(err)
  db = database.db('digikey')
  db.collection('digikey').distinct("Subcategory", function(err, result)
  {
    console.log("GETTING ALL CATEGORIES")
    all_info.categories = result;
  })
  db.collection('digikey').find({"Subcategory" : "clock-timing-clock-buffers-drivers"},{ "Subcategory": 1, "min Operating Temp (°C)": 1, "max Operating Temp (°C)":1, "Datasheets":1, "Description":1, "min Voltage - Supply (V)":1, "max Voltage - Supply (V)":1 , "Current - Input Bias (mA)":1, "Category":1}
  ).limit(500).toArray((err, result) => {
    all_info.allinfo = result;
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
  if ((cat == undefined))
  {
    all_info.categ = "nothing";
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
    db.collection('digikey').aggregate([{ $match : {"Subcategory" : cat}}]).toArray((err, result)=> {
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

/* app.get('/search-get', function(req, res){
  // req.body object has your form values
  //res.redirect('/search')
  db.collection('digikey').aggregate([
    {"$project":{"arrayofkeyvalue":{"$objectToArray":"$$ROOT"}}},
    {"$unwind":"$arrayofkeyvalue"},
    {"$group":{"_id":null,"allkeys":{"$addToSet":"$arrayofkeyvalue.k"}}}
  ]).toArray((err, result) => {
    //field_ic = result
    console.log("getting digikey fields")
    //console.log(field_ic)
    res.render('search-get.ejs', {fields : result},);
  })
}); */

app.get('/search-get', function(req, res){
    res.render('search-get.ejs');
});


app.get('/search-post', function(req, res){
  
  if (req.query.desc)
  {
    description = req.query.desc
  }
  else
  {
    description = ''
  }
  if (req.query.sub)
  {
    Subcategory = req.query.sub
  }
  else
  {
    Subcategory = ''
  }
  if (req.query.mintempmin)
  {
    mintempmin = req.query.mintempmin
  }
  else
  {
    mintempmin = ''
  }
  if (req.query.mintempmax)
  {
    mintempmax = req.query.mintempmax
  }
  else
  {
    mintempmax = ''
  }
  if (req.query.maxtempmin)
  {
  maxtempmin = req.query.maxtempmin
  }
  else
  {
    maxtempmin = ''
  }
  if(req.query.maxtempmax)
  {
    maxtempmax = req.query.maxtempmax
  }
  else
  {
    maxtempmax = ''
  }
  if(req.query.minvoltmin)
  {
  minvoltmin = req.query.minvoltmin
  }
  else
  {
    minvoltmin = ''
  }
  if(req.query.minvoltmax)
  {
  minvoltmax = req.query.minvoltmax
  }
  else
  {
    minvoltmax = ''
  }
  if(req.query.maxvoltmin)
  {
  maxvoltmin = req.query.maxvoltmin
  }
  else
  {
    maxvoltmin = ''
  }
  if(req.query.maxvoltmax)
  {
  maxvoltmax = req.query.maxvoltmax
  }
  else
  {
    maxvoltmax = ''
  }
  if(req.query.mincur)
  {
    mincur = req.query.mincur
  }
  else 
  {
    mincur = ''
  }
  if(req.query.mincur)
  {
    maxcur = req.query.maxcur
  }
  else 
  {
    maxcur = ''
  }


  var conditions = {}; //declare a conditions object
  var and_clauses = []; //an array for the and conditions (and one for or conditions and so on)
  console.log(req.query)

  if (description != '')
  {
    //description = req.query.desc
    and_clauses.push({ 'Description': {$regex: description, $options: "$i" }});
  }

  if (Subcategory != '')
  {
    
    //Subcategory = req.query.sub
    and_clauses.push({"Subcategory": {$regex: Subcategory, $options: "$i"}});
  }

  if (mintempmin != '')
  {
    //mintempmin = req.query.mintempmin
    and_clauses.push({ 'min Operating Temp (°C)': {$gte: parseFloat(mintempmin) }});
  }

  if (mintempmax != '')
  {
    //mintempmax = req.query.mintempmax
    and_clauses.push({ 'min Operating Temp (°C)': {$lt: parseFloat(mintempmax)}});
  }

  if (maxtempmin != '')
  {
    //mintempmin = req.query.mintempmin
    and_clauses.push({ 'max Operating Temp (°C)': {$gte: parseFloat(maxtempmin) }});
  }

  if (maxtempmax != '')
  {
    //mintempmax = req.query.mintempmax
    and_clauses.push({ 'max Operating Temp (°C)': {$lt: parseFloat(maxtempmax)}});
  }


  if (minvoltmin != '')
  {
    //mintempmin = req.query.mintempmin
    and_clauses.push({'min Voltage - Supply (V)': {$gte: parseFloat(minvoltmin) }});
  }

  if (minvoltmax != '')
  {
    //mintempmax = req.query.mintempmax
    and_clauses.push({ 'min Voltage - Supply (V)': {$lt: parseFloat(minvoltmax)}});
  }

  if (maxvoltmin != '')
  {
    //mintempmin = req.query.mintempmin
    and_clauses.push({'max Voltage - Supply (V)': {$gte: parseFloat(maxvoltmin) }});
  }

  if (maxvoltmax != '')
  {
    //mintempmax = req.query.mintempmax
    and_clauses.push({ 'max Voltage - Supply (V)': {$lt: parseFloat(maxvoltmax)}});
  }

  if (mincur != '')
  {
    //mintempmin = req.query.mintempmin
    and_clauses.push({'Current - Input Bias (mA)': {$gte: parseFloat(mincur) }});
  }

  if (maxcur != '')
  {
    //mintempmax = req.query.mintempmax
    and_clauses.push({ 'Current - Input Bias (mA)': {$lt: parseFloat(maxcur)}});
  }

  if(and_clauses.length > 0){ 
    conditions['$and'] = and_clauses; // filter the search by any criteria given by the user
}

console.log(JSON.stringify(conditions))

  console.log("Subcategory", Subcategory)
  console.log("Description", description)
  console.log("mintempmin", parseFloat(mintempmin))
  console.log("mintempmax", parseFloat(mintempmax))
  console.log("maxtempmin", parseFloat(maxtempmin))
  console.log("maxtempmax", parseFloat(maxtempmax))
  console.log("mincur", parseFloat(mincur))
  console.log("maxcur", parseFloat(maxcur))
  //console.log(parseFloat(minvoltmin),parseFloat(minvoltmax), parseFloat(maxvoltmin), parseFloat(maxvoltmax), parseFloat(mincur), parseFloat(maxcur))
  db.collection('digikey').find(conditions, { "Subcategory": 1, "min Operating Temp (°C)": 1, "max Operating Temp (°C)":1, "Datasheets":1, "Description":1, "min Voltage - Supply (V)":1, "max Voltage - Supply (V)":1 , "Current - Input Bias (mA)":1, "Category":1})
    .limit(5000).toArray((err, result) => {
    res.render('search-post.ejs', {search_result : result},);
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
