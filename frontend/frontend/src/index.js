import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TraceProvider } from "./contexts/TraceContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { PredictionProvider } from "./contexts/PredictionContext";
import { HighlightProvider } from "./contexts/HighlightContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TraceProvider>
      <NavigationProvider>
        <PredictionProvider>
          <HighlightProvider>
            <App />
          </HighlightProvider>
        </PredictionProvider>
      </NavigationProvider>
    </TraceProvider>
  </React.StrictMode>
);
