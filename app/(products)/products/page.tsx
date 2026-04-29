import ProductItem from "@/components/ProductItem";
import ProductPanel from "@/components/ProductPanel";

async function getProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=10").then(
    (res) => res.json(),
  );

  //   console.log({ res });
  return res;
}

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      <ProductPanel products={products} />
    </div>
  );
}
