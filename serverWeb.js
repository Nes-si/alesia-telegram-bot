let express = require('express');
let packageInfo = require('./package.json');

let app = express();

app.get('/', (req, res) => {
  res.json({ version: packageInfo.version });
});

let server = app.listen(process.env.PORT, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
});