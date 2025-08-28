import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const Analytics = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  return <div>Analytics</div>;
};

export default Analytics;
