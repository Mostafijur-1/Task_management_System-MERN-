import "./App.css";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <>
      <AuthForm type="login" />
      <AuthForm type="register" />
    </>
  );
}

export default App;
