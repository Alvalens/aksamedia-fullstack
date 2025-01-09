import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Form from "./Form";

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate("/dashboard");
  }
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden bg-gray-100 lg:block dark:bg-gray-800">
        <img
          src="https://picsum.photos/1920/1080?random=1"
          alt="Login Illustration"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
        />
      </div>
      <div className="flex items-center justify-center p-6 lg:p-10 dark:bg-gray-700 dark:text-white">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your email and password to sign in.</p>
          </div>
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Login;
