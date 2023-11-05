// Express
import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";

// Socket io
import { Server } from "socket.io";
import SocketIO from "./utils/socketIo.js";

// Routers
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import chatRouter from "./routers/chat.router.js";
import sessionRouter from "./routers/session.router.js";
import logsRouter from "./routers/logs.router.js";

//mockServer
import mocksService from "./routers/mock.router.js";

// mongoDb
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// Passport
import passport from "passport";

// Configuration files
import intializePassport from "./config/passport.config.js";
import { defaultPort, uri, secret } from "./utils/variables.js";

// Command
import { Command } from "commander";

//Compression settings
import compression from "express-compression";

//Error handling
import errorHandler from "./middlewares/error.middleware.js";

//Winston
import logger from "./utils/logger.js";

// Express
const app = express();
app.use(express.json());
app.use(errorHandler);
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

//Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: secret,
    resave: true,
    saveUninitialized: true,
  })
);

/* In order to accept request outside server domain
app.use((req,res,next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})
Or install cors library
app.use(cors()) */

//Passport
intializePassport();
app.use(passport.initialize());
app.use(passport.session());

// WebSocket
try {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("Connected to database.");
} catch (err) {
  logger.error(err.message);
}

// Command for port definition in inline terminal
const program = new Command();
program.option("-p <port>", "Server port!", defaultPort);
program.parse();
const port = program.opts().p;
const serverHttp = app.listen(port, () =>
  logger.info(`Server up on port ${port}`)
);

// Socket IO
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
app.use("/chat", chatRouter);
app.use("/api/session", sessionRouter);
app.use("/mockingproducts", mocksService);
app.use("/loggerTest", logsRouter);

// Using socket io
SocketIO(io);