# Google Authentication Setup Guide (Backend Redirect Mode)

We have implemented the **Traditional Backend Redirect Mode**. This means the user is redirected to the Backend to initiate login, and Google redirects back to the Backend.

## 1. Google Cloud Console Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your project -> **APIs & Services > Credentials**.
3.  Edit your **OAuth 2.0 Client ID**.
4.  **Authorized JavaScript Origins**:
    *   `http://localhost:5173`
    *   `http://localhost:5000`
    *   Your ngrok URL (if applicable)
5.  **Authorized Redirect URIs**:
    *   **Localhost**: `http://localhost:5000/api/v1/gym-auth/auth/google/callback`
    *   **Ngrok**: `https://xxxx.ngrok-free.app/api/v1/gym-auth/auth/google/callback`
    *   **IMPORTANT**: This allows Google to send the code to your Backend.
6.  **Save**.
7.  Copy the **Client ID** and **Client Secret**.

## 2. Environment Configuration

### Backend (`backend/.env`)
Set the Redirect URI to match the Backend URL (not Frontend).

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/gym-auth/auth/google/callback
```
*(If using ngrok, update `GOOGLE_REDIRECT_URI` to the ngrok URL)*
*(Also ensure `FRONTEND_URL` is set if you use it for redirection, e.g. `FRONTEND_URL=http://localhost:5173`)*

### Frontend (`frontend/.env`)
Ensure `VITE_API_URL` points to your backend.
```env
VITE_API_URL=http://localhost:5000
```
*(Or your ngrok URL)*

## 3. Restart Servers
Restart **BOTH** Frontend and Backend for changes to take effect.

## 4. Verification
1.  Click "Continue with Google".
2.  Browser redirects to Backend -> Google.
3.  Login on Google.
4.  Browser redirects to Backend (`/callback`) -> Frontend (`/gym/dashboard`).
5.  You are logged in via Cookies.
