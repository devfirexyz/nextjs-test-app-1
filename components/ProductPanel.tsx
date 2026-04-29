"use client";

import { useEffect } from "react";
import ProductItem from "./ProductItem";
import { getProductById } from "@/server";

export default function ProductPanel({ products }) {
  let intervalId: ReturnType<typeof setInterval>;
  useEffect(() => {
    intervalId = setInterval(async () => {
      //call the products api

      const res = await getProductById(1);

      console.log({ a: res });
    }, 1000);
  }, []);
  return (
    <div className="p-4 mt-4">
      <h3>Live product update</h3>

      {products.map((product) => (
        <ProductItem productItem={product} key={product.id} />
      ))}
    </div>
  );
}
