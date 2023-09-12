import UserDTO from "../dto/user.dto";

// Authentication
export const auth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect('/api/session/login');
  }
};

// Register

export const registerViewController = async (req, res) => {
    res.status(200).render("registro");
}

export const registerPassportController = async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Usuario registrado con exito!'
    });
}

export const registerFailController = (req, res) => {
    res.redirect('api/session/register')
}

// Login

export const loginViewController = async(req,res)=>{
    res.status(200).render("login")
}

export const loginPassportController = async (req, res) => {

    req.session.user = req.user
    res.status(200).json({ status: 'success', message: 'Login successful'})
  
}

export const loginOutController =  (req, res) => {
  
    req.session.destroy(err => 
    {
      if (err) 
      {
        return res.status(500).send('Error occurred');
      } 
      else 
      {
        return res.redirect('/api/session/login');
      }
    });
}

export const loginFailController = (req, res) =>{
    res.send({error: 'Fallo al iniciar sección.'})
} 

// Github Login

export const githubLoginController = async(req,res) =>{
}

export const githubCallbackController = async(req,res) => {
    // console.log('Callback: ',req.user)
    req.session.user = req.user
    // console.log('User session: ', req.session.user)
    res.redirect('/products')
}

//Current view

export const currentViewController = (req, res) =>{
  const user = new UserDTO(req.user.user)
  res.render('/current', {user})
}
