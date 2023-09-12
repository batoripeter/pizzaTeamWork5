"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
//import fs from "fs/promises"
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.text());
app.use((0, cors_1.default)());
app.use(express_1.default.static('data'));
const port = 3000;
const CreationSchema = zod_1.z.object({
    id: zod_1.z.number(),
    pizza: zod_1.z.array(zod_1.z.object({
        pizzaname: zod_1.z.string(),
        piece: zod_1.z.number(),
        price: zod_1.z.number(),
    })),
    date: zod_1.z.string(),
    name: zod_1.z.string(),
    phone: zod_1.z.string(),
    zipCode: zod_1.z.string(),
    city: zod_1.z.string(),
    street: zod_1.z.string(),
    house: zod_1.z.string(),
    email: zod_1.z.string(),
});
const PizzaSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    toppings: zod_1.z.string(),
    price: zod_1.z.number(),
    link: zod_1.z.string(),
    picture: zod_1.z.string()
});
const folderPath = './orders';
const outputFilePath = './orders.json';
const refreshInterval = 10 * 1000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pizzasData = yield fs.readFileSync("./data/pizzascript.json", "utf-8");
    res.send(JSON.parse(pizzasData));
}));
/*
app.post('/api/orders', async (req: Request, res: Response) => {

  const result = CreationSchema.safeParse(req.body)
  if(!result.success) {
      return res.sendStatus(400)
  }

  await fs.writeFileSync(`./orders/order_${result.data.name}_${result.data.date}.json`, JSON.stringify(result.data))

  res.status(200).json(result.data)
})

app.get('/api/orders', async (req: Request, res: Response) => {
  const ordersData = await fs.readFileSync("./orders.json", "utf-8")
  res.send(JSON.parse(ordersData))
})
*/
app.post('/api/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = CreationSchema.safeParse(req.body);
    if (!result.success) {
        return res.sendStatus(400);
    }
    yield fs.writeFileSync(`./orders/order_${result.data.name}_${result.data.date}.json`, JSON.stringify(result.data), "utf-8");
    res.status(200).json(result.data);
}));
app.get('/api/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersData = yield fs.readFileSync("./orders.json", "utf-8");
    res.send(JSON.parse(ordersData));
}));
//add new pizza to json
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.sendFile("./data/images/" + req.body.link); }));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pictureUploadPath = "./data/images/" + req.body.link;
    if (req.files) {
        const uploadedPicture = req.files.picture;
        uploadedPicture.mv(pictureUploadPath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }
    const fileData = {
        id: +req.body.id,
        name: req.body.name,
        toppings: req.body.toppings,
        price: +req.body.price,
        link: "http://localhost:3000/images/" + req.body.link,
        picture: req.body.picture
    };
    const uploadPath = "./data/" + "pizzascript.json";
    let pizzas = [];
    pizzas = yield JSON.parse(fs.readFileSync(uploadPath, "utf-8"));
    pizzas.push(fileData);
    const fileDataString = JSON.stringify(pizzas, null, 2);
    fs.writeFile(uploadPath, fileDataString, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    });
    return res.send(fileDataString);
}));
//update pizza to json
app.get("/profile.jpg", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.sendFile(path_1.default.join(`${__dirname}./data/profile.jpg`)); }));
app.patch("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pictureUploadPath = "./data/images/" + req.body.link;
    if (req.files) {
        const uploadedPicture = req.files.picture;
        uploadedPicture.mv(pictureUploadPath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }
    const uploadPath = "./data/pizzascript.json";
    const pizzaData = yield JSON.parse(fs.readFileSync(uploadPath, 'utf-8'));
    const index = pizzaData.findIndex((pizza) => pizza.name === req.body.name);
    pizzaData.splice(index, 1);
    //fileData.picture = "/profile.jpg";
    const newPizzaData = {
        id: +req.body.id,
        name: req.body.name,
        toppings: req.body.toppings,
        price: +req.body.price,
        link: "http://localhost:3000/images/" + req.body.link,
    };
    pizzaData.push(newPizzaData);
    fs.writeFile(uploadPath, JSON.stringify(pizzaData), (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    });
    return res.send(pizzaData);
}));
//delete pizza from json	
app.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPath = "./data/pizzascript.json";
    const pizzaData = yield JSON.parse(fs.readFileSync(uploadPath, 'utf-8'));
    const pictureUploadPath = "./backend/data/" + "profile.jpg";
    const pizzas = req.body.name;
    let filteredPizza = pizzaData.filter((pizza) => pizza.name !== pizzas);
    fs.writeFileSync(uploadPath, JSON.stringify(filteredPizza));
    return res.status(200).send("done");
}));
function mergeJSONFiles(folderPath, outputFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const mergedData = [];
        // Read all files in the folder
        const fileNames = yield fs.readdirSync(folderPath);
        for (const fileName of fileNames) {
            const filePath = path_1.default.join(folderPath, fileName);
            // Check if the file is a JSON file
            if (path_1.default.extname(filePath) === '.json') {
                try {
                    const data = yield JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    mergedData.push(data);
                }
                catch (error) {
                    console.error(`Error reading or parsing ${fileName}: ${error}`);
                }
            }
        }
        yield fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
        console.log(`Merged data saved to ${outputFile}`);
    });
}
// Call the merge function
setInterval(() => {
    mergeJSONFiles(folderPath, outputFilePath);
}, refreshInterval);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
