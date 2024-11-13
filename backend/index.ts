// import express from "express";
// import "dotenv/config";
// // import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import errorMiddleware from "./middlewares/error";
// import adminRoutes from "./routes/admin";
// import userRoutes from "./routes/employee";
// import path from "path";

// const app = express();

// mongoose
//   .connect(process.env.DATABASE_URL as string)
//   .then((c) => {
//     console.log(`MongoDB connected with HOST: ${c.connection.host}`);
//   })
//   .catch((err) => console.log("MongoDB connection error", err));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [process.env.CLIENT_URL, process.env.MOBILE_APP_URL];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// // app.set("trust proxy", 1);

// app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/online-student", onlineStudentRoutes);

// app.use(errorMiddleware);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
// });

// const port = process.env.PORT || 8000;

// const server = app.listen(port, () => {
//   console.log(
//     `Server is running on PORT: ${port} in ${process.env.NODE_ENV} mode.`
//   );
// });

// process.on("unhandledRejection", (err: any) => {
//   console.log(`ERROR: ${err.message}`);
//   console.log("Shutting down the server due to Unhandled Promise rejection");
//   server.close(() => {
//     process.exit(1);
//   });
// });
import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import employeeTypeDef from "./schema/typeDefs/employee.typeDef";
import employeeResolver from "./schema/resolvers/employee.resolver";
import mongoose from "mongoose";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./lib/passport.config";

configurePassport();

const app = express();

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then((c) => {
    console.log(`MongoDB connected with HOST: ${c.connection.host}`);

    // create mongodb store
    const MongoDBStore = connectMongo(session);
    const store = new MongoDBStore({
      uri: process.env.DATABASE_URL as string,
      collection: "sessions",
    });

    store.on("error", function (error) {
      console.log("MongoDB session store error", error);
    });

    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        },
      })
    );
    //
    app.use(passport.initialize());
    app.use(passport.session());
    //
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
      typeDefs: employeeTypeDef,
      resolvers: employeeResolver,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      // context: ({ req, res }) => buildContext({ req, res, User })
    });

    server
      .start()
      .then(async () => {
        app.use(
          "/",

          cors<cors.CorsRequest>({
            // origin: process.env.CLIENT_URL,
            origin: "http://localhost:5173",
            credentials: true,
          }),

          express.json(),

          expressMiddleware(server, {
            context: async ({ req, res }) => buildContext({ req, res }),
            // context: async ({ req }) => ({ token: req.headers.token }),
          })
        );

        await new Promise<void>((resolve) =>
          httpServer.listen({ port: 4000 }, resolve)
        );

        console.log(`🚀 Server ready at http://localhost:4000/`);
      })
      .catch((error) => {
        console.log("Apollo server error", error);
      });
  })
  .catch((err) => console.log("MongoDB connection error", err));
