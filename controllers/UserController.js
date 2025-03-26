const User = require('../models/user.js');

const UserAddress = require('../models/address.js');

const mongoose = require('mongoose');
const GetUserProfile = async (req, res) => {

    // const user_data = await User.findOne({ email: req.user.email });

    try {
        const user_data = await User.aggregate([

            { $match: { _id: new mongoose.Types.ObjectId(req.user.id) } },

            {
                $lookup: {
                    from: "useraddresses",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "full_address"
                }
            },
        ]);

        return res.status(200).send({

            "status": 200,

            "data": user_data

        })

    } catch (error) {
        console.log("error")
        return res.status(200).send({

            "status": 400,

            "error": error.message

        })
    }

}

const UpdateProfile = async (req, res) => {

    try {
        let address = req.body.address;

        let profile = req.file.filename;

        let existingAddress = await UserAddress.findOne({ user_id: req.user.id });

        if (!existingAddress) {

            const User_Address = new UserAddress({

                user_id: req.user.id,

                address: address,

                profile: profile,

            })

            const save_user_address = await User_Address.save();

            if (!save_user_address) {
                return res.status(400).send({

                    "status": 400,

                    "message": "something went Wrong"

                });
            }

            return res.status(200).send({

                "status": 200,

                "message": "Address Updated Successfully!"

            });

        } else {

            const save_user_address = await UserAddress.updateOne(

                { user_id: req.user.id },

                {
                    $set: {
                        address: address,

                        profile: profile,
                    }
                }
            );

            if (!save_user_address) {
                return res.status(400).send({

                    "status": 400,

                    "message": "something went Wrong"

                });
            }

            return res.status(200).send({

                "status": 200,

                "message": "Address Updated Successfully!"

            });
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { GetUserProfile, UpdateProfile };