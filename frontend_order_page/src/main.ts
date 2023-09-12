import './style.css'
import axios from "axios"

const app = document.getElementById("app") as HTMLDivElement
const data: any = [];

const ordersData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders");
      app.innerHTML = ""
      data.push(response.data);
      console.log(data[0]);
      renderCards(data)
      
    } catch (error) {
      console.error(error);
    }
};

ordersData()

const renderCards = (response: any) => {
    for (let i = 0; i < response[0].length; i++) {
      const { city, date, house, name, phone, street, zipCode, pizza } = response[0][i];

      app.innerHTML += `
        <div class="collapse bg-base-300 w-1/4 m-4">
            <input type="checkbox" /> 
            <div class="collapse-title text-xl font-medium">
                ${name} /  ${date}
            </div>
        
            <div class="collapse-content"> 
                <div class="flex justify-between items-center">
                    <div>
                        <p class="mb-2">City: ${city}, ${zipCode} </p>
                        <p class="mb-2">House Number: ${house}</p>
                        <p class="mb-2">Name: ${name}</p>
                        <p class="mb-2">Phone: ${phone}</p>
                        <p class="mb-2">Street: ${street}</p>
                    </div>
                    <div class="flex flex-col bg-green-400 p-5 rounded-2xl text-black">${pizza.map((i: any) => `
                        <li>${i.pizza}</li>`
                    ).join("")}</div>
                </div>
            </div>
        </div>
        `;
  }   
}

setInterval(() => {
    ordersData()
}, 10000)
