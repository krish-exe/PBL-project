#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

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

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;
volatile bool updated = false;
volatile int wait = 0;
int led=2;
int waterAmt;


void streamCallback(FirebaseStream data)
{
  Serial.printf("sream path, %s\nevent path, %s\ndata type, %s\nevent type, %s\n\n",
                data.streamPath().c_str(),
                data.dataPath().c_str(),
                data.dataType().c_str(),
                data.eventType().c_str());
  printResult(data); // see addons/RTDBHelper.h
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
  pinMode(led,OUTPUT);
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
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  stream.keepAlive(5, 5, 1);

   if (!Firebase.RTDB.beginStream(&stream, "/plant"))
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

void loop()
{
  
 
  if(updated)
  {
    updated=false;
    if(Firebase.RTDB.getString(&fbdo,"plant/delay"))
    {
      wait = fbdo.stringData().toInt();
    }
    else
    {
      Serial.println(fbdo.errorReason());
    }

    if(Firebase.RTDB.getString(&fbdo,"plant/amt"))
    {
      waterAmt = fbdo.stringData().toInt();
      if(wait==0)
      {
        
        Serial.println(waterAmt);
        digitalWrite(led,HIGH);
        delay(waterAmt*1000);
        digitalWrite(led,LOW);
      }
      
    }
    else
    {
      Serial.println(fbdo.errorReason());
    }
  }

  if(wait>0)
  {
    Serial.println(wait);
    digitalWrite(led,HIGH);
    delay(waterAmt*1000);
    digitalWrite(led,LOW);
    delay(wait*1000);
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