const checkRole = (allowedRoles) =>{
    return (req,res,next)=>{
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if(!req.userInfo || !roles.includes(req.userInfo.role) ){
        return res.status(403).json({error:true,message:"Access Denied: Unauthorized role"});
    }
    next();

    }
}

module.exports = {checkRole}
