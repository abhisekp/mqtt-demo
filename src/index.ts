import mqtt from "mqtt";
import config from "config";

function onMQTTMessage(): mqtt.OnMessageCallback {
  return (topic, message) => {
    console.log({ topic, message: message.toString() });

    try {
      const payload = JSON.parse(message.toString());
      console.log(payload);
    } catch (e) {
      console.error(e);
    }
  };
}

(async function start(username) {
  // console.log(config.util.toObject());

  const mqttServerUrl = config.get<string>("mqtt.serverUrl");
  const mqttOptions = config.get<mqtt.IClientOptions>("mqtt.options") || {};

  try {
    const client = mqtt.connect(mqttServerUrl, {
      ...mqttOptions,
      username: username ?? mqttOptions.username,
      clientId: mqttOptions.clientId,
    });

    client.on("connect", () => {
      console.log("Connected?", client.connected);
      console.log("Connected");
    });

    client.on("reconnect", () => {
      console.log("Connected?", client.connected);
      console.log("Reconnected");
    });

    client.on("message", onMQTTMessage());

    client.on("disconnect", () => {
      console.log("Disconnected");
    });

    client.subscribe(
      config.get<string[]>("mqtt.subscriptions"),
      {
        qos: 0,
        rap: true,
      },
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
  } catch (e) {
    console.error(e);
  }
})("abhisekp");
