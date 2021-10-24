import express from 'express';
import { Portfolio, Auth } from './app/controllers';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/portfolio', Portfolio);
app.use('/auth', Auth);

console.log(`Servidor rodando na porta ${port}`);
app.listen(port);