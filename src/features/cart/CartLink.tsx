import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { getMemoizedNumItems } from "../../redux/slices/CartSlice";
import styles from "./CartLink.module.css";

export function CartLink() {
  const cartItems = useAppSelector(getMemoizedNumItems);

  return (
    <Link to="/cart" className={styles.link}>
      <span className={styles.text}>🛒&nbsp;&nbsp;
        {
          cartItems ? cartItems : 'Cart'
        }
      </span>
    </Link>
  );
}
