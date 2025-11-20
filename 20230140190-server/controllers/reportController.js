const { Op } = require("sequelize");
const { Presensi, User } = require("../models");

exports.getDailyReport = async (req, res) => {
  try {
    let where = {};
    if (req.query.nama) {
      const user = await User.findOne({
        where: { nama: { [Op.like]: `%${req.query.nama}%` } }
      });
      if (user) {
        where.userId = user.id;
      }
    }

    const records = await Presensi.findAll({
      where,
      include: [{
        model: User,
        attributes: ['nama']
      }],
      order: [['checkIn', 'DESC']]
    });

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
