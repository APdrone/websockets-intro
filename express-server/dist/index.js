"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected to redis');
            app.listen(port, () => {
                console.log(`Server running on port${port}`);
            });
        }
        catch (err) {
            console.error(`Failed to connect to redis: ${err}`);
        }
    });
}
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    const userId = req.body.userId;
    //push to a DB
    try {
        yield client.lPush('problems', JSON.stringify({ code, language, problemId, userId }));
        // Store in the database
        res.status(200).send('Submission received and stored.');
    }
    catch (error) {
        console.error('Redis error:', error);
        res.status(500).send('Failed to store submission.');
    }
}));
StartServer();
