import mqtt from "mqtt";
import config from "config";
import { Method } from "./constants";
import { ManagerMsg } from "./types";
import { createMqttToken } from "./mqttToken";
import { createMediaMqttToken } from "./mediaToken";
import _ from "lodash";

// console.log(config.util.toObject());

const mqttServerUrl = config.get<string>("mqtt.serverUrl");
const mqttOptions = config.get<mqtt.IClientOptions>("mqtt.options") || {};
const topics = config.get<string[]>("mqtt.subscriptions");

function onMQTTMessage(): mqtt.OnMessageCallback {
  return (topic, message) => {
    console.log("Got Message:", { topic, message: message.toString() });

    try {
      const payload: ManagerMsg = JSON.parse(message.toString());
      console.log(payload);
    } catch (e) {
      console.error(e);
    }
  };
}

let client: mqtt.MqttClient;

async function publish() {
  const mqttMediaToken = createMediaMqttToken({
    ssoId: mqttOptions.username! as string,
  });

  const topic = config.get<string>("mqtt.publish");

  const message: ManagerMsg = {
    method: Method.OPEN_BREAKOUT_ROOM,
    token: mqttMediaToken,
    srcId: mqttOptions.username! as string,
    params: {
      open: _.sample([true, false]),
    },
  };
  const msg = JSON.stringify(message);

  console.log(
    "Published:",
    await client.publishAsync(topic, msg, {
      qos: 1,
      retain: false,
      dup: false,
    }),
  );
}

async function run() {
  client.subscribe(
    topics,
    {
      qos: 0,
      rap: true,
    },
    async (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("Subscribed to all topics", topics);

      try {
        await publish();
      } catch (e) {
        console.error(e);
      }
    },
  );
}

(async function start() {
  const username = mqttOptions.username!;
  const password = createMqttToken({
    webrtcAppId: config.get<string>("mqtt.webrtcAppId"),
    ssoId: username,
  });

  const mqttConnectOptions: mqtt.IClientOptions = {
    ...mqttOptions,
    clientId: mqttOptions.clientId,
    username: `${username}-primary`,
    password,
  };
  console.log({ mqttConnectOptions });

  try {
    client = mqtt.connect(mqttServerUrl, mqttConnectOptions);

    client.on("connect", () => {
      console.log("Connected?", client.connected);
      console.log("Connected");

      run();
    });

    client.on("error", (err) => {
      console.error(err);
    });

    client.on("reconnect", () => {
      console.log("Reconnecting");
      console.log("Connected?", client.connected);
    });

    client.on("message", onMQTTMessage());

    client.on("disconnect", () => {
      console.log("Disconnected");
    });
  } catch (e) {
    console.error(e);
  }
})();
