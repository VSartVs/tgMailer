"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Bot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Bot"));
const MailingStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/MailingStatus"));
const Chat_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Chat"));
class Mailing extends Orm_1.BaseModel {
    static async saveJsonFields(mailing) {
        mailing.photos = JSON.stringify(mailing.photos);
        if (mailing.inlineKeyboard !== null)
            mailing.inlineKeyboard = JSON.stringify(mailing.inlineKeyboard);
        if (mailing.replyKeyboard !== null)
            mailing.replyKeyboard = JSON.stringify(mailing.replyKeyboard);
    }
    static async readJsonFields(mailing) {
        mailing.photos = JSON.parse(mailing.photos);
        if (mailing.inlineKeyboard !== null)
            mailing.inlineKeyboard = JSON.parse(mailing.inlineKeyboard);
        if (mailing.replyKeyboard !== null)
            mailing.replyKeyboard = JSON.parse(mailing.replyKeyboard);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Mailing.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Mailing.prototype, "message", void 0);
__decorate([
    Orm_1.column.date({
        serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
    }),
    __metadata("design:type", luxon_1.DateTime)
], Mailing.prototype, "requiredStartAt", void 0);
__decorate([
    Orm_1.column.date({
        serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
    }),
    __metadata("design:type", Object)
], Mailing.prototype, "actualStartAt", void 0);
__decorate([
    Orm_1.column.date({
        serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
    }),
    __metadata("design:type", Object)
], Mailing.prototype, "endAt", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Mailing.prototype, "photos", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Mailing.prototype, "inlineKeyboard", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Mailing.prototype, "replyKeyboard", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Mailing.prototype, "botId", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Mailing.prototype, "statusId", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Mailing.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Mailing.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Bot_1.default),
    __metadata("design:type", Object)
], Mailing.prototype, "bot", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => MailingStatus_1.default),
    __metadata("design:type", Object)
], Mailing.prototype, "status", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Chat_1.default),
    __metadata("design:type", Object)
], Mailing.prototype, "chats", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Mailing]),
    __metadata("design:returntype", Promise)
], Mailing, "saveJsonFields", null);
__decorate([
    (0, Orm_1.afterFetch)(),
    (0, Orm_1.afterFind)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Mailing]),
    __metadata("design:returntype", Promise)
], Mailing, "readJsonFields", null);
exports.default = Mailing;
//# sourceMappingURL=Mailing.js.map