require("dotenv").config();
const { Pool } = require("pg");
const productService = require("../services/productService");
const deleteService = require("../services/deleteService");
const path = require("path");
const { get } = require("http");
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  table: process.env.TABLE_NAME,
  database: process.env.DATABASE,
});
async function addProducts(products, fpath) {
  const client = await pool.connect();
  const fileName = path.basename(fpath);
  new Promise(async (resolve) => {
    for (const product of products) {
      const { serialNumber, productName, inputImageUrl, outputImageUrl } =
        product;
      try {
        const inputImageUrlString = inputImageUrl.join(",");
        const outputImageUrlString = outputImageUrl.join(",");
        await client.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (
            reference_id TEXT,
            serial_number INT,
            product_name TEXT,
            input_image_url TEXT,
            output_image_url TEXT
          )
        `);
        await client.query(
          `INSERT INTO ${process.env.TABLE_NAME} (reference_id, serial_number, product_name, input_image_url, output_image_url) VALUES ($1, $2, $3, $4,$5)`,
          [
            fileName,
            serialNumber,
            productName,
            inputImageUrlString,
            outputImageUrlString,
          ]
        );
      } catch (e) {
        console.log(e);
        console.error(
          `Failed to insert ${process.env.TABLE_NAME} ${productName}: ${e.message}`
        );
      }
    }
    resolve();
  }).then(async () => {
    await deleteService.deleteFile(fpath);
  });
  client.release();
}
async function getProductsByReferenceId(referenceId) {
  const client = await pool.connect();
  try {
    const tableExists = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${process.env.TABLE_NAME}')`
    );
    if (!tableExists.rows[0].exists) {
      console.error(`Table '${process.env.TABLE_NAME}' does not exist.`);
      return [];
    }
    const res = await client.query(
      `SELECT * FROM ${process.env.TABLE_NAME} WHERE reference_id = $1`,
      [referenceId + ".csv"]
    );
    return res.rows;
  } catch (e) {
    console.log(e);
    console.error(
      `Failed to get products with reference_id ${referenceId}: ${e.message}`
    );
    return [];
  } finally {
    client.release();
  }
}
module.exports = {
  addProducts,
  getProductsByReferenceId,
};
