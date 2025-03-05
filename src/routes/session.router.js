import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { isValidPassword } from "../utilities/util.js"; 
import passport from "passport";

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const newCart = await CartModel.create({ products: [] });
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        const newUser = await UserModel.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password,
            cart: newCart._id 
        });

        await newUser.save();
        
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
            "coderhouse", // 
            { expiresIn: "1h" }
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

router.get("/current", passport.authenticate("current", { session: false }), async (req, res) => {
    try {
        console.log("Payload del token:", req.user); 

        const user = await UserModel.findById(req.user.id).lean(); 

        if (!user) return res.status(404).send("Usuario no encontrado");

        console.log("Usuario encontrado:", user);
        res.render("profile", { usuario: user.first_name });

    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).send("Error en el servidor");
    }
});


export default router;
