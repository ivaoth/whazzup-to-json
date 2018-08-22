// IVAO WHAZZUP DOC https://doc.ivao.aero/apidocumentation:whazzup

const express = require('express')
const rp = require('request-promise')
const app = express()

app.get('/', function(req, res) {
  res.json({"response": "OK"})
})

app.get('/status', function(req, res) {
  var options = {
    method: 'GET',
    uri: 'https://www.ivao.aero/whazzup/status.txt'
  }
  var output=[];
  rp(options)
    .then(function (data) {
      data
        .split('\n') // Seperate by detecting new line character
        .filter(function(l) {
          return !l.startsWith(';') && !l.startsWith(';') && l !== '' // Any line starting with ; or # should be regarded as comments and ignored by the client parser
        })
        .forEach(function(l) {
          // console.log(l)
          var extract = l
            .split('=')
          if(extract[1]) {
            output.push({
              "name": extract[0],
              "value": extract[1].replace(/(\r\n|\n|\r)/gm,"")
            })
          }
        })
      return ;
    })
    .then(function() {
      res.json(output)
    })
    .catch(function (err) {
      console.log(err)
    })
})

app.listen(3000)