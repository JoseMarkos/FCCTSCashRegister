import { assertEquals} from "https://deno.land/std@0.98.0/testing/asserts.ts";
import Register from "../Register.ts";
import Status from "../Status.ts";

const instance = new Register({
  "ONE HUNDRED": 100,
  "TWENTY": 20,
  "TEN": 10,
  "FIVE": 5,
  "ONE": 1,
  "QUARTER": 0.25,
  "DIME": 0.1,
  "NICKEL": 0.05,
  "PENNY": 0.01,
});

Deno.test("Register change Response Open", () => {
  const happyCase = {status: Status.OPEN, change: [["QUARTER", 0.5]]};
  const actual =  instance.checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);

  assertEquals(actual, happyCase);
});

Deno.test("Register change Response Open Large", () => {
  const happyCase = {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]};
  const actual =  instance.checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);

  assertEquals(actual, happyCase);
});

Deno.test("Register change Response INSUFFICIENT_FUNDS", () => {
  const happyCase = {status: "INSUFFICIENT_FUNDS", change: []};
  const actual =  instance.checkCashRegister(
    19.5, 20, 
    [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
  
  const actual2 = instance.checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
  assertEquals(actual, happyCase);
  assertEquals(actual2, happyCase);
});


Deno.test("Register change Response CLOSED", () => {
  const happyCase = {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]};
  const actual =  instance.checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
  
  assertEquals(actual, happyCase);
});
