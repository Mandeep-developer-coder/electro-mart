import { Injectable } from "@nestjs/common";
import { ExtractJwt,Strategy } from "passport-jwt";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([
                (req:Request)=>{
                    return req?.cookies?.token
                }
            ]),
            ignoreExpiration: false,
      secretOrKey: "mysecretkey",
        })
    }
    async validate(payload:any) {
         return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
    }
}