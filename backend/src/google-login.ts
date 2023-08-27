/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import cors from "cors";
import url from "url";
import axios from "axios";
import querystring from "querystring";

const app = express();
app.use(express.json());
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

const PORT = config.PORT;

app.get("/googlelogin", (_req, res) => {
  const googleAuthEndpoint = `https://accounts.google.com/o/oauth2/v2/auth`;
  const authQSParams = {
    client_id: config.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: "http://localhost:3001/oauthresponse",
    response_type: "code",
    scope: "https://www.googleapis.com/auth/classroom.courses.readonly",
    access_type: "offline",
    state: "", // can help w/ directing user to correct resource or security
    include_granted_scopes: "", // for incremental authorization
    prompt: "select_account",
  };

  const result = url.format({
    pathname: googleAuthEndpoint,
    query: authQSParams,
  });

  res.redirect(result);
});

app.get("/oauthresponse", async (req, res) => {
  if (!("code" in req.query) || !req.query.code) {
    return res.send("No authorization code granted");
  }

  const googleTokenEndpoint = `https://oauth2.googleapis.com/token`;
  const tokenQSParams = {
    client_id: config.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: config.GOOGLE_OAUTH_CLIENT_SECRET,
    code: req.query.code as string,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:3001/oauthresponse",
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const result = await axios.post(
    googleTokenEndpoint,
    querystring.stringify(tokenQSParams)
  );

  console.log(result);
  // TODO: store this token in a DB somewhere, and return some sort of json webtoken that I use to see whether a user was signed in.
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
