import { sign } from "jsonwebtoken";


type payloadData = {
  userId: string , 
  isVerified: boolean ,
} ; 

const generateAccessToken = (data: payloadData): string => {
  return sign(data, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "20m",
  });
};

const generateRefreshToken = (data: payloadData): string => {
  return sign(data, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};

export {generateAccessToken , generateRefreshToken}
