import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() body): Promise<void> {
        await this.authService.createUser(body);
        return;
    }

    @Post('login')
    async login(@Body() body) {
        const result = await this.authService.login(body);
        return result;
    }
}
