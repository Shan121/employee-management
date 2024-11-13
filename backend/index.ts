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
import path from "path";

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
    });

    server
      .start()
      .then(async () => {
        app.use(
          "/",

          cors<cors.CorsRequest>({
            origin: process.env.CLIENT_URL,
            credentials: true,
          }),

          express.json(),

          expressMiddleware(server, {
            context: async ({ req, res }) => buildContext({ req, res }),
          })
        );

        app.use(express.static(path.join(__dirname, "../../frontend/dist")));
        app.get("*", (req, res) => {
          res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
        });

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
