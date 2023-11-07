import { userModel } from "./models/user.model.js";

export default class CartDAO {
    getUsers = async () => await userModel.find();
    getUserById = async (id) => await userModel.findOne({ '_id': id });
    updateUserRol = async (id, rol) => await userModel.findOneAndUpdate({ '_id': id },{ $set: { rol: rol } });
}