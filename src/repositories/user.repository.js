export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => await this.dao.getUsers()
    getUserById = async (id) => await this.dao.getUserById(id)
    updateUserRol = async (id,rol) => await this.dao.updateUserRol(id,rol)
}