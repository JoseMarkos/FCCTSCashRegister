import Custom from "./Custom.ts";
import Status from "./Status.ts";

export default interface RegisterResponse {
  readonly status: Status;
  readonly change: Custom[][];
}