const models = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    let options = {
      include: [
        {
          model: models.User, // ✅ Gunakan models.User
          as: "user",         // ✅ Sesuai dengan as: 'user' di Presensi.belongsTo
          attributes: ["nama","role"],
        },
      ],
    };

    if (nama) {
      options.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`,
        },
      };
    }

    const records = await models.Presensi.findAll(options); // ✅ models.Presensi

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      data: records,
    });
  } catch (error) {
    console.error("Error di getDailyReport:", error); // ✅ Lihat error di terminal
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};