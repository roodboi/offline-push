const express = require('express')
const bodyParser = require('body-parser');
const webPush = require('web-push');
const _ = require('lodash')
const app = express()

// these subscriptions would be set on
// a user in the db - notifications for that user
// would get sent using that subscription
const subscriptions = []

app.use(bodyParser.json());
webPush.setGCMAPIKey('AIzaSyCV18xhRnPeCRrswdiQCsoK10GCXamLR3s')
webPush.setVapidDetails(
  'mailto:dimitrikennedy@gmail.com',
  'BMKJVS0IzUBTyOUgEDD_AHFseovd7oA4AqyJYfFJTI0d2hBzBsNQY4ptUSG3LLU_PCXXS5lFbUDY0nMGvIDuGrw',
  '1cAi0RmoNp_VP5z3452lHBbMP0xPcF8P4shSHieTWgk'
);

function sendNotification(subscription, message) {

  const payload = message

  webPush.sendNotification(subscription, payload).then(function() {
    console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
  }).catch(function(error) {
    console.log(error)
    subscriptions = _.reject(subscriptions, subscription)
  });
}

function isSubscribed(subscription) {
  return _.filter(subscriptions, subscription).length
}

app.use(function forceSSL(req, res, next) {
  var host = req.get('Host');
  var localhost = 'localhost';

  if (host.substring(0, localhost.length) !== localhost) {
    // https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security
    res.header('Strict-Transport-Security', 'max-age=15768000');
    // https://github.com/rangle/force-ssl-heroku/blob/master/force-ssl-heroku.js
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + host + req.url);
    }
  }
  return next();
});

app.use(function corsify(req, res, next) {
  // http://enable-cors.org/server_expressjs.html
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

app.use(function setServiceWorkerHeader(req, res, next) {
  // https://github.com/mozilla/serviceworker-cookbook/issues/201
  var file = req.url.split('/').pop();
  if (file === 'service-worker.js' || file === 'worker.js') {
    res.header('Cache-control', 'public, max-age=0');
  }
  next();
});

app.post('/register', function(req, res) {
  console.log(req.body)

  var subscription = req.body.subscription

  if (!isSubscribed(subscription)) {

    console.log('Subscription registered ' + subscription.endpoint);
    subscriptions.push(subscription);

  }
  res.type('js').send('{"success":true}');
});


app.post('/unregister', function(req, res) {
  var subscription = req.body;
  if (isSubscribed(subscription)) {
    console.log('Subscription unregistered ' + subscription.endpoint);
    subscriptions = _.reject(subscriptions, subscription)
  }
  res.type('js').send('{"success":true}');
});


app.get('/send-all', function (req, res) {
  const message = req.query.message || 'default message'
  res.send(`<h1 style="margin: 30% 0; text-align: center;">SENDING ALL SUBSCRIBERS A MESSAGE: ${ message }</h1>`)
  subscriptions.forEach(function(subscription){ sendNotification(subscription, message) })
})

// setInterval(function() {
//   subscriptions.forEach(sendNotification);
// }, 5000);

app.use(express.static('./'))
app.listen(7001, function () {
  console.log('Example app listening on port 3000!')
})