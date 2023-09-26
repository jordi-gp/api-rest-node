const express = require('express');
const multer = require('multer');

const ArticleController = require('../controllers/ArticleController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/articles')
    },

    filename: function(req, file, cb) {
        cb(null, 'article' + Date.now() + file.originalname);
    }
});

const uploads = multer({storage: storage})

router.get('/articulos', ArticleController.getArticles);
router.post('/save-course', ArticleController.saveCourse);
router.get('/articulo/:id', ArticleController.findOneArticleById);
router.delete('/articulo/:id', ArticleController.delArticle);
router.put('/articulo/:id', ArticleController.editArticle);
router.post('/upload-image/:id', [uploads.single('file0')],ArticleController.uploadImg);

module.exports = router;
