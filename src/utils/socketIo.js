import logger from "./logger.js";

// Socket connections
export default (io) => {
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
      });
};