// App.tsx
// --- Polyfill for Array.prototype.findLast ---
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function<T>(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any
  ): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i], i, this)) return this[i];
    }
    return undefined;
  };
}

import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { CartProvider } from "./src/store/CartContext";

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </PaperProvider>
  );
}