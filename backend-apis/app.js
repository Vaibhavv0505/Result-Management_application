const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("./util/database")
const Teacher = require("./util/models/teacher")
const Student = require("./util/models/student")
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin:['http://localhost:4200'],
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
})
const session = require('express-session')
app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 300000 },
    saveUninitialized: false
}))


app.post("/login", (req, res) => {
    var User = req.body.userEmail;
    var pass = req.body.userPassword;
    User = User.trim();
    pass = pass.trim();
    res.header('Access-Control-Allow-Credentials', true);
    sequelize.sync().then(itr => {
        return Teacher.findAll({ where: { user: User, password: pass } }).then(item => {
            if (item.length != 0) {
                res.status(200).json(item[0]);

            }
            else {
                res.status(500).json({isUserValid: false})
            }
        })
    })
})
//admin route
app.get('/admin', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true);
    sequelize.sync().then(itr => {
        return Student.findAll().then(item => {
            res.status(200).json( item );
        })
    })

})
app.post("/result", (req, res) => {
    var name = req.body.name;
    var id = req.body.id;
    name = name.trim();
    
    res.header('Access-Control-Allow-Credentials', true);
    sequelize.sync().then(itr => {
        return Student.findAll({ where: { id: id } }).then(item => {
            res.status(200).json( item );
        })
    })
})


app.post("/add", (req, res) => {

    var NAME = req.body.name;
    var DOB = req.body.dob;
    var SCORE = req.body.score;
    res.header('Access-Control-Allow-Credentials', true);
    sequelize.sync().then(stud => {
        Student.create({ name: NAME, dob: DOB, score: SCORE }).then(result => {
            res.status(200).json(result);
        })
    })


})

app.post('/edit', function (req, res) {
    
        var ID = req.body.id
        var NAME = req.body.name;
        var DOB = req.body.dob;
        var SCORE = req.body.score;
        res.header('Access-Control-Allow-Credentials', true);
        sequelize.sync().then(stud => {
            Student.update({ name: NAME, dob: DOB, score: SCORE }, { where: { id: ID } }).then(result => {
                res.status(200).json(result);
            })
        })
    
})

app.post('/delete', function (req, res) {
    
        var ID = req.body.id;
        res.header('Access-Control-Allow-Credentials', true);
        Student.destroy({ where: { id: ID } }).then(result => {
            res.status(200).json("deleted")
        })
    
})



app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})