import React from "react";
import ReactDom from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from "./App";

const queryClient = new QueryClient();

ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
)
