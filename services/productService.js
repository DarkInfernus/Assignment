const fs = require("fs");
const sharp = require("sharp");
const deleteService = require("./deleteService");
const path = require("path");
const axios = require("axios");
const productRepository = require("../repository/productRepository");
async function compressImage(inputPath, outputPath, quality = 50) {
  try {
    // Read image metadata to determine the format
    const metadata = await sharp(inputPath).metadata();
    const format = metadata.format; // Get the image format

    console.log(`Processing ${inputPath} (Format: ${format})`);

    // Define the compression settings based on format
    let transformer = sharp(inputPath);
    switch (format) {
      case "jpeg":
      case "jpg":
        transformer = transformer.jpeg({ quality });
        break;
      case "png":
        transformer = transformer.png({ quality, compressionLevel: 9 });
        break;
      case "webp":
        transformer = transformer.webp({ quality });
        break;
      case "gif":
        transformer = transformer.gif({ colors: 128 }); // Reduce colors to optimize GIFs
        break;
      case "tiff":
        transformer = transformer.tiff({ quality });
        break;
      case "avif":
        transformer = transformer.avif({ quality });
        break;
      default:
        console.warn(`Unsupported format: ${format}`);
        return;
    }

    // Save compressed image
    await transformer.toFile(outputPath);
    console.log(`Compressed image saved to: ${outputPath}`);
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
const downloadImage = async (url, filepath) => {
  try {
    const response = await axios({
      url,
      responseType: "stream",
    });
    await new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filepath))
        .on("finish", resolve)
        .on("error", reject);
    });

    await compressImage(
      filepath,
      "./uploaded_images/compressed_images/" + path.basename(filepath)
    );
    deleteService.deleteFile(filepath);
  } catch (error) {
    console.error(
      `Error downloading or processing image from ${url}: ${error.message}`
    );
    throw error;
  }
};

const downloadImages = async (csv_file_name, products, fpath) => {
  const uploadDir = "./uploaded_images";
  const result = [];
  let outputUrl = [];
  let filepath;
  for (const product of products) {
    const imageUrls = product["Input Image Urls"].split(", ");
    for (const [index, url] of imageUrls.entries()) {
      const filename = `${csv_file_name}_${product["Product Name"]}_${index}.jpg`;
      filepath = path.join(uploadDir, filename);
      try {
        await downloadImage(url, filepath);
        outputUrl.push(`localhost:3000/images?file_name=${filename}`);
      } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
        outputUrl.push("Unable to get image from corresponding input URL");
      }
    }
    result.push({
      serialNumber: product["S. No."],
      productName: product["Product Name"],
      inputImageUrl: imageUrls,
      outputImageUrl: outputUrl,
    });
    outputUrl = [];
  }

  await productRepository.addProducts(result, fpath);
};

const productService = {
  downloadImages,
};
module.exports = productService;
