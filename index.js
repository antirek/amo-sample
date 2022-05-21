const url = require('url');
const qs = require('querystring');
const express = require('express');
const axios = require('axios');
const jwt_decode = require('jwt-decode');
const _ = require('lodash');
const path = require('path');

const client_id = '7a52e13e-9f60-4b0d-acff-cd6110bc6cb1';
const redirect_uri = 'https://5862-93-159-240-241.eu.ngrok.io/';
const client_secret = 'zaFqdaw9IJfJzYSlC04pXkWGu2JK7kVgM1GokyEzbFMcKQnaDNGzDZ1SRbIbtdsV';

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.get('/', async (req, res) => {
  console.log('req.query', req.query)
  if (_.isEmpty(req.query)) {
    console.log('no req.query');
    res.render('button', {client_id});
  } else {
    res.send('OK');
  }

  //console.log(req, res);
  const myUrl = url.parse(req.originalUrl);

  console.log('url', myUrl);
  const params = qs.parse(myUrl.query);

  console.log('qs', params);


  const domain = params.referer;

  if (!domain) { return; }
  const code = params.code;

  const urlDomain = `https://${domain}/oauth2/access_token`;
  const data =  {
    client_id,
    client_secret,
    grant_type:	'authorization_code',
    code,
    redirect_uri,
  };
  console.log('data', urlDomain, data);

  const resp = (await axios.post(urlDomain, data)).data;

  const access_token = resp.access_token;
  const refresh_token = resp.refresh_token;

  console.log('resp', {access_token, refresh_token});
  var decoded = jwt_decode(access_token);
  console.log('decoded', decoded);

});

app.listen(8000, () => {
  console.log(`Example app listening at http://localhost:8000`)
})
