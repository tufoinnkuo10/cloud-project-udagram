import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {Request, Response } from 'express';
import {isWebUri} from 'valid-url';
(async () => {
  // Init the Express application
  const app = express();
  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url: string = req.query.image_url;
    /* Validate URL */
    if(!image_url || !isWebUri(image_url)) {
      return res.status(400).send({ error: 'image url not valid' });
    }
    /* Filter image */
    await filterImageFromURL(image_url).then(
      (filtered_path: string) => {
        res.status(200).sendFile(filtered_path, () => {
          deleteLocalFiles([filtered_path])
        });
    }).catch((error: string) => {
      return res.status(400).send({ error: `${error}` });
    });
  }
);
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();