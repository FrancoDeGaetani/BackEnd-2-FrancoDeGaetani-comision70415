import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
import CartModel from '../dao/models/cart.model.js';
import { isValidPassword } from "../utilities/util.js"; 

import { UserDTO } from "../dto/user.dto.js";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const newCart = await CartModel.create({ products: [] });
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart: newCart._id,
            role: role || 'user'
        });

        res.status(201).json({ message: 'Usuario registrado con éxito' });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || !isValidPassword(password, user)) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.cookie("CookieToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Lax"
        });

        res.json({ message: "Login exitoso", token });

    } catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
});

router.get("/current", passportCall("jwt"), (req, res) => {
    
    if (!req.user) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});


export default router;
