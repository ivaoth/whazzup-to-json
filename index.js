// IVAO WHAZZUP DOC https://doc.ivao.aero/apidocumentation:whazzup

const axios = require("axios");
const express = require("express");
const app = express();
const dotenv = require('dotenv')

dotenv.config()

const config = {
  general: {
    baseurl: process.env.BASE_URL,
    whazzupurl: process.env.WHAZZUP_URL
  },
  web: {
    port: process.env.PORT || 3000
  }
};

app.get("/", function (req, res) {
  res.status(200).send({
    status: 'success',
    code: 201,
    response: {
      message: 'hello',
    },
  })
});

app.get("/status", async function (req, res) {
  var output = [];

  try {
    const whazzup = await axios.get(config.general.whazzupurl);

    whazzup
      .split('\n')
      .filter(function (l) {
        return !l.startsWith(";") && !l.startsWith(";") && l !== ""; // Any line starting with ; or # should be regarded as comments and ignored by the client parser
      })
      .forEach(function (l) {
        // console.log(l)
        var extract = l.split("=");
        if (extract[1]) {
          output.push({
            name: extract[0],
            value: extract[1].replace(/(\r\n|\n|\r)/gm, "") // Trim the end
          });
        }
      });

    res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'data obtained',
        data: output,
      },
    })
  } catch (err) {
    res.status(400).send({
      status: 'failure',
      code: 401,
      response: {
        message: 'unexpected error',
        data: err.data,
      },
    })
  }
});

app.get("/whazzup", function (req, res) {
  var general = [],
    clients = [],
    airports = [],
    servers = [];
  var tmp = [];

  
  rp({
      method: "GET",
      uri: config.general.baseurl + "/status",
      json: true
    })
    .then(function (data) {
      data.forEach(function (d) {
        if (d.name === "url0") tmp.push(d.value);
      });
    })
    .then(function () {
      return rp({
        method: "GET",
        uri: tmp[0]
      }).then(function (data) {
        lines = data.split("\n");
        var mode = "";
        lines.forEach(function (line) {
          line = line.replace(/(\r\n|\n|\r)/gm, "");
          if (line.startsWith("!")) {
            mode = line.slice(1);
          } else {
            switch (mode) {
              case "GENERAL": // !GENERAL
                var extract = line.split(" = ");
                general.push({
                  name: extract[0],
                  value: extract[1]
                });
                break;
              case "CLIENTS": // !CLIENTS
                var fields = line.split(":");
                var client = {};
                client.callsign = fields[0];
                client.vid = fields[1];
                client.type =
                  fields.length === 49 ? fields[3].toLowerCase() : "skip";
                client.name = fields[2];
                client.connectionTime = fields[37];
                client.softwareName = fields[38];
                client.softwareVersion = fields[39];
                switch (client.type) {
                  case "atc":
                    if (fields[18] === "0") {
                      client.type = "observer";
                    } else {
                      client.frequency = fields[4];
                      client.facilityType = fields[18];
                      client.rating = fields[41];
                    }
                    break;
                  case "pilot":
                    client.latitiude = parseFloat(fields[5]);
                    client.longtitude = parseFloat(fields[6]);
                    client.altitude = parseInt(fields[7]);
                    client.groundSpeed = parseInt(fields[8]);
                    client.heading = parseInt(fields[45]);
                    client.onGround = fields[46] === "1";
                    client.squawk = fields[17];
                    client.rating = fields[41];
                    if (fields[20] !== "") {
                      client.fullAircraft = fields[9];
                      client.aircraft = fields[9].split("/")[1];
                      client.cruisingSpeed = fields[10];
                      client.departure = fields[11];
                      client.cruislingLevel = fields[12];
                      client.destination = fields[13];
                      client.flightRules = fields[21];
                      client.departureTime = fields[22];
                      client.enrouteTime =
                        parseInt(fields[24]) * 60 + parseInt(fields[25]);
                      client.endurace =
                        parseInt(fields[26]) * 60 + parseInt(fields[27]);
                      client.alternate = fields[28];
                      client.remarks = fields[29];
                      client.route = fields[30];
                      client.alternate2 = fields[42];
                      client.typeOfFlight = fields[43];
                      client.pob = parseInt(fields[44]);
                    }
                }
                if (client.type !== "skip") {
                  clients.push(client);
                }
                break;
              case "AIRPORTS": // !AIRPORTS
                var fields = line.split(":");
                var airport = {};
                airport.icao = fields[0];
                airport.atis = fields[1];
                airports.push(airport);
                break;
              case "SERVERS": // !SERVERS
                var fields = line.split(":");
                var server = {};
                server.ident = fields[0];
                server.ip = fields[1];
                server.location = fields[2];
                server.description = fields[3];
                server.isallowed = fields[4];
                server.maxconnection = fields[5];
                servers.push(server);
                break;
            }
          }
        });
      });
    })
    .then(function () {
      servers.pop();
      res.json({
        general: general,
        clients: clients,
        airports: airports,
        servers: servers
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/voice", function (req, res) {
  var general = [],
    vclients = [],
    vservers = [];
  var tmp = [];
  rp({
      method: "GET",
      uri: config.general.baseurl + "/status",
      json: true
    })
    .then(function (data) {
      data.forEach(function (d) {
        if (d.name === "url1") tmp.push(d.value);
      });
    })
    .then(function () {
      return rp({
        method: "GET",
        uri: tmp[0]
      }).then(function (data) {
        lines = data.split("\n");
        var mode = "";
        lines.forEach(function (line) {
          line = line.replace(/(\r\n|\n|\r)/gm, "");
          if (line.startsWith("!")) {
            mode = line.slice(1);
          } else {
            switch (mode) {
              case "GENERAL": // !GENERAL
                var extract = line.split(" = ");
                general.push({
                  name: extract[0],
                  value: extract[1]
                });
                break;
              case "VOICE CLIENTS": // !CLIENTS
                var fields = line.split(":");
                break;
              case "VOICE SERVERS": // !AIRPORTS
                var fields = line.split(":");
                var vserver = {};
                vserver.ident = fields[2];
                vserver.ip = fields[0];
                vserver.location = fields[1];
                vserver.description = fields[5];
                vserver.isallowed = fields[4];
                vserver.maxconnection = fields[5];
                vservers.push(vserver);
                break;
            }
          }
        });
      });
    })
    .then(function () {
      res.json({
        general: general,
        voice: {
          client: vclients,
          server: vservers
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/metar", function (req, res) {
  var output = [];
  var tmp = [];
  rp({
      method: "GET",
      uri: config.general.baseurl + "/status",
      json: true
    })
    .then(function (data) {
      data.forEach(function (d) {
        if (d.name === "metar0") tmp.push(d.value);
      });
    })
    .then(function () {
      return rp({
        method: "GET",
        uri: tmp[0]
      }).then(function (data) {
        lines = data.split("\n");
        lines.forEach(function (line) {
          var metar = {};
          line = line.replace(/(\r\n|\n|\r)/gm, "").split(" ");
          metar.icao = line[0];
          metar.time = line[1];
          metar.detail = "";
          for (var i = 2; i < line.length; i++) {
            metar.detail += line[i];
            if (line.length - 1 !== i) {
              metar.detail += " ";
            }
          }
          output.push(metar);
        });
      });
    })
    .then(function () {
      res.json(output);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/taf", function (req, res) {
  var output = [];
  var tmp = [];
  rp({
      method: "GET",
      uri: config.general.baseurl + "/status",
      json: true
    })
    .then(function (data) {
      data.forEach(function (d) {
        if (d.name === "taf0") tmp.push(d.value);
      });
    })
    .then(function () {
      return rp({
        method: "GET",
        uri: tmp[0]
      }).then(function (data) {
        lines = data.split("\n");
        lines.slice(1).forEach(function (line) {
          var taf = {};
          line = line.replace(/(\r\n|\n|\r)/gm, "").split(" ");
          taf.icao = line[0];
          taf.time = line[1];
          taf.detail = "";
          for (var i = 2; i < line.length; i++) {
            taf.detail += line[i];
            if (line.length - 1 !== i) {
              taf.detail += " ";
            }
          }
          output.push(taf);
        });
      });
    })
    .then(function () {
      res.json(output);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/shorttaf", function (req, res) {
  var output = [];
  var tmp = [];
  rp({
      method: "GET",
      uri: config.general.baseurl + "/status",
      json: true
    })
    .then(function (data) {
      data.forEach(function (d) {
        if (d.name === "shorttaf0") tmp.push(d.value);
      });
    })
    .then(function () {
      return rp({
        method: "GET",
        uri: tmp[0]
      }).then(function (data) {
        lines = data.split("\n");
        lines.forEach(function (line) {
          var shorttaf = {};
          line = line.replace(/(\r\n|\n|\r)/gm, "").split(" ");
          shorttaf.icao = line[0];
          shorttaf.time = line[1];
          shorttaf.detail = "";
          for (var i = 2; i < line.length; i++) {
            shorttaf.detail += line[i];
            if (line.length - 1 !== i) {
              shorttaf.detail += " ";
            }
          }
          output.push(shorttaf);
        });
      });
    })
    .then(function () {
      res.json(output);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get('*', function (req, res) {
  res.json({
    respose: "error",
    remark: "not found"
  }, 404);
});

app.listen(config.web.port);