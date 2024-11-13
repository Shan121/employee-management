import passport from "passport";
import bcrypt from "bcryptjs";

import { GraphQLLocalStrategy } from "graphql-passport";
import Employee from "../models/employee";

export const configurePassport = async () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Employee.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
          throw new Error("Invalid email or password");
        }
        const validPassword = bcrypt.compare(
          password as string,
          employee.password
        );

        if (!validPassword) {
          throw new Error("Invalid email or password");
        }

        return done(null, employee);
      } catch (err) {
        return done(err);
      }
    })
  );
};
