const nodemailer= require('nodemailer')

function sendmail(mailaddress, title, content)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shopnamuit@gmail.com',
            pass: '1a2b3cDe'
        }
    });
    var mailOptions ={
        from: 'shopnamuit@gmail.com',
        to: mailaddress,
        subject: title,
        html: content
    };
    transporter.sendMail(mailOptions, function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log('Email đã được gửi đến người dùng');
        }
    });
}


module.exports = {sendmail}