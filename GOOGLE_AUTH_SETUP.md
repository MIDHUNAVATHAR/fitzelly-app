# Google Authentication Setup Guide (Redirect Mode)

We have implemented **Redirect Mode** using the specific "Auth Code Flow" for security. This requires a few more steps than the default popup mode.

## 1. Google Cloud Console Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your project -> **APIs & Services > Credentials**.
3.  Edit your **OAuth 2.0 Client ID**.
4.  **Authorized JavaScript Origins**:
    *   `http://localhost:5173`
    *   Your ngrok URL (if applicable)
5.  **Authorized Redirect URIs**:
    *   `http://localhost:5173/google-callback`
    *   Your ngrok URL + `/google-callback`
    *   **IMPORTANT**: This must match exactly what is used in the app.
6.  **Save**.
7.  Copy the **Client ID** and **Client Secret**.

## 2. Environment Configuration

### Frontend (`frontend/.env`)
Ensure you have the Client ID:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### Backend (`backend/.env`)
You MUST add the Client Secret and the Redirect URI here.

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/google-callback
```
*(For production, update `GOOGLE_REDIRECT_URI` to your production domain + /google-callback)*

## 3. Restart Servers
Restart **BOTH** Frontend and Backend for changes to take effect.

## 4. Verification
1.  Click "Continue with Google" in Login or Signup.
2.  You will be redirected to Google.
3.  After login, you will be redirected back to `/google-callback`.
4.  The app will verify the code and log you in.

### ❓ FAQ: Why is the Redirect URI a Frontend URL?
You might wonder why the Redirect URI (`http://localhost:5173/google-callback`) points to the Frontend and not the Backend (`http://localhost:5000/...`).

**Reason:** In a React Single Page Application (SPA), we want the user to return to the **App UI** immediately to show a loading state or handle navigation.
1.  **Frontend** sends user to Google.
2.  Google redirects user back to **Frontend** (`/google-callback`) with a **Code**.
3.  **Frontend** sends this **Code** to the **Backend** via API.
4.  **Backend** exchanges the Code for Tokens. (Backend needs to know the original Redirect URI to verify the request with Google).

So, the Redirect URI acts as the "landing page" for the auth process, which is why it is the Frontend URL.
