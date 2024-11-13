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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signupSchema, SignupValues } from "@/schemas/validation.schema";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { SIGN_UP } from "@/graphql/mutations/employee.mutation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState("male");

  const [signup, { loading }] = useMutation(SIGN_UP, {
    onCompleted: (data) => {
      console.log("DATA:", data);
    },
  });

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: 0,
    },
  });

  async function onSubmit(values: SignupValues) {
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
      age: values.age,
      gender: gender,
    };

    try {
      const response = await signup({
        variables: {
          input: userData,
        },
      });
      console.log("SUCCESS:", response);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.log("ERROR SIGNUP:", error);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
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
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input placeholder="Age" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full md:w-1/2">
          <FormLabel className="flex flex-col w-1/2 mb-2">
            <div>Gender</div>
            {!gender && <FormMessage>Required</FormMessage>}
          </FormLabel>
          <div className="w-full flex">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between gap-x-2 flex-grow"
                >
                  {" "}
                  <span>
                    {gender.at(0)?.toUpperCase() + gender.slice(1)}
                  </span>{" "}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuRadioGroup
                  value={gender}
                  onValueChange={setGender}
                >
                  <DropdownMenuRadioItem value="male">
                    Male
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="female">
                    Female
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button disabled={loading} type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
