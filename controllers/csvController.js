const csvService = require("../services/csvService");

const getCsv = async (req, res) => {
  await csvService.getCsv(req, res);
};

module.exports = {
  getCsv,
};
