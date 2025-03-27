import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {databaseURL : "https://fir-project-c43ac-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings);
const db = getDatabase(app);
const plantsDB = ref(db,"plant");

let plantCount=0;

document.querySelector(".add_plant").addEventListener("click",CreatePlant);
function CreatePlant()
{
    if(plantCount<2)
    {
        plantCount++;
        const plant = document.createElement("div");
        plant.classList.add("plant");
        plant.innerHTML=`<h2>Plant ${plantCount}</h2>

            <form action="" class="schedule_menu" id="schedule_${plantCount}">

            <div class="schedule">
            <h3>Schedule</h3>
                    <input type="radio" name="duration_${plantCount}" class="option" id="duration_${plantCount}" value="always">
                    <label for="duration">Always</label>
                    <input type="radio" name="duration_${plantCount}" class="option" id="seasonal_${plantCount}" value="seasonal">
                    <label for="seasonal">Seasonal</label>
            </div>
            <button class="add_schedule">Add New Schedule</button>
            <br>

            <div class="water_cycle">
            <h3>Water Cycle</h3>
                <label for="amt_${plantCount}">Amount: </label>
                <input type="number" id="amt_${plantCount}" name="amt_${plantCount}" min="0" max="2000">ml

                <h4>Water plants after soil dries</h4>
                <input type="radio" class="option" name="moist_${plantCount}" id="moist_yes_${plantCount}" value="yes">
                <label for="moist_yes_${plantCount}">YES</label>
                <input type="radio" class="option" name="moist_${plantCount}" id="moist_no_${plantCount}" value="no">
                <label for="moist_no_${plantCount}">NO</label>
                <br>

                <div class="moist_yes">
                    <label for="moist_lvl_${plantCount}">Moisture Level: </label>
                    <input type="number" id="moist_lvl_${plantCount}" name="moist_level_${plantCount}">%
                    <br>
                    <label for="moist_delay_${plantCount}">Delay: </label>
                    <input type="time" id="moist_delay_${plantCount}" name="moist_delay_${plantCount}">
                </div>
                <br>
                <div class="moist_no">
                    <label for="watering_time_${plantCount}">Watering Time: </label>
                    <input type="time" id="watering_time_${plantCount}" name="watering_time_${plantCount}">
                    <br>
                    <button>Add Watering Time</button>
                    <br>
                    <h4>Repeat Water Cycle</h4>
                    <input type="radio" name="repeat_${plantCount}" id="repeat_yes_${plantCount}" value="yes">
                    <label for="repeat_yes_${plantCount}">YES</label>
                    <div>
                        <label for="delay_${plantCount}">Delay: </label>
                        <input type="time" name="delay_${plantCount}" id="delay_${plantCount}">
                    </div>
                    <input type="radio" name="repeat_${plantCount}" id="repeat_no_${plantCount}" value="no">
                    <label for="repeat_no_${plantCount}">NO</label>
                </div>
            </div>

            </form>`;

        document.querySelector("section").appendChild(plant);
    }
}