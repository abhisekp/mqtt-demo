import { sign } from "jsonwebtoken";
import config from "config";
import { Channel } from "./constants";

export const createMediaMqttToken = ({
  ssoId,
  channel = Channel.PRIMARY,
  start = new Date(),
  end,
}: {
  ssoId: string;
  channel?: Channel;
  start?: Date;
  end?: Date;
}) => {
  const ipdRtPptId = `${ssoId}-${channel}`;

  const channelNum = [Channel.PRIMARY, Channel.SECONDARY].indexOf(channel);

  // end = start + 1 year
  end = end || new Date(start.getTime() + 1000 * 60 * 60 * 24 * 365);

  return sign(
    {
      channel: channelNum,
      admin: true,

      iat: Math.floor(new Date().getTime()) / 1000,
      nbf: Math.floor(start.getTime() / 1000),
      exp: Math.floor(end.getTime() / 1000),
    },
    config.get<string>("mqtt.mediaToken"),
    {
      subject: ipdRtPptId,
      issuer: "emqx-demo",
      algorithm: "HS256",
    },
  );
};
