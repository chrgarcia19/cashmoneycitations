const https = require('https');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


const options = {
    key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert")
}

app.prepare().then(() => {
    https.createServer(options, (req, res) => {
        handle(req, res);
      })
      .listen(443);
});


