import { sign } from "jsonwebtoken";
import config from "config";
import { Channel } from "./constants";

export const createMqttToken = ({
  webrtcAppId,
  ssoId,
  channel = Channel.PRIMARY,
  start = new Date(),
  end,
}: {
  webrtcAppId: string;
  ssoId: string;
  channel?: Channel;
  start?: Date;
  end?: Date;
}) => {
  const ipdRtPptId = `${ssoId}-${channel}`;
  const jwtPKey = config.get<string>("mqtt.jwtPKey");

  // end = start + 1 year
  end = end || new Date(start.getTime() + 1000 * 60 * 60 * 24 * 365);

  return sign(
    {
      iat: Math.floor(new Date().getTime() / 1000),
      nbf: Math.floor(start.getTime() / 1000),
      exp: Math.floor(end.getTime() / 1000),
      username: ipdRtPptId,
      acl: {
        pub: [`${webrtcAppId}/manager/cmd`],
        sub: [
          `${webrtcAppId}/manager/cmdResp/${ipdRtPptId}`,
          `${webrtcAppId}/manager/bcast`,
        ],
      },
    },
    jwtPKey,
    { algorithm: "RS256", subject: ipdRtPptId, issuer: "emqx-demo" },
  );
};
