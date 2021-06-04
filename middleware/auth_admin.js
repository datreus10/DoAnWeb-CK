const jwt = require('jsonwebtoken');

const auth_admin = async (req,res,next) => {
    try {
        const token = req.cookies.token;   
        let decodedData;
        if(token)
        {
                decodedData=jwt.verify (token, 'test');
                req.userName = decodedData?.name;
                req.userID = decodedData?.id
                req.userRole= decodedData?.role
                if(req.userRole=='admin')
                {
                    next();
                }
                else
                {
                    res.redirect('/');
                }
            }
            else
            {
                res.redirect('/');
            }
        }

    catch (error) {
        console.log(error);
    }
}

module.exports = {auth_admin}