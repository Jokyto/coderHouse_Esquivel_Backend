import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import chatRouter from "./routers/chat.router.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
app.use(express.json());

// WebSocket
try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database.");
} catch (err) {
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

  app.get("/", (req, res) => res.render("index"));
  app.get("/health", (req, res) => res.send("Ok"));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/products", viewsRouter);
  app.use("/chat",chatRouter)

  io.on('connection', () =>{
      console.log('Successfully connected with server!')
  })
