const express = require('express');
const ProductData = require('./src/model/Productdata');
// npm i cors
const cors = require('cors');
// npm i body-parser
var bodyparser=require('body-parser');
// npm install jsonwebtoken
const jwt= require('jsonwebtoken');

var app = new express();

app.use(cors());
// CORS is a cross origin resource sharing.It should be enabled so that the data from the nodejs can be shared
// to any external server [i.e here we are sharing this data to the angular application]

app.use(bodyparser.json());
app.use(express.json());
// body-parser is used as a middleware

// we are setting the login credentials

username='admin';
password='1234';

// middleware for verifying token

function verifyToken(req, res, next)
{

if(!req.headers.authorization)
{
    return res.status(401).send('Unauthorized Request')
}
let token=req.headers.authorization.split('')[1]
if (token === 'null'){
    return res.status(401).send('Unauthorized request')
}
let payload = jwt.verify(token,'secretKey')
console.log(payload)
if(!payload){
    return res.status(401).send('Unauthorized request')
}
req.userId=payload.subject
next()
}



// creating routing for login

app.post('/login',(req,res)=>{
    let userData= req.body

    if(!username){
        res.status(401).send('invalid username')
    }
    else
    if(password !== userData.password){
        res.status(401).send("invalid password")
    }
    else{
        // generating webtoken
        let payload ={subject: username+password}
        let token = jwt.sign(payload,'secretkey')
        res.status(200).send({token})
    }
})

app.get('/products',function(req,res){
   

    ProductData.find()
    .then(function(products){
        res.send(products)
    });
});

// to add new product

app.post('/insert',function(req,res){

    console.log(req.body);
    var product ={
        productId: req.body.product.productId,
        productName: req.body.product.productName,
        productCode: req.body.product.productCode,
        releaseDate:req.body.product.releaseDate,
        description:req.body.product.description,
        price: req.body.product.price,
        starRating: req.body.product.starRating,
        imageUrl : req.body.product.imageUrl,
    }
    var product = new ProductData(product);
    product.save();
})

// to get a product with its id

app.get('/:id',function(req,res){
   

    const id = req.params.id;
    ProductData.findOne({"_id":id})
    .then ((product)=>{
        res.send(product)
    })
})


// to update existing product details

app.put('/update',(req,res)=>{
    console.log(req.body)
    id=req.body._id,
    productId= req.body.productId,
    productName = req.body.productName,
    productCode = req.body.productCode,
    releaseDate = req.body.releaseDate,
    description = req.body.description,
    price = req.body.price,
    starRating = req.body.starRating,
    imageUrl = req.body.imageUrl
   ProductData.findByIdAndUpdate({"_id":id},
                                {$set:{"productId":productId,
                                "productName":productName,
                                "productCode":productCode,
                                "releaseDate":releaseDate,
                                "description":description,
                                "price":price,
                                "starRating":starRating,
                                "imageUrl":imageUrl}})
   .then(function(){
       res.send();
   })
 })


// to delete a product with id

app.delete('/remove/:id',(req,res)=>{
   

    id= req.params.id;
    ProductData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log("success")
        res.send()
    })

})



app.listen(7000,function(){
    console.log("server is ready at 7000");
})