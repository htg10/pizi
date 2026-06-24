import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import serverlessExpress from "@codegenie/serverless-express";
import express from "express";

import { AppModule } from "./src/app.module";

let server: any;

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.setGlobalPrefix("api/v1");

  await app.init();

  return serverlessExpress({ app: expressApp });
}

export default async function handler(req: any, res: any) {
  server = server ?? (await bootstrap());
  return server(req, res);
}
