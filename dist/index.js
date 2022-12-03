"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_client_1 = __importDefault(require("./prisma.client"));
dotenv_1.default.config({ path: './.env' });
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send("Edvive API 2.0");
});
app.post('/user', async (req, res) => {
    console.log(req);
    const { email } = req.body;
    try {
        const newUser = prisma_client_1.default.user.create({
            data: {
                email: email
            }
        });
        res.status(200).json(newUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const server = app.listen(PORT, () => {
    console.log(`The server is running at port: ${PORT}`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map