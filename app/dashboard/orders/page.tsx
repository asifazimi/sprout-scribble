import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const Orders = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <div>Orders</div>;
};

export default Orders;
