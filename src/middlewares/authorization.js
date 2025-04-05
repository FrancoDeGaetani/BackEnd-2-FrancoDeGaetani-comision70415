export const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: "Acceso denegado, no eres Admin" });
        }

        next();
    };
};
