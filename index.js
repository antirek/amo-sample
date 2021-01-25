const url = require('url');
const qs = require('querystring');
const express = require('express');
const axios = require('axios');
const jwt_decode = require('jwt-decode');
const _ = require('lodash');
const path = require('path');

const client_id = 'c5e9efbe-33a8-48ec-9879-53000b074542';
const redirect_uri = 'https://test2.services.mobilon.ru/';
const client_secret = 'yKdq4UemoOgZanfuV2xi8UhlMYILH9SrVomsHAK4SGXOTSFcMu4DjOcLbG8HMIsz';

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
