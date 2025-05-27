
const mongoose=require("mongoose");
const initdata=require("./data.js");
console.log(initdata.data);
const Listing=require("../models/listing.js");
main()
.then(()=>{
console.log("connected to db");
})
.catch((error)=>{
    console.log(error);
});

 







async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
   
}
 const initdb =async()=>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({ ...obj , owner:'68349997e2a4fcd71d4e5f5f'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initdb();