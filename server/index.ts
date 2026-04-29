"use server";

export async function getProductById(id: number) {
  const res = await fetch(`https://dummyjson.com/products/${id}`).then((res) =>
    res.json(),
  );

  console.log("server: ", { res });
  return res;
}
