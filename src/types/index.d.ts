import { Method } from "../constants";

interface ManagerMsg {
  srcId: string;
  // dstId: string;
  token: string;
  method: Method;
  params: Record<string, any>;
}
