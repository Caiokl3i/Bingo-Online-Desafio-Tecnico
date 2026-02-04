import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findByEmail, findAll } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function register(req, res) {
  const { name, email, password } = req.body;

  const userExists = await findByEmail(email);
  if (userExists) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.email === ADMIN_EMAIL
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.email === ADMIN_EMAIL
    }
  });
}

export async function getAllUsers(req, res) {
  const users = await findAll();
  res.json(users);
}