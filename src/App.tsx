import { ChakraProvider, theme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./reduxStore/store";

import { Routes } from "./Routes";

export const App = () => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <Routes />
    </ChakraProvider>
  </Provider>
);
