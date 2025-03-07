const statusService = require("../services/statusService");

const getStatus = async (req, res) => {
  await statusService.getStatus(req, res);
};

module.exports = {
  getStatus,
};
