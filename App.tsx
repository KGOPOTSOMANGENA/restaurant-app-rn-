// App.tsx
import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <RootNavigator />
    </PaperProvider>
  );
}