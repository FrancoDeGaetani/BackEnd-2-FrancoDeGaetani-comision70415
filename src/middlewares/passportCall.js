import passport from "passport";

export const passportCall = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {

      if (err) return res.status(500).json({ error: "Error en autenticación", details: err });
      if (!user) return res.status(401).json({ error: "No autorizado" });

      req.user = user;
      next();
  })(req, res, next);
};

