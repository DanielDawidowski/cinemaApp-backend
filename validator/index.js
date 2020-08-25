exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'To pole jest wymagane')
        .notEmpty()
        .isLength({
            min: 4,
            max: 22
        })
        .withMessage("Nazwa użytkownika musi zawierać minimum 4 litery")
    req.check('email', 'Email musi zawierać minimum 4 litery')
        .matches(/.+\@.+\..+/)
        .withMessage('Email musi zawierać @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Hasło jest wymagane')
        .notEmpty()
    req.check('password')
        .isLength({min: 6})
        .withMessage("Hasło musi zawierać minimum 6 liter")
        .matches(/\d/)
        .withMessage("Hasło musi zawierać minimum 1 cyfrę")
    
    const errors = req.validationErrors()
    if(errors) {
        const firstError = errors.map(error => error.msg)[0]; 
        return res.status(400).json({ error: firstError })
    }
    next()
}