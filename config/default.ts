require("dotenv").config();

import mqtt from "precompiled-mqtt";

module.exports = {
  mqtt: {
    serverUrl: "",
    subscriptions: [],

    options: {
      reconnectPeriod: 1_00_00,
      clientId: "emqx-demo",
      username: "abhisekp",
      password: "",
      clean: true,
    } as mqtt.IClientOptions,
  },
};

export type Config = typeof module.exports;
