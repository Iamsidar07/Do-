import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
const config = {
  clientId: import.meta.env.VITE_KINDE_CLIENT_ID as string,
  domain: import.meta.env.VITE_KINDE_DOMAIN as string,
  redirectUrl: import.meta.env.VITE_KINDE_REDIRECT_URL as string,
  logoutUrl: import.meta.env.VITE_KINDE_LOGOUT_URL as string,
};

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <KindeProvider
    clientId={config.clientId}
    domain={config.domain}
    redirectUri={config.redirectUrl}
    logoutUri={config.logoutUrl}
  >
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </QueryClientProvider>
  </KindeProvider>,
);
