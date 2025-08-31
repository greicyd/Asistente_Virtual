const db = require('../utils/baseDatos'); 

// Login controller
async function loginController(req, res) {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Faltan credenciales" });
  }

  try {
    // 1️⃣ Verificar si el correo existe
    const sqlCheckCorreo = `SELECT * FROM datos_usuarios WHERE correo = $1`;
    const { rows: usuarios } = await db.query(sqlCheckCorreo, [correo]);

    if (usuarios.length === 0) {
      return res.status(404).json({ 
        message: "No existe un usuario con estas credenciales. Contacta con tu proveedor para obtener acceso." 
      });
    }

    // 2️⃣ Verificar la contraseña
    const usuario = usuarios[0];
    if (usuario.password !== contraseña) {
      return res.status(401).json({ 
        message: "Contraseña no válida. Por favor, utiliza las credenciales proporcionadas por tu administrador." 
      });
    }

    // 3️⃣ Login exitoso: aquí deberías generar un JWT real
    return res.json({
      message: "Login exitoso",
      token: "fake-jwt-token-12345",
      usuario: { id: usuario.id, correo: usuario.correo }
    });

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { loginController };
