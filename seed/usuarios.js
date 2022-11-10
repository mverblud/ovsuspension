import bcrypt from 'bcryptjs';

const usuarios = [
    {
        nombre: 'Marcos Verblud',
        email: 'marcosverblud@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10),
        rol: 'ADMIN_ROLE',
        telefono : '3515645850',
        confirmado : true,
        token : null
    },
]

export default usuarios;