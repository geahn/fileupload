# TempFileDrop API for Vercel

This is a simple Node.js API built with Express to temporarily host files. You can upload a binary file, and the API will return a direct link to it. The file will be automatically deleted from the server after 1 minute.

This project is optimized for deployment on [Vercel](https://vercel.com).

## How to Deploy to Vercel

### Prerequisites
- A [Vercel](https://vercel.com/signup) account.
- [Vercel CLI](https://vercel.com/docs/cli) installed on your machine (optional, you can also use GitHub integration).

### Steps via GitHub

1.  **Create a new GitHub repository** and push the contents of this project (`api/index.js`, `package.json`, `vercel.json`, `index.html`, and `README.md`) to it.

2.  **Import Project on Vercel:**
    - Go to your Vercel dashboard.
    - Click "Add New... -> Project".
    - Select your new GitHub repository.
    - Vercel will automatically detect the project settings. No changes are needed.

3.  **Deploy:**
    - Click the "Deploy" button.

That's it! Vercel will build and deploy your API. You will get a production URL to use.

### Steps via Vercel CLI

1.  **Login to Vercel:**
    Open a terminal in the project's root directory and run:
    ```sh
    vercel login
    ```

2.  **Deploy:**
    Run the deploy command:
    ```sh
    vercel --prod
    ```
    Vercel will guide you through a few questions to set up the project and deploy it.

## API Usage

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
  "expiresIn": "1 minute"
}
```

You can open the `url` in your browser. This link will become invalid after 1 minute.
