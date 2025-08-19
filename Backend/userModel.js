const mongoose = require('mongoose');
const validator = require('validator');

// Billing schema
const billingSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    account_name: {
        type: String,
        required: true
    },
    receipt_image: {
        type: Buffer, // To store image as binary data
        required: true
    },
    isApproved: {
        type: String,
        default: "Not Approved" // Initial value is false, admin will control this
    },
    profit: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Account summary schema
// Account summary schema
const accountSummarySchema = new mongoose.Schema({
    TotalBalance: {
        type: Number,
        default: 0
    },
    TotalDeposit: {
        type: Number,
        default: 0
    },
    timeOfClickingAd: {
        type: Date,
        default: new Date(0) // Default to Unix epoch time
    },
    NumberOfDeposit: {
        type: Number,
        default: 0
    },
    TotalEarning: {
        type: Number,
        default: 0
    },
    TotalWithdraw: {
        type: Number,
        default: 0
    }
});

const withDrawSchema=new mongoose.Schema({
    amount:{
          type:Number,
          required:true
    },
    accountNo:{
        type:String,
          required:true
    },
    accountName:{
        type:String,
        required:true
    }
})

// User schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email!'
        }
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    billings: [billingSchema],
    withdrawings:[withDrawSchema], // Embedding billing schema
    accountSummary: {
        type: accountSummarySchema,
        default: () => ({}) // Default value to initialize the embedded document
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
