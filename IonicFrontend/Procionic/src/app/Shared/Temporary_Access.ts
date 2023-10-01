import { Delegation_Of_Authority } from "./DelegationOfAuthority";

export interface Temporary_Access {
  temp_Access_ID: Number;
  delegation_ID: Number;
  delegation_Of_Authority: Delegation_Of_Authority;
  name: String;
  IsAdmin: string;
  CanAccInv: string;
  CanAccFin: string;
  CanAccPro: string;
  CanAccVen: string;
  CanAccRep: string;
  CanViewPenPro: string;
  CanViewFlagPro: string;
  CanViewFinPro: string;
  CanAppVen: string;
  CanEditVen: string;
  CanDeleteVen: string;
}
