import { redirect } from "next/navigation";

const Dashboard = () => {
  redirect("/dashboard/settings");

  return <div>Dashboard</div>;
};

export default Dashboard;
