import express from "express"
//import fs from "fs/promises"
import * as fs from "fs"
import type { Request, Response } from "express"
import cors from "cors"
import {z} from "zod"
import path from "path"
import fileUpload, { UploadedFile } from "express-fileupload"
import { JsxEmit } from "typescript"

const app = express()
app.use(express.json())
app.use(fileUpload());
app.use(express.text())
app.use(cors())

app.use(express.static('data'))

const port = 3000

const CreationSchema = z.object({
  pizza: z.array(z.object({
    id: z.number(),
    pizza: z.string(),
    price: z.number(),
    piece: z.string(),
  })),
  date: z.string(),
  name: z.string(),
  phone: z.string(),
  zipCode: z.string(),
  city: z.string(),
  street: z.string(),
  house: z.string(),
})


const PizzaSchema = 
    z.object({
    id: z.number(),
    name: z.string(),
    toppings: z.string(),
    price: z.number(),
    link: z.string(),
    picture: z.string()
  })

type Pizza = z.infer<typeof PizzaSchema>;

const folderPath = './orders' 
const outputFilePath = './orders.json'
const refreshInterval = 10 * 1000

app.get('/', async (req: Request, res: Response) => {
  const pizzasData = await fs.readFileSync("./data/pizzascript.json", "utf-8")
  res.send(JSON.parse(pizzasData)) 
})

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

//add new pizza to json
app.get("/", async (req, res) =>
	res.sendFile("./data/images/" + req.body.link));

	  app.post("/", async (req, res) => {
		const pictureUploadPath = "./data/images/" + req.body.link;
	
		if (req.files) {
			const uploadedPicture = req.files.picture as UploadedFile;
			uploadedPicture.mv(pictureUploadPath, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).send(err);
				}
			})}
    
      const fileData = {
        id : +req.body.id,
        name : req.body.name,
        toppings : req.body.toppings,
        price :  +req.body.price,
        link :"http://localhost:3000/images/"+req.body.link,
        picture : req.body.picture
      }
		const uploadPath = "./data/" + "pizzascript.json";
		let pizzas = []
		pizzas = await JSON.parse(fs.readFileSync(uploadPath,"utf-8"))
		pizzas.push(fileData)
		const fileDataString = JSON.stringify(pizzas, null, 2);
		
	
		fs.writeFile(uploadPath, fileDataString, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
		});
	
		return res.send(fileDataString);
	});


//update pizza to json

app.get("/profile.jpg", async (req, res) =>
	res.sendFile(path.join(`${__dirname}./data/profile.jpg`)));

	  app.patch("/update", async (req, res) => {
		const pictureUploadPath = "./data/images/" + req.body.link;
	
		if (req.files) {
			const uploadedPicture = req.files.picture as UploadedFile;
			uploadedPicture.mv(pictureUploadPath, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).send(err);
				}
			})}
      const uploadPath ="./data/pizzascript.json";
      const pizzaData = await JSON.parse( fs.readFileSync(uploadPath, 'utf-8'))
    const index = pizzaData.findIndex((pizza:Pizza) => pizza.name === req.body.name);

    pizzaData.splice(index,1)
		      //fileData.picture = "/profile.jpg";
          const newPizzaData = {
            id:+req.body.id,
            name: req.body.name,
     toppings : req.body.toppings,
     price : +req.body.price,
     link : "http://localhost:3000/images/"+req.body.link,
          }
     pizzaData.push(newPizzaData)
      		
		fs.writeFile(uploadPath,JSON.stringify(pizzaData), (err) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
		});
		return res.send(pizzaData);
	});


//delete pizza from json	
app.delete("/delete",async (req, res) => {
	const uploadPath ="./data/pizzascript.json";
	const pizzaData = await JSON.parse( fs.readFileSync(uploadPath, 'utf-8'))
	const pictureUploadPath = "./backend/data/" + "profile.jpg";
	const pizzas = req.body.name
	let filteredPizza = pizzaData.filter((pizza:Pizza) => pizza.name !== pizzas)
 	 fs.writeFileSync(uploadPath,JSON.stringify(filteredPizza))

	return res.status(200).send("done");
  
});


async function mergeJSONFiles(folderPath: string, outputFile: string) {
  const mergedData: Record<string, any> = []

  // Read all files in the folder
  const fileNames = await fs.readdirSync(folderPath)

  for (const fileName of fileNames) {
      const filePath = path.join(folderPath, fileName)

      // Check if the file is a JSON file
      if (path.extname(filePath) === '.json') {
          try {
              const data = await JSON.parse(fs.readFileSync(filePath, 'utf8'))
              mergedData.push(data)
          } catch (error) {
              console.error(`Error reading or parsing ${fileName}: ${error}`)
          }
      }
  }

  await fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2))
  console.log(`Merged data saved to ${outputFile}`)
}

// Call the merge function

setInterval(() => {
mergeJSONFiles(folderPath, outputFilePath)
}, refreshInterval)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})