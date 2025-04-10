import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,set,update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {databaseURL : "https://fir-project-c43ac-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings);
const db = getDatabase(app);
const plantsDB = ref(db);

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


            <div id="div_time ${plantCount}">
           
           
            
            </div>
             <button class="add_schedule" id="time ${plantCount}">Add New Time Slot</button>
            `;

        document.querySelector("section").appendChild(plant);
       
        document.getElementById(`time ${plantCount}`).addEventListener("click",CreateTime);
    }
}

function CreateTime()
{
    let currSchedNo = document.getElementById(`div_${document.activeElement.id}`).childElementCount+1;
    const timeBlock=document.createElement("div");
    timeBlock.classList.add("time_block");
    timeBlock.innerHTML=`
            <div class="water_time">
                <label for="watering_time_${currSchedNo}"><h3>Set Watering Time - ${currSchedNo} : </label> <input type="time" id="watering_time_${currSchedNo}" name="watering_time_${currSchedNo}" ></h3>
               
                
                <h4><label for="amt_${currSchedNo}">Amount: </label><input type="number" id="amt_${currSchedNo}" name="amt_${currSchedNo}" min="0" max="2000">ml</h4>
                

                
                <h4><input type="checkbox" id="use_moisture_${currSchedNo}" class="check" value="enable"> Moisture Level <input type="number" id="moist_lvl_${currSchedNo}" name="moist_level_${currSchedNo}" min="0" max="100" disabled>%</h4>
                <br>
                <div class="repeat_box">
                <h4>Repeat: </h4>
                <input type="checkbox" id="once${currSchedNo}" class="check"><label for="once" class="day">Only Once</label>
                <br>
                <input type="checkbox" id="m${currSchedNo}" class="check"><label for="m${currSchedNo}" class="day">M</label>
                <input type="checkbox" id="t${currSchedNo}" class="check"><label for="t${currSchedNo}" class="day">T</label>
                <input type="checkbox" id="w${currSchedNo}" class="check"><label for="w${currSchedNo}" class="day">W</label>
                <input type="checkbox" id="th${currSchedNo}" class="check"><label for="th${currSchedNo}" class="day">Th</label>
                <input type="checkbox" id="f${currSchedNo}" class="check"><label for="f${currSchedNo}" class="day">F</label>
                <input type="checkbox" id="s${currSchedNo}" class="check"><label for="s${currSchedNo}" class="day">S</label>
                <input type="checkbox" id="su${currSchedNo}" class="check"><label for="su${currSchedNo}" class="day">Su</label>
                </div>

                <button id="done${currSchedNo}" class="add_schedule">Done</button>
            </div>`

    document.getElementById(`div_${document.activeElement.id}`).appendChild(timeBlock);
    document.getElementById(`use_moisture_${currSchedNo}`).addEventListener("input",EnableMoist);
    
    document.getElementById(`once${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`m${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`t${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`w${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`th${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`f${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`s${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`su${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`done${currSchedNo}`).addEventListener("click",SendData);
    

}



function EnableMoist()
{
   
    if(document.getElementById(`moist_lvl_${document.activeElement.id.slice(13)}`).hasAttribute("disabled"))
    {
        console.log(document.getElementById(`moist_lvl_${document.activeElement.id.slice(13)}`).getAttribute("disabled") + "1");
        document.getElementById(`moist_lvl_${document.activeElement.id.slice(13)}`).removeAttribute("disabled");
    }
    else
    {
        console.log(document.getElementById(`moist_lvl_${document.activeElement.id.slice(13)}`).getAttribute("disabled") + "2");
        
        document.getElementById(`moist_lvl_${document.activeElement.id.slice(13)}`).setAttribute("disabled","true");
    }
}

function EnableTimed()
{
    console.log(document.getElementById(`${document.activeElement.id}`));
    if(document.getElementById(`watering_time_${document.activeElement.id.slice(9)}`).hasAttribute("disabled"))
        {
            
            document.getElementById(`watering_time_${document.activeElement.id.slice(9)}`).removeAttribute("disabled");
        }
        else
        {
            console.log(document.getElementById(`watering_time_${document.activeElement.id.slice(9)}`).getAttribute("disabled") + "2");
            
            document.getElementById(`watering_time_${document.activeElement.id.slice(9)}`).setAttribute("disabled","true");
        }
}

function DisableOption()
{
    console.log(document.activeElement.id);
    
    if(document.activeElement.id==`m${document.activeElement.id.slice(1)}`||document.activeElement.id==`t${document.activeElement.id.slice(1)}`||document.activeElement.id==`w${document.activeElement.id.slice(1)}`||document.activeElement.id==`th${document.activeElement.id.slice(2)}`||document.activeElement.id==`f${document.activeElement.id.slice(1)}`||document.activeElement.id==`s${document.activeElement.id.slice(1)}`||document.activeElement.id==`su${document.activeElement.id.slice(2)}`)
    {
        if(document.activeElement.id != `once${document.activeElement.id.slice(-1)}`)
        document.getElementById(`once${document.activeElement.id.slice(-1)}`).checked=false;
    }
    if(document.getElementById(`once${document.activeElement.id.slice(4)}`).checked)
    {
        document.getElementById(`m${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`t${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`w${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`th${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`f${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`s${document.activeElement.id.slice(4)}`).checked = false;
        document.getElementById(`su${document.activeElement.id.slice(4)}`).checked = false;
    }
}

function SendData()
{
    let id = document.activeElement.id.slice(-1);
    let p = ref(db,`${id}`);
    let time=document.getElementById(`watering_time_${id}`).value.split(":");
    if(document.getElementById(`amt_${id}`).value>0 && document.getElementById(`amt_${id}`).value<=2000)
    update(plantsDB,{[id]:{h:time[0],m:time[1],amt:document.getElementById(`amt_${id}`).value}});
    console.log(document.getElementById(`watering_time_${id}`).value);
    console.log(document.getElementById(`amt_${id}`).value);

    if(document.getElementById(`use_moisture_${id}`).checked && document.getElementById(`moist_lvl_${id}`).value>=0 && document.getElementById(`moist_lvl_${id}`).value<=100)
    {
        console.log(document.getElementById(`moist_lvl_${id}`).value);
        update(p,{lvl:document.getElementById(`moist_lvl_${id}`).value});
    }

    if(!document.getElementById(`once${id}`).checked)
    {
        console.log([document.getElementById(`m${id}`).checked,document.getElementById(`t${id}`).checked,document.getElementById(`w${id}`).checked,document.getElementById(`th${id}`).checked,document.getElementById(`f${id}`).checked,document.getElementById(`s${id}`).checked,document.getElementById(`su${id}`).checked]);
        update(p,{days:[document.getElementById(`m${id}`).checked,document.getElementById(`t${id}`).checked,document.getElementById(`w${id}`).checked,document.getElementById(`th${id}`).checked,document.getElementById(`f${id}`).checked,document.getElementById(`s${id}`).checked,document.getElementById(`su${id}`).checked]});
    }
    else
    {
            console.log("once");
            update(p,{days:""});
    }
    
}