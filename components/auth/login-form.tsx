import { AuthCard } from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      showSocials
      backButtonLabel="Create a new Account"
    >
      <div>
        <h1>hey</h1>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
