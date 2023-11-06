import bcrypt from "bcrypt";
import dotenv from "dotenv";
import winston from "winston";
import config from "./config/config.js";

//Variables de entorno

export const defaultPort = config.defaultPort;
export const uri = config.uri;
export const secret = config.secret;

//Hashear contraseña

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
dotenv.config();

// Generate random token
export const generateRandomToken = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() * 36);
        return randomNum.toString(36);
    })
        .join('')
        .toUpperCase();
}

// Winston

const colours = {
  debug: "white",
  http: "green",
  info: "blue",
  warning: "yellow",
  error: "orange",
  fatal: "red",
};
winston.addColors(colours);
const createLogger = (env) => {
  if (env == "PRO") {
    return winston.createLogger({
      levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
      },
      transports: [
        new winston.transports.File({
          filename: "./logs/serverLogs.log",
          level: "info",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
      },
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};
export const logger = createLogger(process.env.ENVIRONMENT);

// Socket connections
export const socketIO = (io) => {
  io.on("connection", (socket) => {
    logger.info("Successfully connected with server!");

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
        logger.error(error);
      }
    });

    // socket.on("products", async(data) =>{
    //   try{
    //     io.emit("products", data )
    //   }catch(error){
    //     console.error(error)
    //   }
    // })
  });
};
