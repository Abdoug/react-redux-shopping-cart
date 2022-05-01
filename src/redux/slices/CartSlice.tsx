import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkout } from "../../app/api";
import { AppDispatch, RootState } from "../store";

type CheckoutState = 'LOADING' | 'ERROR' | 'READY';

export interface CartState {
    items: { 
        [productID: string]: number
    },
    checkoutState: CheckoutState,
    errorMessage: string
}

const initialState: CartState = {
    items: {},
    checkoutState: 'READY',
    errorMessage: ''
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart (state: CartState, action: PayloadAction<string>) {
            const productId = action.payload;

            if (state.items[productId]) {
                state.items[productId]++;
            } else {
                state.items[productId] = 1;
            }
        },
        removeFromCart (state: CartState, action: PayloadAction<string>) {
            const productId = action.payload;

            if (state.items[productId] > 1) {
                state.items[productId]--;
            } else {
                delete state.items[productId];
            }
        },
        updateCart (state: RootState, action: PayloadAction<{ id: string, qty: number }>) {
            const { id, qty } = action.payload;

            state.items[id] = qty;
        }
    },
    extraReducers: function(builder) {
        builder.addCase(checkoutCart.pending, (state) => {
            state.checkoutState = 'LOADING';
        });
        builder.addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{ success: boolean }>) => {
            const { success } = action.payload; 
            
            if (success) {
                state.checkoutState = 'READY';
                state.items = {};
            } else {
                state.checkoutState = 'ERROR';
            }
        });
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.checkoutState = 'ERROR';
            state.errorMessage = action.error?.message || '';
        });
    }
})

export const checkoutCart = createAsyncThunk('cart/checkout', async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const items = state.cart.items;
    const response = await checkout(items);

    return response;
})

// Begin Selectors
// With re-rendering
// export const getNumItems = (state: RootState) => {
//     let numItems = 0;

//     for (let itemId in state.cart.items) {
//         numItems += state.cart.items[itemId];
//     }

//     return numItems;
// }

// Without re-rendering
export const getMemoizedNumItems = createSelector(
    (state: RootState) => state.cart.items,
    (items) => {
        let numItems = 0;
        
        for (let itemId in items) {
            numItems += items[itemId];
        }

        return numItems;
    }
)

export const getTotalPrice = createSelector(
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.products,
    (items, products) => {
        let total = 0;

        for (let itemId in items) {
            total += items[itemId] * products[itemId].price
        }

        return total.toFixed(2);
    }
)
// End Selectors

export const { addToCart, removeFromCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;