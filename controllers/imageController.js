const imageService = require("../services/imageService");
const imageController = async function (req, res) {
  imageService.getImage(req, res);
};
module.exports = imageController;
