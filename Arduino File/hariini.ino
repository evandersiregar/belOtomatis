#include <ESP8266HTTPClient.h>
#include <WiFiUdp.h>
#include <ESP8266WiFi.h>
#include <DFPlayer_Mini_Mp3.h>
#include <SoftwareSerial.h>
#include <WiFiManager.h> 

#define PIN_BUSY A0
SoftwareSerial mp3Serial(D3, D4); // RX, TX

// i2c
#include <LiquidCrystal_I2C.h> 
LiquidCrystal_I2C lcd(0x27, 16, 2);

//variable hostpot
//const char* ssid = "Una";
//const char* password = "33333333";

//var host server
const char* host = "belotomatis.my.id"; //ipserver

WiFiClient client;
HTTPClient http;


void setup() { 
  WiFi.mode(WIFI_STA);
  Serial.begin(115200);
  lcd.init();                 // Initialize 16x2 LCD Display
  lcd.backlight();

  //WiFi.Manager
   WiFiManager wm;
  bool res;

   res = wm.autoConnect("ESP8266","Ya123456"); // password protected ap

    if(!res) {
        Serial.println("Koneksi Gagal");
        // menampilkan ke lcd 
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Menghubungkan...");
        lcd.setCursor(0,1);
        lcd.print("  Koneksi gagal");
        // ESP.restart();
    } 
    else {
        //if you get here you have connected to the WiFi    
        Serial.println("Berhasil yeee :)");
        // menampikan ke lcd
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Menghubungkan...");
        lcd.setCursor(0,1);
        lcd.print("Koneksi Berhasil");
    }

 

    // set for dfplayer
    pinMode(PIN_BUSY, INPUT);
    Serial.println("Setting up software serial");
    mp3Serial.begin (9600);
    Serial.println("Setting up mp3 player");
    
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Setting up...");
    lcd.setCursor(0,1);
    lcd.print(" Tunggu 1 dtk...");
    
    mp3_set_serial (mp3Serial);  
    // Delay is required before accessing player. From my experience it's ~1 sec
    delay(1000); 
    mp3_set_volume (30);
  
}
// end setup

// melakukan get request ke server
String request(String data){
  const int httpPort = 80;
  if(!client.connect(host, httpPort)){
    Serial.println("Koneksi ke server bermasalah");
    return "bermasalah";
    }
    // Apabila berhasil 
    String link;
    link = "http://" + String(host) + "/"+ data +".php";
    //exe link
    http.begin(client, link);
    http.GET();

    //baca feedback
    String hasil = http.getString();
    http.end();
    return hasil;
}


String getSelanjutnya = request("jam_selanjutnya");
String selanjutnya = getSelanjutnya.substring(0,5);
String nama = getSelanjutnya.substring(11, getSelanjutnya.length());
int sound = getSelanjutnya.substring(6,10).toInt();

void updateSelanjutnya(){
  Serial.println("-- update jam selanjutnya --");
  getSelanjutnya = request("jam_selanjutnya");
  selanjutnya = getSelanjutnya.substring(0,5);
  nama = getSelanjutnya.substring(11, getSelanjutnya.length());
  sound = getSelanjutnya.substring(6,10).toInt();
  bool tidakAdaJamSelanjutnya = selanjutnya.compareTo("") == 0;
  bool bermasalah = selanjutnya.compareTo("berma") == 0;
  if( bermasalah ) {
    Serial.println("sedang bermasalah");
    selanjutnya = "~error jaringan~";
    updateSelanjutnya();
  }else if ( tidakAdaJamSelanjutnya ){
    Serial.println("Tidak ada jam selanjutnya");
  }
}

String getSekarang, namaSekarang, jamSekarang, hari;
void updateSekarang(){
  Serial.println("-- update jam sekarang --");
   getSekarang = request("jam_sekarang");
   hari = getSekarang.substring(0,4);
   jamSekarang = getSekarang.substring(4,9);
   namaSekarang = getSekarang.substring(10, getSekarang.length());
   bool bermasalah = getSekarang.compareTo("bermasalah") == 0;
   if(bermasalah){
    updateSekarang();
   }
}

void tampilkanLCD(){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(hari+" "+ jamSekarang + "~" + selanjutnya);
    lcd.setCursor(0,1);
    lcd.print(namaSekarang);
}

void bunyikan_bell(){
  Serial.println("Bel terbunyikan dgn sound:"+ sound);
// membunyikan speaker
  mp3_play(sound);
  selanjutnya="";
  tampilkanLCD();
  delay(60000);
  updateSekarang();

  // ATUR ULANG JAM
  updateSelanjutnya();
}


void loop() {
  
  updateSekarang();
  if(getSekarang.compareTo("bermasalah") != 0){
    tampilkanLCD();
  }

  Serial.println("sekarang: " + jamSekarang + "   selanjutnya: " + selanjutnya+ ", "+ nama +"  sounds :" + sound);

  if( jamSekarang.compareTo(selanjutnya) == 0 ){
    bunyikan_bell();
  }
  
  updateSelanjutnya();
  delay(4000);
  Serial.println("");

}
  
