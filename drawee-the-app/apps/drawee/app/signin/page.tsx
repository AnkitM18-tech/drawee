import AuthPage from "@/components/AuthPage";

export default function Signin() {
  return (
    <AuthPage
      title="Sign In"
      subtitle="Welcome back to Drawee. Sign In to get started!"
      isSignup={false}
    />
  );
}
