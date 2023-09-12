import "./style.css";
import http from "axios";
import { object, z } from "zod";

const PizzaResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  toppings: z.string(),
  price: z.number(),
  link: z.string(),
});
const PizzaArraySchema = z.array(PizzaResponseSchema);
type PizzaResponse = z.infer<typeof PizzaArraySchema>;

type PizzaName = {
}

var pizzaName:PizzaName[] = [{
}]

let pizzaPrice: number[] = [];
let pizzaPiece: number[] = [];
let counter:number = Math.floor(Object.values("../backend/data/pizzascript.json").length/4)

const pizzaFunction = async () => {
  const response = await http.get("http://localhost:3000/");
  const pizzaFromJson: PizzaResponse = response.data;
  const result = PizzaArraySchema.safeParse(pizzaFromJson);

  if (!result.success) {
    alert("Pizza Error");
  }

  let i = 0;

  while (i < counter) {
    let pizzaFields = document.createElement("div") as HTMLDivElement
    pizzaFields.setAttribute("id","pizza-section" + [i] );
    pizzaFields.setAttribute("class","pizza-section_block");
    (document.getElementById("pizzasection") as HTMLElement).appendChild(pizzaFields);

    let pizzaNewName = document.createElement("h1") as HTMLParagraphElement;
    pizzaNewName.innerHTML = [i + 1] + ". " + pizzaFromJson[i].name;
    pizzaNewName.setAttribute("id", "pizzaName" + [i]);
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild(pizzaNewName);
        pizzaName.push(pizzaFromJson[i].name)

    let pizzaNewImage = document.createElement("img") as HTMLImageElement;
    pizzaNewImage.src = pizzaFromJson[i].link;
    pizzaNewImage.width = 400;
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild(pizzaNewImage);

    let pizzaNewToppings = document.createElement("p") as HTMLParagraphElement;
    pizzaNewToppings.innerHTML = "Toppings: " + pizzaFromJson[i].toppings;
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild(pizzaNewToppings);

    let pizzaNewPrice = document.createElement("p") as HTMLParagraphElement;
    pizzaNewPrice.innerHTML = "Price: " + pizzaFromJson[i].price;
    pizzaNewPrice.setAttribute("id", "pizzaPrice" + [i]);
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild(pizzaNewPrice);
    pizzaPrice.push(+pizzaFromJson[i].price);

    let pizzaPieceSelector = document.createElement("p") as HTMLParagraphElement;
    pizzaPieceSelector.innerHTML="Amount: ";
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild(pizzaPieceSelector);

    let pizzaNewPieceInput = document.createElement( "input") as HTMLInputElement;
    pizzaNewPieceInput.setAttribute("type", "number");
    pizzaNewPieceInput.setAttribute("id", "pizzaPiece" + [i]);
    (document.getElementById("pizza-section" + [i]) as HTMLElement).appendChild( pizzaNewPieceInput );
     i++;
  }
};
pizzaFunction();

const customerName = document.getElementById("name")! as HTMLInputElement;
const customerZipCode = document.getElementById("zipcode")! as HTMLInputElement;
const customerCity = document.getElementById("city")! as HTMLInputElement;
const customerStreet = document.getElementById("street")! as HTMLInputElement;
const customerHouseNumber = document.getElementById(  "house")! as HTMLInputElement;
const customerEmail = document.getElementById("email")! as HTMLInputElement;
const customerPhoneNumber = document.getElementById(  "phone")! as HTMLInputElement;

const CustomerSchema = z.object({
  name: z.string(),
  zipcode: z.string(),
  city: z.string(),
  street: z.string(),
  house: z.string(),
  email: z.string(),
  phone: z.string(),
});

type Customer = z.infer<typeof CustomerSchema>;

const PizzaSchema = z.object({
  pizzaname: z.string(),
  piece: z.number(),
  price: z.number(),
});

type Pizza = z.infer<typeof PizzaSchema>;

const OrderSchema = z.object({
  customer: z.object({
    customername: z.string(),
    zipcode: z.string(),
    city: z.string(),
    street: z.string(),
    house: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  date: z.string(),
  pizza: z.array(z.string()),
  totalprice: z.number(),
});

type Order = z.infer<typeof OrderSchema>;

let amountArray: number[] = [];
let pizzaOrders: Pizza[] = [];
let priceSum = 0;
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const minutes = date.getMinutes();
const hour = date.getHours()
const today = (`${year}-${month}-${day}-${hour}-${minutes}`).toString()

document.getElementById("addtoorder")!.addEventListener("click", () => {
  const customerData: Customer = {
    name: customerName.value,
    zipcode: customerZipCode.value,
    city: customerCity.value,
    street: customerStreet.value,
    house: customerHouseNumber.value,
    email: customerEmail.value,
    phone: customerPhoneNumber.value,
  };

  document.getElementById("outname")!.textContent = customerData.name;
  document.getElementById("outaddress")!.textContent =
    customerData.zipcode +    " " +    customerData.city +    " " +    customerData.street +    " " +    customerData.house;
  document.getElementById("outemail")!.textContent = customerData.email;
  document.getElementById("outphone")!.textContent = customerData.phone;
  document.getElementById("pizzaordername")!.innerHTML=""
  document.getElementById("pizzaorderpiece")!.innerHTML=""
  document.getElementById("pizzaorderprice")!.innerHTML=""
  document.getElementById("totalprice")!.innerHTML=""


let j = 0
  let pizzaPieces:number[]=[]
  while(j<counter){
  pizzaPieces.push(+(document.getElementById("pizzaPiece"+[j]) as HTMLInputElement).value)
  j++
  }
  console.log(pizzaPieces)


let k=0 
const pizzaOrder: Pizza[] = []
while (k<counter){
   pizzaOrder.push(
    {pizzaname: "" + pizzaName[k],      piece: + pizzaPieces[k],      price: + pizzaPrice[k]},
  )
  k++
}


console.log(pizzaOrder)

/*
let j = 0
  let pizzaPieces:number[]=[]
  const pizzaOrder: Pizza[] = []
  while(j<counter){
  pizzaPieces.push(+(document.getElementById("pizzaPiece"+[j]) as HTMLInputElement).value)
  pizzaOrder.push( {pizzaname: "" + pizzaName[j], piece: + pizzaPieces[j-1], price: + pizzaPrice[j]},
  )
  j++
}


console.log(pizzaOrder)
*/

  pizzaOrder.forEach((pizzaData) => {
    
     const count = pizzaData.piece;
    if (count > 0) {
      let multiply = count * pizzaData.price;

      let nameElement = document.createElement("h2");
      nameElement.textContent = pizzaData.pizzaname;
      document.getElementById("pizzaordername")!.appendChild(nameElement);

      let pieceElement = document.createElement("h2");
      pieceElement.textContent = pizzaData.piece + " pc";
       document.getElementById("pizzaorderpiece")!.appendChild(pieceElement);

      let priceElement = document.createElement("h2");
      priceElement.textContent = multiply.toString() + " Ft";
      document.getElementById("pizzaorderprice")!.appendChild(priceElement);

        let newOrder = {
        pizzaname: pizzaData.pizzaname,
        piece: pizzaData.piece,
        price: pizzaData.price,
      };
     
      pizzaOrders.push(newOrder);
  
      amountArray.push(multiply);
    }
  });

  function sumAmountArray(numbers: number[]): number {
    let sum = 0;
    for (const num of numbers) {
      sum += num;
    }
    return sum;
  }

  priceSum = sumAmountArray(amountArray);

  if (priceSum !== 0) {
    const totalPriceElement = document.createElement("h2");
    totalPriceElement.textContent = priceSum.toString() + " Ft";
    document.getElementById("totalprice")!.appendChild(totalPriceElement);
  }

  const orderCheck = document.getElementById("ordercheck")!;
  orderCheck.removeAttribute("style");

  const orderButton = document.getElementById("order")!;
  orderButton.removeAttribute("style");
});

document.getElementById("order")!.addEventListener("click", () => {
  async function postJSON(data: any) {
    try {
      const response = await http("http://localhost:3000/api/orders", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      });
      const result = await response.data;
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const orderData: Order = {
    customer: {
      customername: customerName.value,
      zipcode: customerZipCode.value,
      city: customerCity.value,
      street: customerStreet.value,
      house: customerHouseNumber.value,
      email: customerEmail.value,
      phone: customerPhoneNumber.value,
    },
    date: today,
    pizza: pizzaOrders,
    totalprice: priceSum,
  };

  postJSON(orderData);
});
