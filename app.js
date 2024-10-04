if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
  
  const express=require("express");
  const app=express();
  const mongoose=require("mongoose");
  const path=require("path");
  const methodOverride=require("method-override");
  const Listing=require("./models/listing.js");
  const ejsMate=require("ejs-mate");
  const WrapAsync=require("./utils/wrapAsync.js");
  const ExpressError=require("./utils/ExpressError.js");
  const {listingSchema,reviewSchema} = require("./schema.js");
  const Review=require("./models/review.js");
  const review = require("./models/review.js");
  const listingRouter = require("./routes/listing.js");
  const reviewRouter = require("./routes/review.js");
  const session = require("express-session");
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy= require("passport-local");
  const User = require("./models/user.js");
  const userRouter = require("./routes/user.js");
  

   const dbUrl = process.env.ATLASDB_URL;

  main()
  .then(()=>{
  console.log("connected to db");
  })
  .catch((error)=>{
      console.log(error);
  });


  async function main(){
      await mongoose.connect(dbUrl);
  }

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"/views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.use(express.static(path.join(__dirname,"/public")));
    app.engine("ejs",ejsMate);

    const store = MongoStore.create({
      
      mongoUrl: dbUrl,
      crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24 * 3600,
    });

    store.on("error", ()=>{
     console.log("ERROR IN MONGO SESSION STORE",err);
    });
    
  
  
  const sessionOptions = {
     store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly: true
    }
  };




  
  app.use(session(sessionOptions));
  app.use(flash());
  

  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
  });
    

// // app.get("/demouser",async(req,res)=>{

// // let Fakeuser = new User({
// //   email:"student2@getMaxListeners.com",
// //   username:"deltanew-student"
// // });

// //    let registereduser= await User.register(Fakeuser,"helloworld");
// //    res.send(registereduser);

// // });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((err,req,res,next)=>{
  let {statuscode=500,message="Oops sorry!"}=err;
res.status(statuscode).render("error.ejs",{message});
  // res.status(statuscode).send(message);
});
app.listen(8080,()=>{
console.log("server is listening on port 8080");
});





