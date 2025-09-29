import LoginButton from "./LoginButton";

const LoginScreen = ({ loading, login }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1>Choose an album for me</h1>
      <LoginButton onLogin={login} loading={loading} />
    </div>
  );
};

export default LoginScreen;
