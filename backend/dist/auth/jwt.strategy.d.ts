import { AuthService, JwtPayload } from './auth.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<import("../users/user.entity").User>;
}
export {};
