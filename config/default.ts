require("dotenv").config();

import mqtt from "mqtt";
import * as fs from "node:fs";
import * as path from "node:path";
import ms from "ms";

module.exports = {
  mqtt: {
    serverUrl: "",
    subscriptions: [],
    publish: "",
    webrtcAppId: "_@rt-broadcaster@_",
    jwtPKey: fs.readFileSync(path.resolve(__dirname, "uat-pk.pem"), "utf-8"),
    mediaToken: "",

    options: {
      reconnectPeriod: ms("10s"),
      clientId: `emqx-demo-abhisekp`,
      username: "",
      password: "",
      clean: true,
    } as mqtt.IClientOptions,
  },
};

export type Config = typeof module.exports;
