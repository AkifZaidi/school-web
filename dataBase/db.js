const mongoose = require('mongoose');


function connectToBD(){
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log("Connected to the database!");
    }).catch((error) => {
        console.log("DataBase Crashed!");
        console.error(error);
    });
}

module.exports = connectToBD;