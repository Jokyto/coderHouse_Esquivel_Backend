import { UserService } from "../services/index.js"

export const userPremiumChangeController = async(req,res) => {
    const userID = req.params.uid;
    try 
    {
        let user = await UserService.getUserById(userID)
        await UserService.updateUserRol(userID , user.rol === 'USER' ? 'PREMIUM' : 'USER')
        user = await UserService.getUserById(userID)
        req.session.user = user

        res.status(200).redirect('/products');
    } catch (error) 
    {
        res.status(500).json({ status: 'error', message: error.message })
    }
}
