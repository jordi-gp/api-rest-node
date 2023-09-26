const validator = require('validator');

const validateArticle = (params) => {
    let validatedTitle = !validator.isEmpty(params.title);
    let validatedContend = !validator.isEmpty(params.content);

    if(!validatedTitle || !validatedContend) {
        throw new Error('No se puede dejar ningún campo vacío');
    }
}

module.exports = {
    validateArticle
}