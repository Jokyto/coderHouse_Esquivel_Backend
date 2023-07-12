import mongoose from "mongoose"

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: {type: String, require: true},
    message: {type: String, require: true}
})

mongoose.set('strictQuery', false)

export const messageModel = mongoose.model(messageCollection, messageSchema)