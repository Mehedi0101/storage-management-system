const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: error.issues?.[0]?.message || "Invalid request data",
            });
        }

        next(error);
    }
};

module.exports = validate;