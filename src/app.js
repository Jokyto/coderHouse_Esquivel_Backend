import express from "express";
import session from 'express-session'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import chatRouter from "./routers/chat.router.js"
import inCartRouter from "./routers/inCart.router.js"
import registerRouter from "./routers/register.router.js"
import loginRouter from "./routers/login.router.js"
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
app.use(express.json());

//Session
app.use(session({
  store: MongoStore.create({
      mongoUrl: uri,
      dbName: 'ecommerce',
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      }
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))


// WebSocket
try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database.");
} 
catch (err) {
    console.log(err.message);
}
  const serverHttp = app.listen(8080, () => console.log("Server up"));
  const io = new Server(serverHttp);

  app.set("socketio", io);
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Handlebars
  app.use(express.static("./src/public"));
  app.engine("handlebars", handlebars.engine());
  app.set("views", "./src/views");
  app.set("view engine", "handlebars");

  const error = [{ error: "El elemento que quiere acceder no existe!" }];

  // Router

  app.get("/", (req, res) => res.render("login"));
  app.get("/health", (req, res) => res.send("Ok"));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/products", viewsRouter);
  app.use("/chat",chatRouter)
  app.use("/carts", inCartRouter)
  app.use("/register", registerRouter)
  app.use("/login", loginRouter)

  io.on('connection', (socket) =>{
      console.log('Successfully connected with server!')

      socket.on("message", async (data) => {
        try {
          const newMessage = await messageModel.create(data);
          const formattedMessage = {
            _id: newMessage._id,
            message: newMessage.message,
            user: newMessage.user,
          };
          io.emit("message", formattedMessage); // Emit the message to all connected clients
        } catch (error) {
          console.error(error);
        }
      });
      
      // socket.on("products", async(data) =>{
      //   try{
      //     io.emit("products", data )
      //   }catch(error){
      //     console.error(error)
      //   }
      // })
  })
