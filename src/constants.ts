export enum Method {
  AUTH_ERROR = "auth_error",

  CREATE_SESSION = "create_session",
  CREATE_SESSION_RESP = "create_session_resp",

  CREATE_PEER = "create_peer",
  CREATE_PEER_RESP = "create_peer_resp",
  CREATE_PEER_ERR = "create_peer_err",

  ADD_CANDIDATE = "add_candidate",

  SET_SECONDARY_MEDIA_STATE = "set_secondary_media_state",
  SWITCH_RESOLUTION = "switch_resolution",

  SET_PRIMARY_ID = "set_primary_id",
  SET_SECONDARY_ID = "set_secondary_id",

  OPEN_PPT_SHARING = "open_ppt_sharing",
  PPT_SHARE_REQ = "ppt_share_req",
  SEC_RECONNECT_REQ = "sec_reconnect_req",
  OPEN_BREAKOUT_ROOM = "open_breakout_room",
  OPEN_PRIMARY_STREAMING_IN_BREAKOUT = "open_primary_streaming_in_breakout",
}
