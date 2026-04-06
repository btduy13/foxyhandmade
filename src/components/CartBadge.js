"use client";
import { useCart } from "@/context/CartContext";

export default function CartBadge() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <span style={{
      position: "absolute",
      top: "-8px",
      right: "-10px",
      background: "var(--brand-red)",
      color: "white",
      fontSize: "11px",
      fontWeight: "700",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}
