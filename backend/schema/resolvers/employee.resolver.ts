import bcrypt from "bcryptjs";
import Employee from "../../models/employee";

const employeeResolver = {
  Mutation: {
    signUp: async (parent, args, context, info) => {
      try {
        const { name, email, password, age, gender } = args.data;
        if (!name || !email || !password || !age || !gender) {
          throw new Error("All fields are required");
        }
        const userExists = await Employee.findOne({ email });

        if (userExists) {
          throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({
          name,
          email,
          password: hashedPassword,
          age,
          gender,
        });

        const employee = await newEmployee.save();

        return employee;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },

    login: async (parent, args, context, info) => {
      try {
        const { email, password } = args.data;
        if (!email || !password) throw new Error("All fields are required");

        const { user } = await context.authenticate("graphql-local", {
          email,
          password,
        });
        await context.login(user);
        return user;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },

    logout: async (parent, args, context, info) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) {
            console.log("ERROR:", err);
            throw new Error(err.message || "Something went wrong");
          }
        });
        context.res.clearCookie("connect.sid");
        return true;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },
  },

  Query: {
    authenticatedEmployee: async (parent, args, context, info) => {
      try {
        const employee = await context.getUser();
        return employee;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },
    employees: async (parent, args, context, info) => {
      const { limit = 20, offset = 0 } = args;
      try {
        const employees = await Employee.find().skip(offset).limit(limit);
        return employees;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },
    employee: async (parent, args, context, info) => {
      try {
        const employee = await Employee.findById(args.id);
        return employee;
      } catch (error: any) {
        console.log("ERROR:", error);
        throw new Error(error.message || "Something went wrong");
      }
    },
  },
};

export default employeeResolver;
