import "./style.css";
import http from "axios"
import {z} from 'zod'

const PizzaSchema = z.object ({
 id: z.string(),
  pizzaname: z.string(),
  toppings: z.string(),
  price: z.string(),
  pictureName:z.string()
}).array()

type Pizza = z.infer<typeof PizzaSchema>

let pizzas:Pizza[] = []

//get last id
let lastPizzaId:number
const getPizzaId = async () => {
      const response = await http.get("http://localhost:3000/")
for (let key in response.data){
 lastPizzaId = +response.data[key].id+1
}    
  }
  getPizzaId()

//add new pizzas to backend/data/pizzascript.json
document.getElementById("load-button")!.addEventListener("click",  () => {

  let value1 = (document.getElementById("name") as HTMLInputElement).value;
  let value2 = (document.getElementById("price") as HTMLInputElement).value;

  async function upload(formData:FormData) {
    try {
        const response = await http.post("http://localhost:3000", formData);
        const result = await response.data;
        console.log("Success:", result);
        let innerdiv = document.createElement("div");
        innerdiv.innerHTML = "<p>Pizza successfully added!</p>";
        let sectionname = document.getElementById("addPizza");
        sectionname!.appendChild(innerdiv);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  const formData = new FormData();

  const fileField = document.getElementById("image") as HTMLInputElement
  const toppingsArray = [...document.querySelectorAll(".toppings-form")].filter(input=>input.checked).map(input=>input.value)
  const pictureName = fileField!.files![0].name
  formData.append("id",""+lastPizzaId)
  formData.append("name", value1)
  formData.append("toppings", toppingsArray.join(","))
  formData.append("price", value2)
  formData.append("picture", fileField!.files![0]);
  formData.append("link", pictureName)

  upload(formData);
   })

document.getElementById("clear-button")!.addEventListener("click",  () => {
(document.getElementById("name") as HTMLInputElement).value = "";
(document.getElementById("base") as HTMLInputElement).value = "";
(document.getElementById("top") as HTMLInputElement).value = "";
(document.getElementById("price") as HTMLInputElement).value = "";
(document.getElementById("image") as HTMLInputElement).value = "";
  })




//load pizzanames into Remove Pizza selector
  const getPizzaNames = async () => {
  
    const response = await http.get("http://localhost:3000/")
let html = ""
const result = PizzaSchema.array().safeParse(response.data)
for (let key in response.data){
  html +="<option value=" + key + ">" + response.data[key].name + "</option>"
}
document.getElementById("deletePizzaName")!.innerHTML = html
document.getElementById("updatePizzaName")!.innerHTML = html

    if (!result.success)
      pizzas = []
    else
    pizzas = result.data
  }
  getPizzaNames()



//update pizza

document.getElementById("uload-button")!.addEventListener("click", () => {
    let updateVal = document.getElementById("updatePizzaName") as HTMLSelectElement;
    let updateValue = updateVal.options[updateVal.selectedIndex].text;
    let pizzaPriceInputValue = (
      document.getElementById("updatePrice") as HTMLInputElement
    ).value;
  
    async function update(formData2: FormData) {
      try {
        const response = await http.patch("http://localhost:3000/update", formData2);
        const result = await response.data;
        console.log("Success:", result);
        let innerdiv = document.createElement("div");
        innerdiv.innerHTML = "<p>Pizza successfully updated!</p>";
        let sectionname = document.getElementById("updatePizza");
        sectionname!.appendChild(innerdiv);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    const formData2 = new FormData();
  
    const fileField = document.getElementById("uimage") as HTMLInputElement;
    const toppingsArray = [...document.querySelectorAll(".utoppings-form")]
      .filter((input) => input.checked)
      .map((input) => input.value);
    const pictureName = fileField!.files![0].name;
    formData2.append("id",""+lastPizzaId)
    formData2.append("name", updateValue);
    formData2.append("toppings", toppingsArray.join(","));
    formData2.append("price", pizzaPriceInputValue);
    formData2.append("picture", fileField!.files![0]);
    formData2.append("link", pictureName);
  
    update(formData2);
  });
  

//delete from json
  document.getElementById("delete-button")!.addEventListener("click",  () => {
    let deleteVal = document.getElementById("deletePizzaName") as HTMLSelectElement
    let deleteValue = deleteVal.options[deleteVal.selectedIndex].text

   async function del(deleteValue:string) {
        try {
          const response = await http.delete("http://localhost:3000/delete", {
        //headers: {"Content-Type": "text/plain"},
        headers: {'Content-Type': 'application/json'},
         data: {name: deleteValue }})
      const result = await response.data;
      console.log("Success:", result);
      let innerdiv = document.createElement("div");
      innerdiv.innerHTML = "<p>Pizza successfully deleted!</p>";
      let sectionname = document.getElementById("deletePizza");
      sectionname!.appendChild(innerdiv);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  del(deleteValue);
});
