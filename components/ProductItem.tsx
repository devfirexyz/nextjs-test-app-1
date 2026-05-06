type ProductItemProps = Readonly<{
  productItem: {
    brand?: string;
    description: string;
  };
}>;

export default function ProductItem({ productItem }: ProductItemProps) {
  return (
    <div className="m-4 bg-gray-500 text-white p-4 rounded-2xl">
      <h4>{productItem.brand}</h4>
      <p>{productItem.description}</p>
    </div>
  );
}
