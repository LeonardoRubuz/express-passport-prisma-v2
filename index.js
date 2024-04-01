const express = require("express");
const dotenv = require("dotenv");
const passport = require('passport');
const bcrypt = require('bcrypt');
const passportLocal = require('passport-local');
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const ordinateursRouter = require("./routes/ordinateurs");
const prisma = require("./db/prisma");

// Recuperation de l'objet de la stratégie locale
const LocalStrategy = passportLocal.Strategy;


dotenv.config();
const PORT = process.env.PORT;
const server = express();
server.use(express.json());

// Configuration de passport : il attends deux arguments qui sont 
// les champs d'authentification et le callback de vérification
passport.use(new LocalStrategy({ usernameField : "email", passwordField : "password" }, async (email, password, done) => {
  // Vérifier d'abord que l'utilisateur existe
  try {
    const user = await prisma.user.findFirst({
      where : {
        email
      }
    });

    if (!user) {  // Si l'utilisateur n'est pas trouvé on renvoie le vide
      return done(null, false)
    }

    bcrypt.compare(password, user.password, (err, isMatch) => { // S'il existe on compare le mot de passe
      if (err) {
        return done(null, false, err)
      }
      if (!isMatch) {
        return done(null, false, { message : 'Mot de passe incorrect' })
      }
      return done(null, user)  // On renvoie l'objet user si aucune erreur n'est rencontrée
    })
  } catch (error) {
    return res.status(500)
  }
}))


// Extraire  l'id du user et l'injecter dans request
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Extraire l'entité et l'injecter dans request
passport.deserializeUser((user, done) => {
  done(null, user)
})

server.use(passport.initialize)


server.get("/", (req, res) => {
  res.send("DEV WEB C3");
});
server.use('/auth')
server.use("/users", usersRouter);
server.use("/ordinateurs", ordinateursRouter);

server.listen(PORT, () => console.log(`Le serveur est lancé sur ${PORT}`));
