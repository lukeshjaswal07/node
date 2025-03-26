const bcrypt = require('bcrypt');

const saltRounds = 10;

const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const Joi = require('joi');
const register = async (req, res) => {

    try {
        // const  {name, email, password} = req.body;     
        // if (!req.body.name || !req.body.email || !req.body.password) {

        //     return res.status(200).send({

        //         "status": 200,

        //         "message": "All Fields Are Required",

        //     });
        // }

        const schema = Joi.object().keys({

            name: Joi.string().required(),

            email: Joi.string().email().required(),

            password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@])[A-Za-z\\d@]{3,30}$")).required().messages({

                "string.pattern.base": "Password must contain only letters, numbers, and '@', and be 3-30 characters long.",

                "string.empty": "Password cannot be empty.",

                "any.required": "Password is required.",
            }),

            role: Joi.optional().allow("")

        });

        const { error, value } = schema.validate(req.body);

        if (error) {

            // console.log(error) 

            return res.status(400).json({

                "status": 400,

                "message": error.details[0].message

            });

        }

        let username = req.body.name;

        let email = req.body.email;

        if (req.body.role) {

            var role = req.body.role;

        }

        let password = await bcrypt.hash(req.body.password, saltRounds);

        const usernameExists = await User.findOne({ email: email });

        if (usernameExists) {
            return res.status(200).send({

                "status": 200,

                "message": "User Already Exist"
            });
        }

        const user = new User({

            name: username,

            email: email,

            password: password,

            role: role ?? ""

        })

        const save_user = await user.save();

        if (save_user) {

            return res.status(200).send({

                "status": 200,

                "message": "User Registeration Successful",

                "data": save_user

            });

        } else {

            return res.status(400).send({

                "status": 400,

                "message": "something went Wrong"

            });

        }
    } catch (error) {

        return res.status(200).send({

            "status": 200,

            "error": error.message,
        });
    }

};

const login = async (req, res) => {

    const email = req.body.email;

    const password = req.body.password;

    if (!email || !password) {

        return res.status(200).send({

            "status": 200,

            "message": "All Fields Are Required",

        });
    }

    const usernameExists = await User.findOne({ email: email });

    if (!usernameExists) {
        return res.status(200).send({

            "status": 200,

            "message": "User doesn't Exist"
        });
    }

    const storedHash = usernameExists.password; 

    bcrypt.compare(password, storedHash, function (err, result) {

        if (result === true) {

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            let data = {
                id: usernameExists.id,
                email: usernameExists.email,
                role: usernameExists.role,
            }

            const token = jwt.sign(data, jwtSecretKey, /*{ expiresIn: '30s' }*/);

            return res.status(200).send({

                "status": 200,

                "message": "Login Success",

                "token": token
            });

        } else {

            return res.status(400).send({

                "status": 400,

                "message": "Invalid Credentials"
            });

        }
    });

};

const updatePassword = async (req, res) => {

    try {
        let password = req.body.password;

        let confirm_password = req.body.confirm_password;

        if (!password || !confirm_password) {

            return res.status(400).send({

                "status": 400,

                "message": "All fields are required"
            });

        }

        if (password != confirm_password) {

            return res.status(400).send({

                "status": 400,

                "message": "Password didn't matched"
            });

        }

        let new_password = await bcrypt.hash(password, saltRounds);

        user_update = await User.findByIdAndUpdate(req.user.id,

            { password: new_password },

            { new: true });

        if (user_update) {
            return res.send({

                "status": 200,

                "message": "Password Updated!"

            })
        } else {

            return res.send({

                "status": 200,

                "message": "Something Went Wrong!"

            })
        }

    } catch (error) {

        console.log(error)

        return res.send({

            "errror": error

        })
    }

};

const deleteMyAccount = async (req, res) => {

    try {
        const email = req.user.email;

        const delete_this_record = await User.deleteOne(req.body.id);

        if (!delete_this_record) {

            return res.status(400).send({

                "status": 400,

                "message": "Something Went Wrong!"

            })

        }

        return res.status(200).send({

            "status": 200,

            "message": "Account deleted successfully"

        })
    } catch (error) {

        console.log(error)

        return res.status(200).send({

            "status": 200,

            "error": error.message

        })
    }

};

const getUsers = async (req, res) => {

    const users = await User.find({});

    return res.status(200).send({

        "status": 200,

        "data": users

    })

};

const ForgotPassword = async (req, res) => {

    let email = req.body.email;

    const usernameExists = await User.findOne({ email: email });

    if (!usernameExists) {
        return res.status(200).send({

            "status": 200,

            "message": "User doesn't Exist"
        });
    }

    var transporter = nodemailer.createTransport({

        service: 'gmail',

        auth: {

            user: 'lukesh@codenomad.net',

            pass: 'rcev yosl enxw ffxm'
        }

    });

    var mailOptions = {

        from: 'no-reply@team.com',

        to: email,

        subject: 'Forgot Password',

        html: "Click Here to Forgot Your Password <a href='https://test.com'>Click here</a>",

    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {

            return res.status(400).send({

                "status": 400,

                "message": "Something Went Wrong!"

            });

        } else {

            return res.status(200).send({

                "status": 200,

                "message": "An Email password reset link has been sent to your email!"

            });

        }

    });


};

module.exports = { register, login, updatePassword, deleteMyAccount, getUsers, ForgotPassword }    