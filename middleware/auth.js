const jwt = require('jsonwebtoken');

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
                req.userID = decodedData?.id;
                req.userRole = decodeData?.role;
                req.user=decodedData;
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
module.exports = {auth}