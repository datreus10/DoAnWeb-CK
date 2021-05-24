import jwt from 'jsonwebtoken';

const auth = async (req,res,next) => {
    try {
        const token = req.cookies.token;   
        const userName = req.cookies.userName;
        let decodedData;
        if(userName&&!token)
        {
            req.userName=userName;
        }
        else
        {
            if (token) {
                decodedData=jwt.verify (token, 'test');
                req.userName = decodedData?.name;
                req.userID = decodedData?.id
            }
            else{
                req.userName = "";
                req.userID = "";
            }
        }
        next();
    }
    catch (error) {
        console.log(error);
    }
}

export default auth