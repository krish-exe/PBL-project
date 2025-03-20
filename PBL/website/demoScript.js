import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {databaseURL : "https://fir-project-c43ac-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings);
const db = getDatabase(app);
const plantsDB = ref(db,"plant");
let waterWindowAdded = false;

document.querySelector(".add_plant").addEventListener("click",AddWater)


function AddWater()
{
    if(document.getElementsByClassName("plant").length==0)
    {
        const waterWindow = document.createElement("div");
        waterWindow.classList.add("plant");

        waterWindow.innerHTML = 
        `
        <label for="amt">Enter Watering Amount: </label>
        <input type="number" id="amt" class="water_amt" name="amt"></input>ml
        <button class="add_schedule">Water Plant</button>
        `;
        document.querySelector("section").appendChild(waterWindow);
        document.querySelector(".add_schedule").addEventListener("click",SendWater);
    }

    
    
}

function SendWater()
{
    set(plantsDB,{amt:document.getElementById("amt").value});
}