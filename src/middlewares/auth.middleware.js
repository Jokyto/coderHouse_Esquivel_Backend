export const handlePolicies = allowedRoles => (req, res, next) => {
    const user = req.user || { role: "PUBLIC" }; 

    if (user && user.role && !allowedRoles.includes(user.role.toUpperCase())) {
        return res.status(403).json({
            status: "error",
            error: "Your role has no permission to do this action",
        });
    }
    
    return next();
};