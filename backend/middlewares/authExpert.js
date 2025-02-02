import jwt from 'jsonwebtoken'

//doctor authentication middleware
const authExpert=(req,res,next)=>{
    try{
        const {dtoken}=req.headers;
        if(!dtoken){
            return res.json({success:false,message:"Access denied"})
        }
        const token_decode=jwt.verify(dtoken,process.env.JWT_SECRET)
         req.body.docId=token_decode.id
        next()
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export default authExpert