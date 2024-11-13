import SignUpForm from "@/components/SignUpForm";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex h-screen justify-center items-center p-2">
      <div className="flex flex-col justify-center h-full max-h-[40rem] w-full max-w-[32rem] overflow-y-auto rounded-xl bg-card shadow-xl p-4">
        <div className="w-full">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">Sign Up</h1>
          </div>
        </div>
        <div className="h-full">
          <SignUpForm />
          <div className="flex items-center justify-center gap-x-1 mt-4">
            <p className="text-muted-foreground">Already have an account?</p>
            <Link to="/login" className="block text-center hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
