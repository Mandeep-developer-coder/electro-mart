import { AuthGuard } from "@nestjs/passport";
import { Injectable,ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
export class JwtGuard extends AuthGuard("jwt"){
    canActivate(context: ExecutionContext) {
        const req=context.switchToHttp().getRequest()
        if(req.method==="OPTIONS"){
            return true
        }
       return super.canActivate(context)
    }
}