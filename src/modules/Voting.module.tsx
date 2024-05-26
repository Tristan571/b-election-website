export interface IVoting {
  id: string;
  address: string;
  name: string;
  creator: string;
  votingActive: Boolean;
  startDateTime: Date;
  endDateTime: Date;
  img:String;
}
