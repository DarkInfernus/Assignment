const fs = require("fs");
const productRepository = require("../repository/productRepository");

class StatusService {
  async getStatus(req, res) {
    const referenceId = req.query.reference_id;
    const filePath = `./uploads/${referenceId}.csv`;
    const products = await productRepository.getProductsByReferenceId(
      referenceId
    );
    products.sort((a, b) => a.serial_number - b.serial_number);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err && products.length === 0) {
        res.status(404).send("Invalid reference id");
      } else if (err) {
        res.status(200).send("CSV file has been processed successfully");
      } else {
        res
          .status(200)
          .send("CSV file is under process, check after some time");
      }
    });
  }
}

module.exports = new StatusService();
