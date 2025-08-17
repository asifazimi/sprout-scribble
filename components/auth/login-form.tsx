import { AuthCard } from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      showSocials
      backButtonLabel="Create a new Account"
    >
      <div></div>
    </AuthCard>
  );
};

export default LoginForm;
