const bcrypt = require("bcrypt");
const prisma = require("../db/prisma");


const registerUser = async (req, res) => {
  try {
    const passportEncrypted = bcrypt.hashSync(req.body.password, 10)
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: passportEncrypted,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  registerUser
};
