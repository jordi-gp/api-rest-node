const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

//Rutas de prueba

router.get('/articulos', ArticleController.getArticles);
router.post('/save-course', ArticleController.saveCourse);
router.get('/articulo/:id', ArticleController.findOneArticleById);
router.delete('/articulo/:id', ArticleController.delArticle);
router.put('/articulo/:id', ArticleController.editArticle);

module.exports = router;
