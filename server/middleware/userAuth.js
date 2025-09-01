import { decode, jwt } from "jsonwebtoken";

const userAuth = async(req,res,next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.json({success: false,message: "Unauthorized , Please login."});
    }

    try{
        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);

        if(decodedToken.id) {
            req.body.userId = decodedToken.id
        }else {
            return res.json({success: false,message: "Unauthorized , Please login."});
        }

        next();

    }catch(error) {
        res.json({success: false,message: error.message});
    }

}

export default userAuth;