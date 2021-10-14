var express = require("express");
var app = express();
var path = require('path')
var bodyParser = require('body-parser')



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/donate', (req, res) => {
    res.render('donation', {name: 'little homes', id: 1})
})


var Razorpay=require("razorpay");

let instance = new Razorpay({
  key_id: 'KEY_ID', 
  key_secret: 'KEY_SECRET'
})

app.post("/api/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
       res.send({"sub":data,"status":"success"});
}).catch((error) => {
       res.send({"sub":error,"status":"failed"});
})
});

app.post("/api/payment/verify",(req,res)=>{
body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
var crypto = require("crypto");
var expectedSignature = crypto.createHmac('sha256', 'KEY_SECRET')
                                .update(body.toString())
                                .digest('hex');
                                console.log("sig"+req.body.razorpay_signature);
                                console.log("sig"+expectedSignature);
var response = {"status":"failure"}
if(expectedSignature === req.body.razorpay_signature)
 response={"status":"success"}
    res.send(response);
});


app.listen("3000",()=>{
    console.log("server running at port 3000");
})