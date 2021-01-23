/**
 * JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. 
 * 
 */

const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, name };
        jwt.sign( 
            payload, 
            process.env.SECRET_JWT_SEED, 
            { expiresIn:'2h' }, 
            (err, token) => {

                if( err ) {
                    console.log(err);
                    reject('Error generando el token con la firma');
                }

                resolve(token);
            } 
        );
    } );

}

module.exports = {
    generarJWT,
}