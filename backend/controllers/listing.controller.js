import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import {cloudinary } from "../config/cloudinary.js";
import getCoords from "../config/coord.js";

export const addListing = async(req,res)=>{
    try {
        let host = req.userId;
        let {title,description,rent,city,landmark,category} = req.body;
        const image1 = req.files.image1[0].path;
        const image2 = req.files.image2[0].path;
        const image3 = req.files.image3[0].path;
        const geoJSON = await getCoords(`${landmark}, ${city}`);

    if (!geoJSON) {
      return res.status(400).json({ message: "Could not find coordinates for this location." });
    }
       
        let listing = await Listing.create(
            {
                title,
                description,
                rent,
                city,
                landmark,
                category,
                image1,
                image2,
                image3,
                host,
                geometry: geoJSON
            }
        );

        let user = await User.findByIdAndUpdate(host,{$push:{listing:listing._id}},{new:true})
       
        if(!user)
        {
            return res.status(400).json({message:'User is not found'});
        }
        

        res.status(201).json(listing);



    } 
    // catch (error) {
    //       console.log(error);
    
    //     res.status(500).json({message:` ADD LISTING ERROR : ${error}`})
        
    // }

    catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An unexpected server error occurred" });
}
}


export const getListing = async(req,res)=>{
    try
    {
         let listing = await Listing.find().sort({createdAt:-1});
         res.status(200).json(listing)

    }
    catch(error)
    {
        res.status(500).json({message:`getListing error : ${error}`})
        
    }
}


export const findListing = async(req,res)=>{
    try
    {
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
      return  res.status(404).json({message:"Listing Not Found"});
    }

    res.status(200).json(listing);
    }
    catch(error)
    {
        res.status(500).json({message:`FindListing error : ${error}`});


    }
}


// used to delete the previous image on the  cloudinary
const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/');
        const listingsIndex = parts.indexOf('listings'); 
        if (listingsIndex === -1) return null;
        const publicIdWithExtension = parts.slice(listingsIndex).join('/');
        return publicIdWithExtension.split('.')[0]; 
    } catch (error) {
        return null;
    }
};

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const host = req.userId;
        const { title, description, rent, city, landmark, category } = req.body;

        let listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        if (listing.host.toString() !== host.toString()) return res.status(403).json({ message: 'Unauthorized' });

        const updateData = { title, description, rent, city, landmark, category };

        const isLocationChanged = 
            (landmark && landmark !== listing.landmark) || 
            (city && city !== listing.city);

        if (isLocationChanged) {
            const searchLandmark = landmark || listing.landmark;
            const searchCity = city || listing.city;

            const geoJSON = await getCoords(`${searchLandmark}, ${searchCity}`);
            if (!geoJSON) {
                return res.status(400).json({ message: "Could not find coordinates for the updated location." });
            }
            updateData.geometry = geoJSON;
        }
        
        if (req.files?.image1?.[0]) {
            if (listing.image1) {
                const oldPublicId = getPublicIdFromUrl(listing.image1);
                if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
            }
            updateData.image1 = req.files.image1[0].path;
        }

        if (req.files?.image2?.[0]) {
            if (listing.image2) {
                const oldPublicId = getPublicIdFromUrl(listing.image2);
                if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
            }
            updateData.image2 = req.files.image2[0].path;
        }

        if (req.files?.image3?.[0]) {
            if (listing.image3) {
                const oldPublicId = getPublicIdFromUrl(listing.image3);
                if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
            }
            updateData.image3 = req.files.image3[0].path;
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        res.status(200).json(updatedListing);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `UPDATE LISTING ERROR: ${error.message}` });
    }
};


export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const host = req.userId; 

        
        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        
      
        if (listing.host.toString() !== host.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

       
        const imageFields = ['image1', 'image2', 'image3'];
        
        for (const field of imageFields) {
            const imageUrl = listing[field];
            if (imageUrl) {
                const publicId = getPublicIdFromUrl(imageUrl); 
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        
        await Listing.findByIdAndDelete(id);

      
        await User.findByIdAndUpdate(host, { $pull: { listing: id } });

        res.status(200).json({ message: 'Listing permanently deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `DELETE ERROR: ${error.message}` });
    }
};


export const ratingListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { ratings } = req.body;

        const newRatingNum = Number(ratings);
        
        
        if (isNaN(newRatingNum) || newRatingNum < 1 || newRatingNum > 5) {
            return res.status(400).json({ message: "Invalid rating value. Must be a number between 1 and 5." });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        
        const currentNumOfReviews = listing.numberOfReviews || 0;
        const currentRating = listing.ratings || 0;

      
        const totalRatingScore = (currentRating * currentNumOfReviews) + newRatingNum;
        const newNumOfReviews = currentNumOfReviews + 1;
        
       
        listing.ratings = Number((totalRatingScore / newNumOfReviews).toFixed(1));
        listing.numberOfReviews = newNumOfReviews;

        await listing.save();

        return res.status(200).json({ 
            message: "Rating saved successfully!",
              });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `RATING CONTROLLER ERROR: ${error.message}` });
    }
};



export const search = async (req,res) => {
    try {
        
        const { query } = req.query;
    
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
    
        const listing = await Listing.find({
            $or: [
                { landmark: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { title: { $regex: query, $options: "i" } },
            ],
        });
    
       return res.status(200).json(listing);
    } catch (error) {
        console.error("Search error:", error);
      return  res.status(500).json({ message: "Internal server error" });
    }
    }
