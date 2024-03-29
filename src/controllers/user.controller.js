import { UserService } from "../services/index.js"

function formatUsers(users) {
    return users
        .filter(user => user.rol !== 'ADMIN')
        .map(user => ({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            rol: user.rol,
            documents: user.documents,
            last_connection: user.last_connection
        }));
}

export const userPremiumViewController = async(req, res) => {
    try{
        // Getting all the users
        const users = await UserService.getUsers()
        const formattedUsers = formatUsers(users)
        res.status(200).render('users', {
            title: "Users",
            users: formattedUsers,
            session: req.session,
            user: req.session.user.email
          });
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
}

export const userPremiumChangeController = async(req,res) => {
    const userID = req.params.uid;
    const currentRoll = req.session.user.rol;
    try 
    {
        if (currentRoll != "ADMIN") {
            let user = await UserService.getUserById(userID)
            await UserService.updateUserRol(userID , user.rol === 'USER' ? 'PREMIUM' : 'USER')
            user = await UserService.getUserById(userID)
            req.session.user = user
            res.status(200).json({ status: 'success', message: "The roll has been changed successfully!" });
        }else{
            res.status(404).json({ status: 'error', message: "Your role can't be changed!" });
        }
    } catch (error) 
    {
        res.status(500).json({ status: 'error', message: error.message })
    }
}


