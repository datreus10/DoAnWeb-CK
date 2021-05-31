import jwt from 'jsonwebtoken';

const auth_admin = async (req,res,next) => {
    try {
        const token = req.cookies.token;   
        let decodedData;
        if(token)
        {
                decodedData=jwt.verify (token, 'test');
                req.userName = decodedData?.name;
                req.userID = decodedData?.id
                if(req.userID=='608e6f4b259982493478e0d3')
                {
                    next();
                }
                else
                {
                    res.redirect('/');
                }
            }
        }
    catch (error) {
        console.log(error);
    }
}

export default auth_admin