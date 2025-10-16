# TempFileDrop for Docker & Easypanel

This is a full-stack application with a React frontend and a Node.js API to temporarily host files. You can upload a binary file, and the API will return a direct link to it. The file is **reliably deleted after 1 minute**.

This project is optimized for deployment on any Docker host, with specific instructions for [Easypanel](https://easypanel.io/).

## How to Deploy to Easypanel (Using a Pre-built Docker Image)

This is the most reliable deployment method. We will build the Docker image on your local computer, push it to a public registry like Docker Hub, and then tell Easypanel to run that pre-built image. This avoids any potential issues with the build environment on your server.

### Prerequisites
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your computer.
-   A free [Docker Hub](https://hub.docker.com/) account.
-   Your Easypanel server is ready.

### Step 1: Build the Docker Image Locally
1.  Open your terminal in the project's root directory (where the `Dockerfile` is located).
2.  Run the build command. Replace `your-dockerhub-username` with your actual Docker Hub username.
    ```sh
    docker build -t your-dockerhub-username/temp-file-drop:latest .
    ```
    This command builds the image and tags it for your repository. The `.` at the end is crucial!

### Step 2: Push the Image to Docker Hub
1.  Log in to Docker Hub from your terminal:
    ```sh
    docker login
    ```
    Enter your username and password when prompted.
2.  Push the image you just built to the Docker Hub registry:
    ```sh
    docker push your-dockerhub-username/temp-file-drop:latest
    ```
    This uploads your image, making it accessible to Easypanel.

### Step 3: Deploy on Easypanel
1.  Log in to your Easypanel dashboard and open your project.
2.  Click on **"+ Service"** and select **"App"**.
3.  Under the **Source** section, select **"Docker Image"**.
4.  In the **Image Name** field, enter the name of the image you just pushed to Docker Hub (e.g., `your-dockerhub-username/temp-file-drop:latest`).
5.  Go to the **"Deploy"** tab for your new app service.
6.  Set the **Port** to `3001`. This must match the port exposed in the Dockerfile.
7.  Go to the **"Domains"** tab.
8.  Add your desired domain or subdomain (e.g., `files.yourdomain.com`) and ensure your DNS is pointing to the server's IP address.
9.  Click the **"Deploy"** button.

Easypanel will now pull your pre-built image from Docker Hub and run it. Your application will be live in a few moments!

## API Usage

You can use the deployed frontend or use the API directly.

### Upload a File

-   **Endpoint:** `/api/upload`
-   **Method:** `POST`
-   **Body:** `multipart/form-data`
-   **Field name:** `file`

#### Example using cURL

Replace `your-app-domain.com` with the actual URL from your Easypanel deployment.

```sh
curl -F "file=@/path/to/your/file.jpg" https://your-app-domain.com/api/upload
```

#### Successful Response

The API will respond with a JSON object containing the direct link to your file.

```json
{
  "message": "File uploaded successfully.",
  "url": "https://your-app-domain.com/files/xxxxxxxxxxxxxxxx.jpg",
  "expiresIn": "1 minute"
}
}
```