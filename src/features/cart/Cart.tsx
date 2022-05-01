import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkoutCart, getTotalPrice, removeFromCart, updateCart } from "../../redux/slices/CartSlice";
import classNames from "classnames";
import styles from "./Cart.module.css";

export function Cart() {
  const products = useAppSelector(state => state.products.products);
  const items = useAppSelector(state => state.cart.items);
  const getTotal = useAppSelector(getTotalPrice);
  const dispatch = useAppDispatch();
  const checkoutState = useAppSelector(state => state.cart.checkoutState);
  const errorMessage = useAppSelector(state => state.cart.errorMessage);

  function onQtyChange (e: React.FocusEvent<HTMLInputElement>, id: string) {
    const qty = Number(e.target.value) || 0;

    dispatch(updateCart({id, qty}));
  }

  function onCheckoutSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(checkoutCart());
  }

  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === 'ERROR',
    [styles.checkoutLoading]: checkoutState === 'LOADING',
  })

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.entries(items).map(([id, qty], index) => {
              return (
                <tr key={index}>
                  <td>{products[id].name}</td>
                  <td>
                    <input type="text" className={styles.input} defaultValue={qty} onBlur={(e) => onQtyChange(e, id)} />
                  </td>
                  <td>{products[id].price}</td>
                  <td>
                    <button onClick={() => dispatch(removeFromCart(id))} aria-label="Remove Magnifying Glass from Shopping Cart">
                      X
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${getTotal}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckoutSubmit}>
        {
          checkoutState === 'ERROR' && errorMessage && <p className={styles.errorBox}>{errorMessage}</p>
        }
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
