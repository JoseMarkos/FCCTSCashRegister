import RegisterResponse from "./RegisterResponse.ts";
import Custom from "./Custom.ts";
import Status from "./Status.ts";

export default class Register {
  private readonly currencyUnits: NumberObj = {};
  private initialCID: Custom[][] = [];

  constructor(currencyUnits: NumberObj){
    this.currencyUnits = currencyUnits;
  }

  checkCashRegister(
    price: number,
    cash: number,
    cid: Custom[][]): RegisterResponse {

    this.initialCID = cid;
    const founds    = this.getFunds(cid);
    const change    = cash - price;
  
    if (founds === change) return { status: Status.CLOSED, change: cid };
  
    const insufficientFunds: RegisterResponse = {
      status: Status.INSUFFICIENT_FUNDS,
      change: [],
    };
  
    if (founds < change) return insufficientFunds;
  
    const newCID       = this.getNewCID(change);
    const newCIDFounds = this.getFunds(newCID);
  
    if (change !== newCIDFounds) return insufficientFunds;
  
    return { status: Status.OPEN, change: newCID };
  }

  private getNewCID(change: number): Custom[][] {
    const newCID: Custom[][]  = [];
    const reverseCID          = this.initialCID.reverse();
    let newCIDChange          = change;
  
    console.log(reverseCID);
    
    reverseCID.forEach((box) => {
      const newBox = this.getBoxChange(box, newCIDChange);
  
      if (newBox.length) {
        newCID.push(newBox);
        newCIDChange -= (newBox[1] as number);
        newCIDChange = Number(newCIDChange.toFixed(2));
      }
    });

    return newCID;
  }

  private getFunds(cid: Custom[][]) {
    let founds = 0;
  
    cid.forEach((x) => {
      founds += x[1] as number;
    });
  
    return Number(founds.toFixed(2));
  }

  private getBoxChange (
    box: Custom[],
    change: number,
  ): Custom[] {
    const boxName: string = box[0] as string;
    const boxUnit: number = this.currencyUnits[boxName];
  
    if (change < boxUnit) return [];
    
    const boxFounds = box[1];
    
    if (boxFounds < 1) return [];
  
    if (boxFounds > change) {
      const match                 = (change / boxUnit).toString().match(/\d+/);
      const unitsInChange: number = match ? Number(match[0]) : 0;
      const boxChange             = unitsInChange * boxUnit;
      
      return [boxName, boxChange];
    }
    
    return [boxName, boxFounds];
  }
}

interface NumberObj {
  [index: string]: number;
}