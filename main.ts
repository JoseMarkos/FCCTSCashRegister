type Custom = string | number;

enum Status {
  OPEN = "OPEN",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  CLOSED = "CLOSED",
}

interface RegisterResponse {
  status: Status;
  change: Custom[][];
}

interface NumberObj {
  [index: string]: number;
}

const CurrencyUnits: NumberObj = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100,
};

const getBoxChange = (
  box: Custom[],
  change: number,
  cid: Custom[][],
): Custom[] => {
  const boxName: string = box[0] as string;
  const boxUnit: number = CurrencyUnits[boxName];

  if (change < boxUnit) { 
    return [];
  }
  
  const boxFounds = box[1];
  
  if (boxFounds < 1) {
    return [];
  }

  if (boxFounds > change) {
    const match = (change / boxUnit).toString().match(/\d+/);
    const unitsInChange: number = match ? Number(match[0]) : 0;
    const boxChange = unitsInChange * boxUnit;
    
    return [boxName, boxChange];
  }
  
  return [boxName, boxFounds];
};

const getFunds = (cid: Custom[][]) => {
  let founds: number = 0;

  cid.forEach((x) => {
    founds += x[1] as number;
  });

  return Number(founds.toFixed(2));
};

function checkCashRegister(price: number, cash: number, cid: Custom[][]) {
  const founds = getFunds(cid);
  let change = cash - price;

  if (founds === change) {
    return { status: Status.CLOSED, change: cid };
  }

  const objInsufficientFunds: RegisterResponse = {
    status: Status.INSUFFICIENT_FUNDS,
    change: [],
  };

  if (founds < change) {
    return objInsufficientFunds;
  }

  const objOpen: RegisterResponse = { status: Status.OPEN, change: cid };
  const reversedCid = cid.reverse();
  let changeArr: Custom[][] = [];
  let newChange = change;

  reversedCid.forEach((x) => {
    const box = getBoxChange(x, newChange, reversedCid);

    if (box.length) {
      changeArr.push(box);
      newChange -= (box[1] as number);
      newChange = Number(newChange.toFixed(2));
    }
  });

  const changeCIDFounds = getFunds(changeArr);

  if (change !== changeCIDFounds) {
    return objInsufficientFunds;
  }

  objOpen.change = changeArr;

  return objOpen;
}

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
  ]),
);

console.log(
  checkCashRegister(3.26, 100, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
  ]),
);

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.01],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ]),
);

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.01],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 1],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ]),
);

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ]),
);
