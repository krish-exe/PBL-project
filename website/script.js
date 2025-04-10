import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,set,update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {databaseURL : "https://fir-project-c43ac-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings);
const db = getDatabase(app);


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


            <div id="div_time_${plantCount}">
           
           
            
            </div>
             <button class="add_schedule" id="time_${plantCount}">Add New Time Slot</button>
            `;

        document.querySelector("section").appendChild(plant);
       
        document.getElementById(`time_${plantCount}`).addEventListener("click",CreateTime);
    }
}

function CreateTime()
{
    const plantNum = document.activeElement.id.slice(-1);
    let currSchedNo = document.getElementById(`div_${document.activeElement.id}`).childElementCount+1;
    const timeBlock=document.createElement("div");
    timeBlock.classList.add("time_block");
    timeBlock.innerHTML=`
            <div class="water_time">
                <label for="${plantNum}watering_time_${currSchedNo}"><h3>Set Watering Time - ${currSchedNo} : </label> <input type="time" id="${plantNum}watering_time_${currSchedNo}" name="watering_time_${currSchedNo}" ></h3>
               
                
                <h4><label for="${plantNum}amt_${currSchedNo}">Amount: </label><input type="number" id="${plantNum}amt_${currSchedNo}" name="amt_${currSchedNo}" min="0" max="2000">ml</h4>
                

                
                <h4><input type="checkbox" id="${plantNum}use_moisture_${currSchedNo}" class="check" value="enable"> Moisture Level <input type="number" id="${plantNum}moist_lvl_${currSchedNo}" name="moist_level_${currSchedNo}" min="0" max="100" disabled>%</h4>
                <br>
                <div class="repeat_box">
                <h4>Repeat: </h4>
                <input type="checkbox" id="${plantNum}once${currSchedNo}" class="check"><label for="${plantNum}once" class="day">Only Once</label>
                <br>
                <input type="checkbox" id="${plantNum}m${currSchedNo}" class="check"><label for="${plantNum}m${currSchedNo}" class="day">M</label>
                <input type="checkbox" id="${plantNum}t${currSchedNo}" class="check"><label for="${plantNum}t${currSchedNo}" class="day">T</label>
                <input type="checkbox" id="${plantNum}w${currSchedNo}" class="check"><label for="${plantNum}w${currSchedNo}" class="day">W</label>
                <input type="checkbox" id="${plantNum}th${currSchedNo}" class="check"><label for="${plantNum}th${currSchedNo}" class="day">Th</label>
                <input type="checkbox" id="${plantNum}f${currSchedNo}" class="check"><label for="${plantNum}f${currSchedNo}" class="day">F</label>
                <input type="checkbox" id="${plantNum}s${currSchedNo}" class="check"><label for="${plantNum}s${currSchedNo}" class="day">S</label>
                <input type="checkbox" id="${plantNum}su${currSchedNo}" class="check"><label for="${plantNum}su${currSchedNo}" class="day">Su</label>
                </div>

                <button id="${plantNum}done${currSchedNo}" class="add_schedule">Done</button>
            </div>`

    document.getElementById(`div_${document.activeElement.id}`).appendChild(timeBlock);
    document.getElementById(`${plantNum}use_moisture_${currSchedNo}`).addEventListener("input",EnableMoist);
    
    document.getElementById(`${plantNum}once${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}m${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}t${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}w${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}th${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}f${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}s${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}su${currSchedNo}`).addEventListener("input",DisableOption);
    document.getElementById(`${plantNum}done${currSchedNo}`).addEventListener("click",SendData);
    

}



function EnableMoist()
{
   
    if(document.getElementById(`${document.activeElement.id.slice(0,1)}moist_lvl_${document.activeElement.id.slice(-1)}`).hasAttribute("disabled"))
    {
        
        document.getElementById(`${document.activeElement.id.slice(0,1)}moist_lvl_${document.activeElement.id.slice(-1)}`).removeAttribute("disabled");
    }
    else
    {
        
        
        document.getElementById(`${document.activeElement.id.slice(0,1)}moist_lvl_${document.activeElement.id.slice(-1)}`).setAttribute("disabled","true");
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
    
    if(document.activeElement.id==`${document.activeElement.id.slice(0,1)}m${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}t${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}w${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}th${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}f${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}s${document.activeElement.id.slice(-1)}`||document.activeElement.id==`${document.activeElement.id.slice(0,1)}su${document.activeElement.id.slice(-1)}`)
    {
        if(document.activeElement.id != `${document.activeElement.id.slice(0,1)}once${document.activeElement.id.slice(-1)}`)
        document.getElementById(`${document.activeElement.id.slice(0,1)}once${document.activeElement.id.slice(-1)}`).checked=false;
    }
    if(document.getElementById(`${document.activeElement.id.slice(0,1)}once${document.activeElement.id.slice(-1)}`).checked)
    {
        document.getElementById(`${document.activeElement.id.slice(0,1)}m${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}t${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}w${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}th${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}f${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}s${document.activeElement.id.slice(-1)}`).checked = false;
        document.getElementById(`${document.activeElement.id.slice(0,1)}su${document.activeElement.id.slice(-1)}`).checked = false;
    }
}

function SendData()
{
   
    const id1 = document.activeElement.id.slice(-1);
    const id0 = document.activeElement.id.slice(0,1);
    const plantsDB = ref(db,`plant${document.getElementById(`${id0}watering_time_${id1}`).parentElement.parentElement.parentElement.parentElement.parentElement.id.slice(-1)}`);
    const p = ref(db,`plant${document.getElementById(`${id0}watering_time_${id1}`).parentElement.parentElement.parentElement.parentElement.parentElement.id.slice(-1)}/${id1}`);
    let time=document.getElementById(`${id0}watering_time_${id1}`).value.split(":");
    if(document.getElementById(`${id0}amt_${id1}`).value>0 && document.getElementById(`${id0}amt_${id1}`).value<=2000)
    update(plantsDB,{[id1]:{h:time[0],m:time[1],amt:document.getElementById(`${id0}amt_${id1}`).value}});
    console.log(document.getElementById(`${id0}watering_time_${id1}`).value);
    console.log(document.getElementById(`${id0}amt_${id1}`).value);

    if(document.getElementById(`${id0}use_moisture_${id1}`).checked && document.getElementById(`${id0}moist_lvl_${id1}`).value>=0 && document.getElementById(`${id0}moist_lvl_${id1}`).value<=100)
    {
        console.log(document.getElementById(`${id0}moist_lvl_${id1}`).value);
        update(p,{lvl:document.getElementById(`${id0}moist_lvl_${id1}`).value});
    }

    if(!document.getElementById(`${id0}once${id1}`).checked)
    {
        console.log([document.getElementById(`${id0}m${id1}`).checked,document.getElementById(`${id0}t${id1}`).checked,document.getElementById(`${id0}w${id1}`).checked,document.getElementById(`${id0}th${id1}`).checked,document.getElementById(`${id0}f${id1}`).checked,document.getElementById(`${id0}s${id1}`).checked,document.getElementById(`${id0}su${id1}`).checked]);
        update(p,{days:[document.getElementById(`${id0}m${id1}`).checked,document.getElementById(`${id0}t${id1}`).checked,document.getElementById(`${id0}w${id1}`).checked,document.getElementById(`${id0}th${id1}`).checked,document.getElementById(`${id0}f${id1}`).checked,document.getElementById(`${id0}s${id1}`).checked,document.getElementById(`${id0}su${id1}`).checked]});
    }
    else
    {
            console.log("once");
            update(p,{days:""});
    }
    
}