# TempFileDrop for Docker & Easypanel

This is a full-stack application with a React frontend and a Node.js API to temporarily host files. You can upload a binary file, and the API will return a direct link to it. The file is **reliably deleted after 1 minute**.

This project is optimized for deployment on any Docker host, with specific instructions for [Easypanel](https://easypanel.io/).

## How to Deploy to Easypanel

### Prerequisites
- A server with Easypanel installed.
- A GitHub account and a new repository for this project.

### Step-by-Step Guide

#### 1. Push to GitHub
- Create a new, empty repository on your GitHub account.
- Add, commit, and push all the files from this project to that repository.

#### 2. Create a New Project in Easypanel
- Log in to your Easypanel dashboard.
- Create a **New Project** or select an existing one.

#### 3. Add an "App" Service
- Inside your project, click on **"+ Service"** and select **"App"**.

#### 4. Configure the Source
- Under the **Source** section, select **"Git"**.
- Connect your GitHub account and choose the repository you just created.
- Select the branch you want to deploy (e.g., `main`).
- For the **Build Pack**, select **"Dockerfile"**. Easypanel will automatically find and use the `Dockerfile` in your repository.

#### 5. Configure Port & Domain
- Go to the **"Deploy"** tab for your new app service.
- Set the **Port** to `3001`. This is the port the application exposes inside the container.
- Go to the **"Domains"** tab.
- Add your desired domain or subdomain (e.g., `files.yourdomain.com`) and make sure your DNS is pointing to the server's IP address.

#### 6. Deploy!
- Click the **"Deploy"** button.
- Easypanel will now pull your code from GitHub, build the Docker image using the `Dockerfile`, and start the container.
- You can view the build and application logs directly in the Easypanel interface.

Once the deployment is complete, your TempFileDrop application will be live at the domain you configured!

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