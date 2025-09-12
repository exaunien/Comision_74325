import passport from 'passport';

export const authJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno en autenticación',
                details: err.message,
            });
        }

        if (!user) {
            return res.status(401).json({
                error: 'Acceso denegado',
                reason: info?.message || 'Token inválido o expirado',
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};
