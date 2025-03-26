const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

dotenv.config();
const AdminMiddleware_ = (req, res, next) => {

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (req.headers.authorization == undefined) {

        return res.send({

            "status": 400,

            "message": "Token Missing"
        });

        
    }
    const token = req.headers.authorization.split(' ')[1];

    try {

        const verified = jwt.verify(token, jwtSecretKey);

        req.user = verified;

        if (req.user.role == "admin") {

            next();

        } else {

            return res.send({

                "status": 400,

                "message": "Unauthorized Access"
            });

        }


    } catch (error) {

        return res.send({

            "status": 400,

            "message": "Invalid Token"
        });

    }
};

module.exports = { AdminMiddleware_ };