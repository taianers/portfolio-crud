import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const tokenData = authHeader.split(' ');
        if (tokenData.length != 2) {
            return res.status(401).send({ error: 'Nenhum token válido fornecido!' })
        }

        const [scheme, token] = tokenData;
        if (scheme.indexOf('Bearer') < 0) {
            return res.status(401).send({ error: 'Nenhum token válido fornecido!' })
        }

        jwt.verify(token, authConfig.secret, (error, decoded) => {
            if (error) {
                return res.status(401).send({ error: 'Nenhum token válido fornecido!' })
            } else {
                req.uid = decoded.uid;
                return next();
            }
        })
    } else {
        return res.status(401).send({ error: 'Nenhum token válido fornecido!' })
    }
}