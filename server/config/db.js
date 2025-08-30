import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect(process.env.MONGODB_URL);
    mongoose.connection.on("connected", () => {
        console.log("Database Connected");
    })
}

export default connectDB;