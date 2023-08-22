import dotenv from "dotenv";
dotenv.config();

export default{
    defaultPort: process.env.PORT,
    uri: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACKURL
}