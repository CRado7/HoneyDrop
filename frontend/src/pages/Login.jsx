import LoginForm from "./Landing/components/LoginForm";
import Hero from "./Landing/components/Hero";

export default function Login() {
  return (
    <>
      <Hero />
      <div className="container d-flex justify-content-center align-items-center p-5">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

