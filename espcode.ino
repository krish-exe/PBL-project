#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "time.h"
//Provide the token generation process info.
//#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
//#include "addons/RTDBHelper.h"

#define WIFI_SSID "oneplusnord2"
#define WIFI_PASSWORD "7710990201"
// Insert Firebase project API Key
#define API_KEY "AIzaSyAhKSop_2LjCHsptsvoikuLIkFa6oc6wBM"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://fir-project-c43ac-default-rtdb.asia-southeast1.firebasedatabase.app/" 

FirebaseData stream;
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

const long gmtOffset_sec = 19800;  // IST = UTC +5:30 = 5*3600 + 30*60
const int daylightOffset_sec = 0;
const char* ntpServer = "pool.ntp.org";

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;
volatile bool updated = false;
volatile int wait = 0;
int p1=12;
int p2=13;
int s1=34;
int s2=35;
int waterAmt;


void streamCallback(FirebaseStream data)
{
  Serial.printf("sream path, %s\nevent path, %s\ndata type, %s\nevent type, %s\n\n",
                data.streamPath().c_str(),
                data.dataPath().c_str(),
                data.dataType().c_str(),
                data.eventType().c_str());
  //printResult(data); // see addons/RTDBHelper.h
  Serial.println();

  // This is the size of stream payload received (current and max value)
  // Max payload size is the payload size under the stream path since the stream connected
  // and read once and will not update until stream reconnection takes place.
  // This max value will be zero as no payload received in case of ESP8266 which
  // BearSSL reserved Rx buffer size is less than the actual stream payload.
  Serial.printf("Received stream payload size: %d (Max. %d)\n\n", data.payloadLength(), data.maxPayloadLength());

  // Due to limited of stack memory, do not perform any task that used large memory here especially starting connect to server.
  // Just set this flag and check it status later.
  updated = true;
}
void streamTimeoutCallback(bool timeout)
{
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream.httpCode(), stream.errorReason().c_str());
}

void setup()
{

  Serial.begin(115200);
  pinMode(p1,OUTPUT);
  pinMode(p2,OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("ok");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  //config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  stream.keepAlive(5, 5, 1);

   if (!Firebase.RTDB.beginStream(&stream, "/"))
    Serial.printf("stream begin error, %s\n\n", stream.errorReason().c_str());

  Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);

  /** Timeout options, below is default config.

  //Network reconnect timeout (interval) in ms (10 sec - 5 min) when network or WiFi disconnected.
  config.timeout.networkReconnect = 10 * 1000;

  //Socket begin connection timeout (ESP32) or data transfer timeout (ESP8266) in ms (1 sec - 1 min).
  config.timeout.socketConnection = 30 * 1000;

  //ESP32 SSL handshake in ms (1 sec - 2 min). This option doesn't allow in ESP8266 core library.
  config.timeout.sslHandshake = 2 * 60 * 1000;

  //Server response read timeout in ms (1 sec - 1 min).
  config.timeout.serverResponse = 10 * 1000;

  //RTDB Stream keep-alive timeout in ms (20 sec - 2 min) when no server's keep-alive event data received.
  config.timeout.rtdbKeepAlive = 45 * 1000;

  //RTDB Stream reconnect timeout (interval) in ms (1 sec - 1 min) when RTDB Stream closed and want to resume.
  config.timeout.rtdbStreamReconnect = 1 * 1000;

  //RTDB Stream error notification timeout (interval) in ms (3 sec - 30 sec). It determines how often the readStream
  //will return false (error) when it called repeatedly in loop.
  config.timeout.rtdbStreamError = 3 * 1000;

  */
}

struct tm timeinfo;
char timeStr[9];
int currentDay;

int amts1[10], lvls1[10],len1;
bool dayS1[10][7];
String dayType1[10],hs1[10], ms1[10];

int amts2[10], lvls2[10],len2;
bool dayS2[10][7];
String dayType2[10], hs2[10], ms2[10];


void loop()
{
  
 /* if (Firebase.RTDB.getJSON(&fbdo, "/plant1")) 
  {
      FirebaseJson &plant = fbdo.jsonObject();
      Serial.println(plant.get(1,));
      

  }
  else 
  {
    Serial.println(fbdo.errorReason());
  }*/
  
  const int dryValue1 = 3600;  // sensor1 value in dry soil
const int wetValue1 = 1500;  // sensor1 value in water

const int dryValue2 = 3600;  // sensor2 value in dry soil
const int wetValue2 = 1500;  // sensor2 value in water

int raw1 = analogRead(s1);
int raw2 = analogRead(s2);

int moisture1 = map(raw1, dryValue1, wetValue1, 0, 100);
moisture1 = constrain(moisture1, 0, 100);

int moisture2 = map(raw2, dryValue2, wetValue2, 0, 100);
moisture2 = constrain(moisture2, 0, 100);
  
  if (getLocalTime(&timeinfo)) 
  {
    currentDay = timeinfo.tm_wday;
    sprintf(timeStr, "%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min);
    Serial.println(timeStr);
  } 
  else 
  {
    Serial.println("Failed to get time");
  }
 
  if(updated)
  {
    Serial.print("update");
    updated=false;
      int n=1;
  while(Firebase.RTDB.getJSON(&fbdo, "/plant1/"+String(n)))
  {
    FirebaseJson plant = fbdo.jsonObject();
    FirebaseJsonData result;

    plant.get(result,"/amt");
    String amt = result.type;
    amts1[n-1] = result.stringValue.toInt();

    plant.get(result, "/h");
    String h = result.stringValue;
    hs1[n-1] = result.stringValue;

    plant.get(result,"/m");
    String m = result.stringValue;
    ms1[n-1] = result.stringValue;

    plant.get(result,"/lvl");
    String lvl = result.stringValue;
    lvls1[n-1] = result.stringValue.toInt();

    plant.get(result,"/days");
    dayType1[n-1] = result.type;
    plant.get(result, "days");
if (result.type == "array") {
  FirebaseJsonArray arr;
  result.get(arr);  // extract array from result

  for (int i = 0; i < arr.size(); i++) {
    FirebaseJsonData val;
    arr.get(val, i);
    dayS1[n - 1][i] = val.boolValue; // assuming array contains booleans
    Serial.println(val.boolValue);   // print each value
  }
}
    
    n++;


  }
  len1=n;
  int m = 1;
   // --- Plant 2 ---
while (Firebase.RTDB.getJSON(&fbdo, "/plant2/" + String(m))) {
  FirebaseJson plant = fbdo.jsonObject();
  FirebaseJsonData result;

  plant.get(result, "/amt");
  String amt = result.type;
  amts2[m - 1] = result.stringValue.toInt();

  plant.get(result, "/h");
  String h = result.stringValue;
  hs2[m - 1] = result.stringValue;

  plant.get(result, "/m");
  String min = result.stringValue;
  ms2[m - 1] = result.stringValue;

  plant.get(result, "/lvl");
  String lvl = result.stringValue;
  lvls2[m - 1] = result.stringValue.toInt();

  plant.get(result, "/days");
  dayType2[m - 1] = result.type;
  plant.get(result, "days");
  if (result.type == "array") {
    FirebaseJsonArray arr;
    result.get(arr);

    for (int i = 0; i < arr.size(); i++) {
      FirebaseJsonData val;
      arr.get(val, i);
      dayS2[m - 1][i] = val.boolValue;
      Serial.println(val.boolValue);
    }
  }

  m++;
}

  len2=m;
    
  }

  
    for(int i=0; i<len1;i++)
    {
      if(dayType1[i] != "string")
      {  
        for(int j=0;j<7;j++)
        {
          
          if(dayS1[i][j]==1 && currentDay==j)
          {
            Serial.println("day check1");
            Serial.println((String(hs1[i])+":"+String(ms1[i])+"--"+timeStr));

            if(hs1[i]+":"+ms1[i]==timeStr)
            {
              if(lvls1[i]!=-1)
              {
                Serial.println("time check2");
                if(lvls1[i]>=moisture1)
                {
                  digitalWrite(p1,HIGH);
                  delay(amts1[i]*67);
                  digitalWrite(p1,LOW);
                }
              }
              else
              {
                  digitalWrite(p1,HIGH);
                  delay(amts1[i]*67);
                  digitalWrite(p1,LOW);
              }
            }
            
          }
        }
      }
      else
      {
        if(hs1[i]+":"+ms1[i]==timeStr)
        {
          if(lvls1[i]!=-1)
          {
            if(lvls1[i]>=moisture1)
            digitalWrite(p1,HIGH);
                  delay(amts1[i]*67);
                  digitalWrite(p1,LOW);
          }
          else
          {
           digitalWrite(p1,HIGH);
                  delay(amts1[i]*67);
                  digitalWrite(p1,LOW);
          }
          
        }
      }
    }
    
    for(int i=0; i<len2;i++)
    {
      if(dayType2[i] != "string")
      {  
        for(int j=0;j<7;j++)
        {
          
          if(dayS2[i][j]==1 && currentDay==j)
          {
            Serial.println("day check2");
            Serial.println((String(hs2[i])+":"+String(ms2[i])+"--"+timeStr));

            if(hs2[i]+":"+ms2[i]==timeStr)
            {
              if(lvls2[i]!=-1)
              {
                if(lvls2[i]>=moisture2)
                {
                  digitalWrite(p2,HIGH);
                  delay(amts2[i]*67);
                  digitalWrite(p2,LOW);
                }
              }
              else
              {
               
                  digitalWrite(p2,HIGH);
                  delay(amts2[i]*67);
                  digitalWrite(p2,LOW);
              }
            }
            
          }
        }
      }
      else
      {
        if(hs2[i]+":"+ms2[i]==timeStr)
        {
          if(lvls2[i]!=-1)
          {
            if(lvls2[i]>=moisture2)
            {
              
                  digitalWrite(p2,HIGH);
                  delay(amts2[i]*67);
                  digitalWrite(p2,LOW);
            }
            Serial.println("time check2");
          }

          else
          {
            
                  digitalWrite(p2,HIGH);
                  delay(amts2[i]*67);
                  digitalWrite(p2,LOW);
          }
              
        }
      }
    }

  

   if (!stream.httpConnected())
  {
    // Server was disconnected!
    Serial.println("AAAAAAAAAAAAAAAA");
  }


  /*if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();
    if(Firebase.RTDB.getString(&fbdo,"plant/amt"))
    {
      int waterAmt = fbdo.stringData().toInt();
      Serial.println(waterAmt);
    }
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }*/
}


void printAllPlantData() {
  Serial.println("--- Plant 1 Data ---");
  for (int i = 0; i < len1; i++) {
    Serial.print("Plant1 #"); Serial.println(i + 1);
    Serial.print("Amt: "); Serial.println(amts1[i]);
    Serial.print("H: "); Serial.println(hs1[i]);
    Serial.print("M: "); Serial.println(ms1[i]);
    Serial.print("Lvl: "); Serial.println(lvls1[i]);
    Serial.print("Days: ");
    for (int j = 0; j < 7; j++) {
      Serial.print(dayS1[i][j]); Serial.print(" ");
    }
    Serial.println("\n");
  }

  Serial.println("--- Plant 2 Data ---");
  for (int i = 0; i < len2; i++) {
    Serial.print("Plant2 #"); Serial.println(i + 1);
    Serial.print("Amt: "); Serial.println(amts2[i]);
    Serial.print("H: "); Serial.println(hs2[i]);
    Serial.print("M: "); Serial.println(ms2[i]);
    Serial.print("Lvl: "); Serial.println(lvls2[i]);
    Serial.print("Days: ");
    for (int j = 0; j < 7; j++) {
      Serial.print(dayS2[i][j]); Serial.print(" ");
    }
    Serial.println("\n");
  }
}
