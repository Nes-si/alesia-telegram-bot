let express = require('express');
let packageInfo = require('./package.json');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ version: packageInfo.version });
});

let server = app.listen(process.env.PORT, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
});

module.exports = function (bot) {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};