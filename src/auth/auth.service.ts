import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt"
import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService, private readonly mailService: MailService, private readonly otpService: OtpService) { }

    async signup(data: SignupDto, res) {
        try {
            const user = await this.userService.findByEmail(data.email);
            if (user) return { success: false, msg: "User already registered" };

            const hashPassword = await bcrypt.hash(data.password, 10);


            const newUser = await this.userService.createUser({
                name: data.name,
                email: data.email,
                password: hashPassword,
                role: data.role || "user",
            });

            const token = this.jwtService.sign({
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
                path: "/",
            });

            return { success: true, msg: "Registered" };
        } catch (err) {

            console.error("Signup failed:", err);
            return { success: false, msg: err.message || "Internal server error" };


        }
    }

    async login(data: LoginDto, res) {
        try {
            const user = await this.userService.findByEmail(data.email)
            if (!user) {
                return {
                    success: false,
                    msg: "You are not registered"
                }
            }
            const isMatch = await bcrypt.compare(data.password, user.password)
            if (!isMatch) {
                return {
                    success: false,
                    msg: "Invalid credentials"
                }
            }
            const token = this.jwtService.sign({
                id: user._id,
                email: user.email,
                role: user.role
            })
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
                path: "/"
            }
            )
            return {
                success: true,
                msg: "Successfuly Login",
                role: user.role
            }

        } catch (err) {

        }

    }
    async logout(res) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        return {
            success: true
        }
    }
    async forgotPassword(email) {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                return {
                    success: false,
                    msg: "User does not exist"
                };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`🔑 [OTP Debug] Generated OTP for ${email}: ${otp}`);
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            await this.otpService.saveOtp({ userId: user._id, otp, expiresAt });

            try {
                await this.mailService.sendOtpMail(email, otp);
            } catch (mailError) {
                console.warn(`⚠️ SMTP error occurred while sending mail to ${email}:`, mailError.message);
                console.warn(`👉 You can use the logged OTP above for development verification.`);
            }

            return { success: true };
        } catch (error) {
            console.error("Forgot password error:", error);
            return {
                success: false,
                msg: error.message || "Internal server error during forgot password"
            };
        }
    }

    async me(req) {
        return {
            loggedIn: true,
            user: {
                id: req.user.userId,
                email: req.user.email,
                role: req.user.role

            }
        }
    }

    async resetPassword(email: string, otp: string, data: any) {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                return { success: false, msg: "User does not exist" };
            }

            const isOtpValid = await this.otpService.verifyOtp(user._id, otp);
            if (!isOtpValid) {
                return { success: false, msg: "Invalid or expired OTP" };
            }

            const hashPassword = await bcrypt.hash(data.newPassword, 10);
            await this.userService.updatePassword(user._id, hashPassword);
            await this.otpService.deleteOtp(user._id);

            return { success: true, msg: "Password changed successfully" };
        } catch (error) {
            console.error("Reset password error:", error);
            return {
                success: false,
                msg: error.message || "Internal server error during reset password"
            };
        }
    }

}
