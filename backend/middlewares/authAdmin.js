import jwt from 'jsonwebtoken'

//admin authentication middleware
const authAdmin=(req,res,next)=>{
    try{
        const{atoken}=req.headers;
        if(!atoken){
            return res.json({success:false,message:"Access denied"})
        }
        const toke_decode=jwt.verify(atoken,process.env.JWT_SECRET)
        if(toke_decode!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Access Denied"})
        }
        
        next()
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export default authAdmin