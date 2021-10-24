import { Router } from "express";
import bcrypt from 'bcryptjs';
import authconfig from '../../config/auth';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from "../schemas/User";

const router = new Router();

const generateToken = params => {
    return jwt.sign(params, authconfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    User.findOne({ email }).then(userData => {
        if (userData) {
            return res.status(400).send({ error: 'Esse usuário já existe!' });
        } else {
            User.create({ name, email, password }).then(user => {
                user.password = undefined;
                return res.send({ user });
            }).catch(error => {
                console.error('Erro ao salvar usuário', error);
                return res.status(400).send({ error: 'Falha ao resgistrar usuário. Verifique os dados!' })
            })
        }
    }).catch(error => {
        console.error('Erro ao consultar usuário no banco de dados', error);
        return res.status(500).send({ error: 'Falha ao registrar usuário. Verifique os dados!' });
    })
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).select('+password')
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            const token = generateToken({ uid: user.id });
                            return res.send({ token: token, tokenExpiration: '1d' });
                        } else {
                            return res.status(400).send({ error: 'Senha inválida' });
                        }
                    }).catch(error => {
                        console.error('Erro ao verificar senha', error);
                        return res.status(500).send({ error: 'Erro interno no servidor' });
                    })
            } else {
                res.status(404).send({ error: 'Usuário não encontrado' });
            }
        }).catch(error => {
            console.error('Erro ao logar', error);
            return res.status(500).send({ error: 'Erro interno no servidor' });
        })
});

router.post('/forgot-password', (req, res) => {

});

router.post('/reset-password', (req, res) => {

});

export default router;