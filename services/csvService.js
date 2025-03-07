const fs = require("fs");
const productRepository = require("../repository/productRepository");

class csvService {
  async getCsv(req, res) {
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
        const csvContent = products
          .map((product) => {
            return `${product.serial_number},${product.product_name},${product.input_image_url},${product.output_image_url}`;
          })
          .join("\n");
        const csvHeader =
          "S. No.,Product Name,Input Image Urls,Output Image Urls\n";
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${referenceId}.csv"`
        );
        res.status(200).send(csvHeader + csvContent);
      } else {
        res
          .status(200)
          .send("CSV file is under process, check after some time");
      }
    });
  }
}

module.exports = new csvService();
