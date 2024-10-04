const express=require("express");
const router=express.Router({ mergeParams: true });
const WrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//review create route
    router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.createReview));
    
//review delete route
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewController.destroyReview));
    
    module.exports=router;