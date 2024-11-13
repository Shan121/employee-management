import LogInForm from "@/components/LogInForm";

const LogIn = () => {
  return (
    <div className="flex h-screen justify-center items-center p-4">
      <div className="flex flex-col justify-center h-full max-h-[40rem] w-full max-w-[32rem] overflow-hidden rounded-xl bg-card shadow-xl p-8">
        <div className="w-full space-y-4 overflow-y-auto">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">Log In</h1>
          </div>
        </div>
        <div className="space-y-4">
          <LogInForm />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
