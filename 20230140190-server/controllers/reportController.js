const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    const options = { where: {} };

    // 🔹 Filter nama (opsional)
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // 🔹 Filter tanggal
    if (tanggalMulai && tanggalSelesai) {
      const mulai = new Date(tanggalMulai);
      const selesai = new Date(tanggalSelesai);
      selesai.setHours(23, 59, 59, 999); // supaya ambil sampai jam 23:59

      options.where.createdAt = {
        [Op.between]: [mulai, selesai],
      };
    } else if (tanggalMulai && !tanggalSelesai) {
      const mulai = new Date(tanggalMulai);
      const selesai = new Date(tanggalMulai);
      selesai.setHours(23, 59, 59, 999);

      options.where.createdAt = {
        [Op.between]: [mulai, selesai],
      };
    }

    // 🔹 Ambil data dari database
    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      data: records,
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
