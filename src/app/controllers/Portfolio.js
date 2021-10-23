import { Router } from "express";
import Project from "../schemas/Project";
import Slugify from "../../utils/Slugify";

const router = new Router();

router.get('/', (req, res) => {
    Project.find().then(data => {
        const projects = data.map(project => { return { title: project.title, category: project.category } })
        res.send(projects);
    }).catch(error => {
        console.error('Erro ao salvar novo projeto no banco de dados', error);
        res.status(400).send({ error: 'Não foi possível obter os dados do projeto. Tente novamente!' })
    });
});

router.get('/id/:projectId', (req, res) => {
    Project.findById(req.params.projectId).then(project => {
        res.send(project);
    }).catch(error => {
        console.error('Erro ao ao obter projeto no banco de dados', error);
        res.status(400).send({ error: 'Não foi possível obter os dados do projeto. Tente novamente!' })
    });
});

router.get('/title', (req, res) => {
    Project.findOne({ title: req.body.title }).then(project => {
        res.send(project);
    }).catch(error => {
        console.error('Erro ao obter projeto no banco de dados', error);
        res.status(400).send({ error: 'Não foi possível obter os dados do projeto. Tente novamente!' })
    });
});

router.get('/:projectSlug', (req, res) => {
    Project.findOne({ slug: req.params.projectSlug }).then(project => {
        res.send(project);
    }).catch(error => {
        console.error('Erro ao obter projeto no banco de dados', error);
        res.status(400).send({ error: 'Não foi possível obter os dados do projeto. Tente novamente!' })
    });
});

router.post('/', (req, res) => {
    const { title, slug, description, category } = req.body;
    Project.create({ title, slug, description, category })
        .then(project => {
            res.status(200).send(project);
        })
        .catch(error => {
            console.error('Erro ao salvar novo projeto no banco de dados', error);
            res.status(400).send({ error: 'Não foi possível salvar seu projeto. Verifique os dados e tente novamente' })
        });
});

router.put('/:projectId', (req, res) => {
    const { title, description, category } = req.body;
    let slug = undefined;
    if (title) {
        slug = Slugify(title);
    }
    Project.findByIdAndUpdate(req.params.projectId, { title, slug, description, category }, { new: true })
        .then(project => {
            res.status(200).send(project);
        })
        .catch(error => {
            console.error('Erro ao salvar projeto no banco de dados', error);
            res.status(400).send({ error: 'Não foi possível atuaizar seu projeto. Verifique os dados e tente novamente' })
        });
});

router.delete('/:projectId', (req, res) => {
    Project.findByIdAndRemove(req.params.projectId).then(() => {
        res.send({ message: 'Projeto removido com sucesso!' });
    }).catch(error => {
        console.error('Erro ao remover projeto do banco de dados', error);
        res.status(400).send({ message: 'Erro ao remover projeto. Tente novamente!' });
    });
});

export default router;