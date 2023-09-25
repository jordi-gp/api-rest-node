const validator = require('validator');
const Article = require('../models/Article');

const getArticles = async(req, res) => {
    try {
        let articlesQuery = Article.find({}).sort({date: -1});
        
        let articles = await articlesQuery.exec();

        if(articles.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'No se han encontrado articulos'
            });
        }

        return res.status(200).send({
            status: 'Success',
            articles
        })
    } catch(error) {
        return res.status(500).json({
            status: 'Error',
            message: 'No se han podido obtener los articulos',
        });
    }
}

const findOneArticleById = async(req, res) => {
    try {
        let id = req.params.id;

        let articleQuery = Article.findById(id);
        let article = await articleQuery.exec();

        if(article.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'No se ha encontrado el articulo' 
            });
        }

        return res.status(200).send({
            status: 'Success',
            article
        });
    
    } catch(error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Articulo no encontrado'
        });
    }
}

const saveCourse = (req, res) => {
    let params = req.body;

    try {
        let validatedTitle = !validator.isEmpty(params.title);
        let validatedContend = !validator.isEmpty(params.content);

        if(!validatedTitle || !validatedContend) {
            throw new Error('No se puede dejar ningún campo vacío');
        }

    } catch(error) {
        return res.status(400).json({
            status: 'Error',
            message: 'Revisa la información de los campos'
        });
    }

    const article = new Article(params);

    article.save()
    .then((savedArticle) => {
        return res.status(200).json({
            status: 'Success',
            message: savedArticle
        })
    })
    .catch((error) => {
        return res.status(400).json({
            status: 'Error',
            message: 'Error al crear el articulo'
        })
    })
}

const editArticle = async(req, res) => {
    try {
        let articleId = req.params.id;
        let params = req.body;
                
        if(!params.title && !params.content) {
            return res.status(400).json({
                status: 'Error',
                message: 'No se pueden dejar todos los campos vacíos'
            });
        }

        let editedArticle = await Article.findOneAndUpdate({_id: articleId}, params, {new: true}).exec();

        if(!editedArticle) {
            return res.status(404).json({
                status: 'Error',
                message: 'Articulo no encontrado'
            });
        }

        return res.status(200).send({
            status: 'Success',
            editedArticle
        });
        
    } catch(error) {
        return res.status(500).json({
            status: 'Error',
            message: 'No se ha podido actualizar el articulo'
        });
    }
}

const delArticle = async(req, res) => {
    let id = req.params.id;

    if(!id) {
        return res.status(400).json({
            status: 'Error',
            message: 'ID requerido en la URL'
        });
    }
    
    try {
        let delArticleQuery = Article.findOneAndDelete({_id: id});
        let delArticle = await delArticleQuery.exec();

        return res.status(200).send({
            status: 'Success',
            message: 'Articulo eliminado con éxito',
            delArticle
        });

    } catch(error) {
        return res.status(400).json({
            status: 'Error',
            message: 'Error al borrar el articulo indicado',
        });
    }
}

module.exports = {
    saveCourse,
    getArticles,
    findOneArticleById,
    delArticle,
    editArticle
}
