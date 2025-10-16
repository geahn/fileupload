# TempFileDrop API for Vercel

This is a full-stack application with a React frontend and a Node.js API to temporarily host files. You can upload a binary file, and the API will return a direct link to it. 

This project is optimized for deployment on [Vercel](https://vercel.com).

## Important Note on File Deletion

Due to the stateless and short-lived nature of Vercel's serverless functions, **automatic file deletion after exactly 1 minute is not guaranteed.**

The backend uses the temporary `/tmp` directory for storage. While files in this directory are not permanent, they are only cleared when Vercel's platform recycles the function instance. A `setTimeout` call to delete the file will not work reliably as the function instance will likely be shut down before the timer completes. The file will be available for a short period, but will eventually become inaccessible. For a simple temporary host, this behavior is often acceptable.

## How to Deploy to Vercel

### Prerequisites
- A [Vercel](https://vercel.com/signup) account.
- [Vercel CLI](https://vercel.com/docs/cli) installed on your machine (optional, you can also use GitHub integration).

### Steps via GitHub

1.  **Create a new GitHub repository** and push all project files to it.

2.  **Import Project on Vercel:**
    - Go to your Vercel dashboard.
    - Click "Add New... -> Project".
    - Select your new GitHub repository.
    - Vercel should automatically detect the project as a "Vite" (or similar frontend) project. This is correct. It will handle the frontend and the `api` directory automatically.

3.  **Deploy:**
    - Click the "Deploy" button.

That's it! Vercel will build and deploy your full-stack application. You will get a production URL to use.

## API Usage

You can use the deployed frontend or use the API directly.

### Upload a File

-   **Endpoint:** `/upload`
-   **Method:** `POST`
-   **Body:** `multipart/form-data`
-   **Field name:** `file`

#### Example using cURL

Replace `your-deployment-url.vercel.app` with the actual URL from your Vercel deployment.

```sh
curl -F "file=@/path/to/your/file.jpg" https://your-deployment-url.vercel.app/upload
```

#### Successful Response

The API will respond with a JSON object containing the direct link to your file.

```json
{
  "message": "File uploaded successfully.",
  "url": "https://your-deployment-url.vercel.app/files/xxxxxxxxxxxxxxxx.jpg",
  "expiresIn": "approximately 1 minute (best-effort)"
}
```

You can open the `url` in your browser. This link will become invalid when the serverless instance is recycled.