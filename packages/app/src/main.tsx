import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App";
import theme from "./utils/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<App />
		</ChakraProvider>
	</React.StrictMode>
);
