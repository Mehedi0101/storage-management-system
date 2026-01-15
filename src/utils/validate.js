const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.errors[0].message,
        });
    }
};

module.exports = validate;