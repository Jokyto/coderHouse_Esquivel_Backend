import dotenv from "dotenv";
dotenv.config();

export default{
    defaultPort: process.env.PORT,
    uri: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACKURL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    adminRoll: process.env.ADMIN_ROLL,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_pass: process.env.NODEMAILER_PASS
}