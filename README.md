# TempFileDrop API

This is a simple Node.js API built with Express to temporarily host files. You can upload a binary file, and the API will return a direct link to it. The file will be automatically deleted from the server after 1 minute.

The entire application is designed to be run within a Docker container.

## How to Run

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine.

### Steps

1.  **Save Files:**
    Save all the provided files (`server.js`, `package.json`, `Dockerfile`, `.dockerignore`, `README.md`) into a new directory on your local machine.

2.  **Build the Docker image:**
    Open a terminal in the directory containing the files and run:
    ```sh
    docker build -t temp-file-api .
    ```

3.  **Run the Docker container:**
    After the image is built, run the container:
    ```sh
    docker run -p 3000:3000 -d --name temp-file-container temp-file-api
    ```
    - `-p 3000:3000`: Maps port 3000 on your host machine to port 3000 in the container.
    - `-d`: Runs the container in detached mode (in the background).
    - `--name temp-file-container`: Gives the container a memorable name.

The API will now be running at `http://localhost:3000`.

## API Usage

### Upload a File

-   **Endpoint:** `/upload`
-   **Method:** `POST`
-   **Body:** `multipart/form-data`
-   **Field name:** `file`

#### Example using cURL

```sh
curl -F "file=@/path/to/your/file.jpg" http://localhost:3000/upload
```
*Replace `/path/to/your/file.jpg` with the actual path to the file you want to upload.*

#### Successful Response

The API will respond with a JSON object containing the direct link to your file.

```json
{
  "message": "File uploaded successfully.",
  "url": "http://localhost:3000/files/xxxxxxxxxxxxxxxx.jpg",
  "expiresIn": "1 minute"
}
```

You can open the `url` in your browser to view or download the file. This link will become invalid after 1 minute when the file is deleted from the server.