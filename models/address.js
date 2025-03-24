const mongoose = require('mongoose')

const userAddressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
})

const UserAddress = mongoose.model('UserAddress', userAddressSchema)

module.exports = UserAddress;