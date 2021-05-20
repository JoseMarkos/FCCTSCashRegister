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

const searchCurrencyUnit = (str: string, cid: Custom[][]): number => {
  let n = 0;

  cid.forEach((x) => {
    if (x[0] === str) {
      n = x[1] as number;
    }
  });

  return n;
};

const searchIndexOfCurrencyUnit = (str: string, cid: Custom[][]): number => {
  for (const iterator of cid) {
    if (iterator[0] === str) {
      return cid.indexOf(iterator);
    }
  }

  return -1;
};

const getUpdatedCID = (change: number, cid: Custom[][], box: Custom[]): Custom[][] => {
  let updatedCID: Custom[][] = [...cid];
  const boxUnit: number = box[1] as number;
  const boxName: string = box[0] as string;
  
  if (change > boxUnit) {
    const boxFounds = getBoxFunds(boxName, cid);
    const indexInCID = searchIndexOfCurrencyUnit(boxName, cid); 
    
    if (boxFounds > 0) {
      let newBoxFounds = 0;
      
      if (boxFounds > change) {
        const unitsInChange = Number((change / boxUnit).toFixed(0));
        const amountToRemove = unitsInChange * boxUnit;
        newBoxFounds = boxFounds - amountToRemove + (change - amountToRemove);
      }

      updatedCID[indexInCID][1] = newBoxFounds;
    }
  }
  return updatedCID;
};

const divisibles: string[] = ["PENNY", "NICKEL", "DIME", "QUARTER"];

const getBoxFunds = (str: string, cid: Custom[][]) : number => {
  const boxIndex = searchIndexOfCurrencyUnit(str, cid);
  return boxIndex ? cid[boxIndex][1] as number : 0;
}

const getFunds = (cid: Custom[][]) => {
  let founds: number = 0;

  cid.forEach((x) => {
    founds += x[1] as number;
  });

  return Number(founds.toFixed(2));
};

function checkCashRegister(price: number, cash: number, cid: Custom[][]) {
  const founds = getFunds(cid);
  console.log(founds + "founds");
  console.log(cash + " cash");
  let change = cash - price;
  console.log(change + " change");

  if (founds === change) {
    const obj: RegisterResponse = { status: Status.CLOSED, change: cid };
    return obj;
  }

  const objInsufficientFunds: RegisterResponse = {
    status: Status.INSUFFICIENT_FUNDS,
    change: [],
  };


  if (founds < change) {
    return objInsufficientFunds;
  }

  const obj: RegisterResponse = { status: Status.OPEN, change: cid };
  const objExample: RegisterResponse = {
    status: Status.OPEN,
    change: [
      ["TWENTY", 60],
      ["TEN", 20],
      ["FIVE", 15],
      ["ONE", 1],
      ["QUARTER", 0.5],
      ["DIME", 0.2],
      ["PENNY", 0.04],
    ],
  };

  pushBoxFounds(cid, ['', 2]);
  return obj;
}

const pushBoxFounds = (cid: Custom[][], box: Custom[]): void => {
  cid.push(box);

  return;
};

/* console.log(
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
 */
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

/*
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
); */

// console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]))
