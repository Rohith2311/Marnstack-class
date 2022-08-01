const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const nodemailer = require("nodemailer")
const Register = require("./models/registers");
const port = process.env.PORT || 5050;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../src/templates/views"); //  second path folder
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    //res.send("Welcome to registration & Login Page Web Development")
    res.render("index")   // start up file
});

app.get("/email", (req, res) => {
    //res.send("Welcome to registration & Login Page Web Development")
    res.render("email")   // start up file
});

app.post("/send", (req, res) => {
    const output = `
        <p>you have a new contact request</p>
        <h3>Contect detials</h3>
        <ol>
            <li>Name :${req.body.name}</li>
            <li>Company :${req.body.company}</li>
            <li>Email :${req.body.email}</li>
            <li>Phone :${req.body.Phone}</li>
            <li>Message :${req.body.message}</li>
        </ol>
    `;

    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        auth: {
            user: "divyababy1805@gmail.com",
            pass: "xqvxnpmehquwqojt"
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
        }
    });
    let mailOption = {
        from: "divyababy1805@gmail.com",
        to: req.body.email,
        subject: "no subject",
        text: req.body.message,
        // html: output
    }
    transport.sendMail(mailOption, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message info : %s", info.messageId);
        console.log("Prevew URL info : %s", nodemailer.getTestMEssageUrl(info));

    });

    res.status(200).send(output)
})



app.get("/register", (req, res) => {
    res.render("register");
    //res.sendfile(__dirname + "/register");
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                mobile: req.body.mobile,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,

            })

            const regsitered = await registerEmployee.save();
            res.status(201).render("index");

        }
        else {
            console.log("Password is not matching ");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    //console.log("hi")

    const mail = req.body.email;
    const pass = req.body.password;
    console.log(mail)
    console.log(pass)
    const useremail = await Register.findOne({ email: mail })
    console.log(useremail)
    if (useremail.password === pass) {
        res.status(201).render("dashboard")
    }
    else {
        res.send("Password is not matched")
    }
})


app.get('/dashboard', (req, res) => {
    // res.json('from list');
    Register.find((err, docs) => {
        if (!err) {
            res.render("dashboard", {
                list: docs
            });
        }
        else {
            console.log('error')
        }
    });
});

let multer = require('multer');
let bodyParser = require('body-parser');
var upload = multer({ dest: './uploads' });
let fs = require('fs');
let dir = "./uploads";

app.get('/dashboard', (req, res) => {
    images.find((err, images) => {
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            return image.toObject();
        });
        res.render('dashboard.hbs', { images: images });
    });

});
const Image = require('./models/image.js');
app.post('/dashboard', upload.single('image'), (req, res) => {
    var filePath = './uploads/' + req.file.filename;
    var uploadedImage = new Image({
        img: {
            data: fs.readFileSync(filePath),
            imgType: req.file.mimetype
        }
    });
    uploadedImage.save(err => {
        if (err) { console.log(err); return; }
        console.log('image saved');
        res.redirect('/dashboard');
    });
});