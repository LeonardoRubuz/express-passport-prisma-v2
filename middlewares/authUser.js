const passport = require('passport')
const authUser = (req, res, next) => {
    // Utiliser la méthode d'authentification
    passport.authenticate(
        "local", (err, user) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(401).json({
                    message : "Veuiller revoir vos identifiants",
                })
            }
            res.status(200)
            // Vérifier si l'utilisateur
        }
    )(req, res, next)
}


module.exports = authUser;
