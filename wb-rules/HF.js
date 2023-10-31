
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
        title: "Уставка температуры",
		type: "range",
	    value: 24,
        max: 32,
        min: 18

        },// range
      
        }  // calls  
});    //      floor_heating1

// Переменные 


var _fh_condition=dev["wb-w1/28-95e1ae2ecdff"];   // Текущее состояние  температуры
var _fh_frequency=5000;   // частота в мс.
var _fh_ON_OFF="floor_heating1/switch";  

var _fh_set=dev["floor_heating1/temp"];         // Уставка 
var _fh_delta=1;         // Delta
var timer_id = null;
var _fh_rele= "wb-mr6c-nc_109/K6";

//

function FH_RUN () {
  log("Проверка температуры тёплого пола  Температура = {}, Уставка = {} ", dev["wb-w1/28-95e1ae2ecdff"] ,_fh_set  );
  if  (dev["wb-w1/28-95e1ae2ecdff"]> _fh_set+_fh_delta) {
    log("Температура выше уставки, выключаем реле");
    dev[_fh_rele]=true;
    return;
    }
  if  ( dev["wb-w1/28-95e1ae2ecdff"] < _fh_set-_fh_delta) {
      dev[_fh_rele]=false;
      log("Температура ниже уставки, включаем реле");
      }
};

defineRule({
  whenChanged: _fh_ON_OFF,
 then: function (newValue, devName, cellName) {
    if (newValue) {
      log ("Включаем модуль тёплых полов");
      log(" Температура = {}, Уставка = {} ", _fh_condition ,_fh_set  );
      timer_id = setInterval(FH_RUN,_fh_frequency);
      return;
    }

    log ("Выключаем модуль тёплых полов");
       dev[_fh_rele]=true;
        clearTimeout (timer_id);
 }
 });



