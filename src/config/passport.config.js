import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import User from '../models/users.model.js';
import { createHash, isValidPassword } from '../utils/utils.js';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const cookiesExtractor = (req) => {
    if (req?.headers?.authorization?.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            {
                usernameField: 'email',
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await User.findOne({ email: username });
                    if (user) {
                        console.log('El usuario ya existe');
                        return done(null, false);
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await User.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done('Error al registrar el usuario ' + error);
                }
            }
        )
    );

    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            async (username, password, done) => {
                try {
                    const user = await User.findOne({ email: username });
                    if (!user) {
                        console.log('Usuario no existe');
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Contraseña inválida');
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookiesExtractor]),
                secretOrKey: process.env.SECRET_KEY || 'sessionSecret',
            },
            async (jwt_payload, done) => {
                try {
                    const user = await User.findOne({
                        email: jwt_payload.email,
                    }).lean();
                    if (!user) return done(null, false);
                    return done(null, user); // ✅ Devuelve el usuario completo
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
