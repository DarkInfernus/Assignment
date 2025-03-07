# Project Setup Guide

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** version: v22.14.0
- **PostgreSQL** version: 16.1
- **Git**
- **Postman**

## Installation and Setup

Follow these steps to set up and run the project:

1. **Create a Database**

   - Open PostgreSQL and create a database named **`products`** (ensure the name matches exactly).

2. **Clone the Repository**

   - Run the following command in your terminal:
     ```sh
     git clone https://github.com/DarkInfernus/Assignment.git
     ```

3. **Install Dependencies**

   - Navigate to the cloned repository:
     ```sh
     cd Assignment
     ```
   - Install the required Node.js dependencies:
     ```sh
     npm install
     ```

4. **Set Up Environment Variables**

   - Rename `.env.example` to `.env`
   - Open `.env` and update the following variables:
     ```sh
     DATABASE_USER=<your_postgres_username>
     DATABASE_PASSWORD=<your_postgres_password>
     ```

5. **Start the Server**

   - Run the following command in the terminal:
     ```sh
     node app.js
     ```
   - The server should now be running.

## API Testing with Postman

Use the following Postman collection for API testing:
[Postman Collection](https://documenter.getpostman.com/view/23287311/2sAYdoE6uD)

### API Endpoints

1. **Upload CSV (`UploadCsv` request)**

   - Send a CSV file in the request body.
   - If the CSV file is correctly formatted, you will receive a `reference_id`. Keep this ID for future requests.

2. **Check CSV Status (`GetStatus` request)**

   - Use the `reference_id` to check the processing status of the CSV file.

3. **Get Processed CSV (`GetCsv` request)**

   - Use the `reference_id` to retrieve the processed CSV file.

4. **Retrieve Compressed Image**

   - Once you obtain the output CSV file, use any image URL from the file to test if the compressed image is accessible via a GET request.

## Notes

- Ensure your PostgreSQL server is running before starting the application.
- Double-check environment variables for proper database connection.
- If any issues arise, refer to Postman responses for debugging hints.

Happy Coding! 🚀
