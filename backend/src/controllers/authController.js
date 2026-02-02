import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../models/userModel.js';

const JWT_SECRET = 'segredo_temporario';

export async function register(req, res) {
    const { name, email, password } = req.body;

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        isAdmin: false
    };

    users.push(newUser);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
}
