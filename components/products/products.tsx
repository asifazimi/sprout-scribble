import { VariantsWithProduct } from "@/lib/infer-type";
type ProductTypes = {
  variants: VariantsWithProduct[];
};

const Products = ({ variants }: ProductTypes) => {
  return <div>Products</div>;
};

export default Products;
