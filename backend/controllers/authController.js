const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Faltan datos' });

  try {
    const hash = await bcrypt.hash(password, 10);

    await executeQuery(
      `INSERT INTO Users (email, password_hash, role)
       VALUES (@email, @password, @role)`,
      {
        email,
        password: hash,
        role: 'usuario'
      }
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    if (err.message.includes('duplicate'))
      return res.status(409).json({ message: 'El correo ya está registrado' });

    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await executeQuery(
      'SELECT * FROM Users WHERE email = @email',
      { email }
    );

    if (result.recordset.length === 0)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en login' });
  }
};
