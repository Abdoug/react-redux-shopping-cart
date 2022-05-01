import { configureStore } from "@reduxjs/toolkit";
import { CartReducer, ProductsReducer } from "./slices";

export const store = configureStore({
    reducer: {
        cart: CartReducer,
        products: ProductsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;