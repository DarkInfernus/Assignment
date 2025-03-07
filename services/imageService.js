const path = require("path");
const fs = require("fs");

const imageService = {
  getImage: async (req, res) => {
    const file_name = req.query.file_name;
    const filePath = path.join(
      __dirname,
      "..",
      "uploaded_images",
      "compressed_images",
      file_name
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(404).send("Image not found");
      }
      res.setHeader("Content-Type", "image/jpeg");
      res.send(data);
    });
  },
};
module.exports = imageService;
