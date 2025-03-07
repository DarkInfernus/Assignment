const fs = require("fs");
const deleteFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file ${filePath}: ${error.message}`);
  }
};
module.exports = { deleteFile };
