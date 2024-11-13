import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, LoginValues } from "@/schemas/validation.schema";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { LOG_IN } from "@/graphql/mutations/employee.mutation";
import { useEffect } from "react";
import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";

const LogInForm = () => {
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOG_IN);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    const userData = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await login({
        variables: {
          input: userData,
        },
      });
      console.log("SUCCESS:", response);
      toast.success("Logged In");
      navigate("/");
    } catch (error) {
      console.log("ERROR LOGIN:", error);
      toast.error("Something went wrong");
    }
  }

  const { loading: userLoading, data } = useQuery(GET_AUTHENTICATED_EMPLOYEE);

  useEffect(() => {
    if (userLoading === false && data?.authenticatedEmployee) {
      navigate("/", { replace: true });
    }
  }, [userLoading, data, navigate]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </Form>

      <div className="flex justify-center mt-5">
        <p>
          <Link
            to="/signup"
            className={`text-blue-500 hover:underline rtl:font-semibold ${
              loading ? "cursor-not-allowed" : ""
            }`}
            aria-disabled={loading}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LogInForm;
