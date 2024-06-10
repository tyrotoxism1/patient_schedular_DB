import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
//Theme from https://github.com/OneLightWebDev/react-table-tutorial/blob/starting-files/src/theme/styles.js
import theme from "./theme/theme.js";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);