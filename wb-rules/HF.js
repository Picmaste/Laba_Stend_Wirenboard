//////////////////////////////////////////////////////////////////////////
//
// Создание виртулалных драйверов для взаимодействия с Wevo
//
//  Модуль тёплых полов 
//
////////////////////////////////////////////////////////////////////////////////////




defineVirtualDevice("floor_heating1",  {
  
  title: "Тёплый пол на кухни",
 	cells: {
    
      switch: {
        title: "ON/OFF",
		  type: "switch",
		  value: false

        },// switch
      temp: {
        title: "температура",
		type: "range",
	    value: 24,
        max: 32,
        min: 18

        },// range
      
        }  // calls  
});    //      floor_heating1

// Переменные 


var _fh_condition=dev["/devices/wb-w1/controls/28-95e1ae2ecdff"];   // Текущее состояние  температуры
var _fh_frequency=1000;   // частота в мс.
var _fh_ON_OFF=dev["floor_heating1/switch"];  

var _fh_set=dev["floor_heating1/temp"];         // Уставка 
var _fh_delta=3;         // Delta
var timer_id = null;
var _fh_rele= dev["/devices/wb-mr6c-nc_109/controls/K6"];

//

function FH_RUN () {

  log("Проверка температуры тёплого пола ");
  if  (_fh_condition > _fh_set+_fh_delta) {
    log("Температура выше уставки, выключаем реле");
    _fh_rele=false;
    }
    (_fh_condition < _fh_set-_fh_delta) {
      _fh_rele=true;
      log("Температура ниже уставки, включаем реле");
      }
}/

defineRule({
  whenChanged: _fh_ON_OFF,
 then: function (newValue, devName, cellName) {

    if (newValue) {
      log ("Включаем модуль тёплых полов");
      timer_id= setInterval( FH_RUN , 1000);
      return;
    }

    сlearTimeout(timer_id);
    fh_rele=false;  
 }
 });

