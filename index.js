const express = require("express");

const app = express();

const PORT = 8090;

const multer = require('multer');

const storage = multer.diskStorage({
    destination: "./user_profile",
    filename: (req, file, cb) => {
        return cb(
            null,
            `${file.fieldname}_${Date.now()}.jpg`
        );
    },
});

const upload = multer({ storage: storage });

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const User = require('./models/user.js');

const dbconnection = require('./dbconnection.js');

const { register, login, updatePassword, deleteMyAccount, getUsers, ForgotPassword } = require("./controllers/AuthController.js");

const { GetUserProfile, UpdateProfile } = require("./controllers/UserController.js");

const { TokenMiddleware_ } = require("./middleware/TokenMiddleware.js");

const { AdminMiddleware_ } = require("./middleware/AdminMiddleware.js");

app.get('/testing', (req, res) => {
    
    return res.status(200).send({

        "status": 200,

        "message": "Working Fine"

    })

});

app.post("/register", register)

app.post('/login', login)

app.post("/update-password", TokenMiddleware_, updatePassword)

app.get("/delete-my-account", TokenMiddleware_, deleteMyAccount)

app.get("/profile", TokenMiddleware_, GetUserProfile)

app.get('/get-users', AdminMiddleware_, TokenMiddleware_, getUsers)

app.post('/forgot-password', ForgotPassword)

app.post('/update-profile', upload.single('file'), TokenMiddleware_, UpdateProfile)

app.listen(PORT, () => {

    console.log("Server Started at POST " + PORT)

});