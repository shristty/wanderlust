const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});

const Review = require("../models/review");

module.exports.index = async (req,res)=>{
    const allListings=await Listing.find({ });
  
    res.render("listings/index.ejs",{allListings});}

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
    }

 module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
    req.flash("error","listings you requested for does not exist!");
    res.redirect("/listings");}
    console.log(listing);
    res.render("listings/show.ejs",{listing});
    }   

    module.exports.createListing =async (req, res, next) => {
      let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
            .send()
          
          
         
        let url = req.file.path;
        let filename = req.file.filename;
     
        const newListing = new Listing(req.body.listing);
        newListing.owner= req.user._id ;
        newListing.image = {url,filename};
        newListing.geometry = response.body.features[0].geometry;
       let savedListing = await newListing.save();
   
        req.flash("success","New listing Created!");
        res.redirect("/listings");}

    module.exports.renderEditForm= async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","listings you requested for does not exist!");
        res.redirect("/listings");}
         let originalImageUrl = listing.image.url;
         originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing ,  originalImageUrl});}    

     module.exports.updateListing = async (req,res)=>{
        let {id}=req.params;
        const listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
         
        if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
       listing.image = { url,filename };
       await listing.save();
        }
        req.flash("success","listing updated!");
        res.redirect("/listings");
        }   

       module.exports.destroyListing =   async (req, res, next) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");}
        req.flash("success"," listing deleted successfully!");
        res.redirect("/listings"); } 