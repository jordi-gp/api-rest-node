const fs = require('fs');
const path = require('path');
const Article = require('../models/Article');
const { validateArticle } = require('../helpers/validate');

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
        validateArticle(params);

    } catch(error) {
        return res.status(400).json({
            status: 'Error',
            message: 'Revisa la información de los campos',
            error: error.message
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

const uploadImg = async(req, res) => {
    if(!req.file && !req.files) {
        return res.status(404).json({
            status: 'Error',
            message: 'Petición inválida'
        });
    }

    const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    let fileName = req.file.originalname;

    let fileSplit = fileName.split('\.');
    let fileExtension = fileSplit[1];

    let validFormat = validExtensions.includes(fileExtension);

    if(!validFormat) {
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: 'Error',
                message: 'Archivo inválido'
            });
        });
    } else {
        let articleId = req.params.id;
        let editedArticle = await Article.findOneAndUpdate({_id: articleId}, {image: req.file.filename}, {new: true}).exec();

        if(!editedArticle) {
            return res.status(404).json({
                status: 'Error',
                message: 'Articulo no encontrado'
            });
        }

        return res.status(200).send({
            status: 'Success',
            editedArticle,
            file: req.file
        });
    }
}

const image = (req, res) => {
    let file = req.params.file;
    let localPath = './images/articles/' + file;

    fs.stat(localPath, (error, exists) => {
        if(exists) {
            return res.sendFile(path.resolve(localPath));
        } else {
            return res.status(404).json({
                status: 'Error',
                message: 'Imagen no encontrada'
            });
        }
    })
}

const search = async(req, res) => {
    let search = req.params.name;

    const articlesFound = await Article.find({'$or': [
        {'title': {$regex: search, $options: 'i'}},
        {'content': {$regex: search, $options: 'i'}}
    ]});

    if(!articlesFound || articlesFound.length <= 0) {
        return res.status(404).json({
            status: 'Error',
            message: 'No se ha encontrado ningún articulo'
        });
    }

    return res.status(200).send({
        status: 'Success',
        message: 'La ruta funciona correctamente',
        article: articlesFound
    });
}

module.exports = {
    saveCourse,
    getArticles,
    findOneArticleById,
    delArticle,
    editArticle,
    uploadImg,
    image,
    search
}
