import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const Products = async () => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  return <div>Products</div>;
};

export default Products;
