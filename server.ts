import dotenv from "dotenv";
dotenv.config();

import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import express from "express";
import fileUpload from "express-fileupload";
import compression from "compression";
import serveStatic from "serve-static";
import { router } from "./src/server/routes";
import { createServer as createViteServer } from "vite";
import { sequelize } from "./src/server/database";
import { errorHandlingMiddleware } from "./src/server/middleware/errorHandlingMiddleware";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const resolve = (p: string) => path.resolve(__dirname, p);

async function createServer(isProd = process.env.NODE_ENV === "production") {
  await sequelize.authenticate();
  await sequelize.sync();

  const app = express();
  app.use(express.json());
  app.use(fileUpload({}));

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info",
  });

  // use vite's connect instance as middleware
  // if you use your own express router (express.Router()), you should use router.use
  app.use(vite.middlewares);
  const requestHandler = express.static(resolve("assets"));
  app.use(requestHandler);
  app.use("/assets", requestHandler);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("/api", router);

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await fs.readFile(
        isProd ? resolve("dist/client/index.html") : resolve("index.html"),
        "utf-8"
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const productionBuildPath = path.join(
        __dirname,
        "./dist/server/entry-server.mjs"
      );
      const devBuildPath = path.join(
        __dirname,
        "./src/server/entry-server.tsx"
      );
      const { render } = await vite.ssrLoadModule(
        isProd ? productionBuildPath : devBuildPath
      );

      // 4,5 render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const html = await render(req, res, template);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      // If an error is caught, let Vite fix the stack trace, so it maps back to
      // your actual source code.
      next(e);
    }
  });

  // Error handler => Last middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandlingMiddleware(err, req, res, next);
  });

  const port = process.env.PORT || 7456;
  app
    .listen(Number(port), "0.0.0.0", () => {
      console.log(`App is listening on http://localhost:${port}`);
    })
    .on("close", sequelize.close);
}

createServer().catch(console.error);
