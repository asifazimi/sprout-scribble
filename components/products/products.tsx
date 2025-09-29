import { VariantsWithProduct } from "@/lib/infer-type";
import Link from "next/link";
import Image from "next/image";
import formatPrice from "@/lib/format-price";
import { Badge } from "../ui/badge";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

const Products = ({ variants }: ProductTypes) => {
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-7 lg:grid-cols-4">
      {variants.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <div className="bg-[#F7F7F7] rounded-md flex items-center justify-center group overflow-hidden">
            <Image
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-140"
              src={variant.variantImages[0].url}
              width={260}
              height={260}
              alt={variant.product.title}
              loading="lazy"
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default Products;
