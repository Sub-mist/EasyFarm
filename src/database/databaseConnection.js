import mongoose from "mongoose";

mongoose
    .connect(`mongodb://localhost:27017/${process.env.DB_NAME}`)
    .then(() => console.log("Connected to MongoDB successfully.\n\n\n"))
    .catch((error) => console.log(error));
