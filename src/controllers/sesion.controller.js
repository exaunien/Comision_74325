// Mostar el usuario actual logueado
export const getCurrentUser = (req, res) => {
    const { _id, email, role, cart } = req.user;

    res.status(200).json({
        message: 'Usuario autenticado',
        user: {
            id: _id,
            email,
            role,
            cart,
        },
    });
};
