import { Role } from "./roles.type";

export interface User {
userId: number;
}
// export interface UserTokenResponse {
//     mensaje: string;
//     userId: number;
//   }
  
export interface UserWithToken {
  token: string;
  userId: number;
}


  