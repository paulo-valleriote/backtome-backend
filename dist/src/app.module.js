"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const database_module_1 = require("./infra/database/database.module");
const message_controler_1 = require("./infra/http/controllers/message/message.controler");
const http_module_1 = require("./infra/http/http.module");
const common_1 = require("@nestjs/common");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [http_module_1.HttpModule, database_module_1.DatabaseModule],
        controllers: [message_controler_1.MessageController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map