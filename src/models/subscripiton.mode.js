import mongoose, { Schema } from "mongoose";


const subscriptonsSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export const Subscription = mongoose.model("Subscription",subscriptonsSchema);