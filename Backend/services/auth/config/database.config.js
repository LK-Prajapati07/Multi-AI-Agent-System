import mongoose from "mongoose"

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.db)
        console.log("Database connection Successfully")
    } catch (error) {
        console.log(error.message + "Database connection Failed to connect")
    }
}
export default connectDB