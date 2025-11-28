const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// controllers/authController.js
exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    // Validasi role
    if (role && !['mahasiswa', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role hanya boleh 'mahasiswa' atau 'admin'." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'mahasiswa' // default ke 'mahasiswa'
    });

    res.status(201).json({ message: "Registrasi berhasil", data: newUser });
  } catch (error) {
    // ... error handling
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: "Login berhasil",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

