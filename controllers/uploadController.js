const fs = require("fs");
const csv = require("csv-parser");
const validator = require("validator");
const multer = require("multer");
const path = require("path");
const productService = require("../services/productService");
const deleteService = require("../services/deleteService");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const uploadController = {
  upload,
  uploadCsv: async (req, res) => {
    if (!req.file || req.file.mimetype !== "text/csv") {
      await deleteService.deleteFile(req.file.path);
      return res.status(400).send("Please upload a CSV file.");
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const headers = Object.keys(results[0]);
        if (
          headers.length !== 3 ||
          headers[0] !== "S. No." ||
          headers[1] !== "Product Name" ||
          headers[2] !== "Input Image Urls"
        ) {
          await deleteService.deleteFile(req.file.path);
          return res
            .status(400)
            .send(
              "CSV file must have exactly three columns: S. No., Product Name, Input Image Urls."
            );
        }
        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          const serialNumber = Number(row["S. No."]);
          const imageUrl = row["Input Image Urls"].split(",");
          if (
            !Number.isInteger(serialNumber) ||
            serialNumber <= 0 ||
            row["S. No."].includes(".")
          ) {
            await deleteService.deleteFile(req.file.path);
            return res.status(400).send("S. No. must be a positive integer.");
          }
          if (serialNumber !== i + 1) {
            await deleteService.deleteFile(req.file.path);
            return res
              .status(400)
              .send(
                "S. No. must start from 1 and increment by 1 in each subsequent row."
              );
          }
          for (let j = 0; j < imageUrl.length; j++) {
            if (!validator.isURL(imageUrl[j].trim())) {
              await deleteService.deleteFile(req.file.path);
              return res
                .status(400)
                .send("Input Image Urls must be legitimate URLs.");
            }
          }
        }
        res
          .status(200)
          .send(
            `CSV file upload initiated with reference id: ${
              req.file.filename.split(".")[0]
            }`
          );
        await productService.downloadImages(
          req.file.filename.split(".")[0],
          results,
          req.file.path
        );
      });
  },
};

module.exports = uploadController;
