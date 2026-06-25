import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      success: true,
      message: "Pizi API is running",
      health: "/api/v1/health",
    };
  }
}
