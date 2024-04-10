import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT} = process.env

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT || 4000, () => {
            console.log(`Database connection successful`)
        })
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    })