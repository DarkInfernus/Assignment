class Product {
  constructor(serialNumber, productName, inputImageUrl, outputImageUrl) {
    this.serialNumber = serialNumber;
    this.productName = productName;
    this.inputImageUrl = inputImageUrl;
    this.outputImageUrl = outputImageUrl;
    this.status = "pending";
  }
}
