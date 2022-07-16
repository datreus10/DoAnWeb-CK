const getquery = async (req,res,next) => {
    try {
        const getquery = req.cookies.query;   
        if (getquery) {
                req.getquery=getquery
            }
        else{
            req.getquery="";        
            }
        next();
    }
    catch (error) {
        console.log(error);
    }
}
module.exports = {getquery}