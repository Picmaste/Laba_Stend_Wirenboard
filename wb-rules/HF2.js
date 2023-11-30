//////////////////////////////////////////////////////////////////////////
//
// Создание виртулалных драйверов для взаимодействия с Wevo
//
//  Модуль тёплых полов 
//
////////////////////////////////////////////////////////////////////////////////////

defineVirtualDevice("floor_heating2",  {
  
    title: "Тёплый пол в ванной",
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
  
  var _fh_namber="ванной";
  var _fh_condition="wb-w1/28-d8e1ae2d89ff";   // Текущее состояние  температуры
  var _fh_frequency=10000;   // частота в мс.
  var _fh_ON_OFF="floor_heating2/switch";  
  
  var _fh_set="floor_heating2/temp";         // Уставка 
  var _fh_delta=1;         // Delta
  var timer_id = null;
  var _fh_rele= "wb-mr6cu_34/K3";
	
  
  //
  
  

  defineRule({
    whenChanged: _fh_ON_OFF,
   then: function (newValue, devName, cellName) {
      if (newValue) {
        log ("Включаем модуль тёплых полов в {} , Температура  = {}, Уставка = {}  ",_fh_namber,dev[_fh_condition], dev[_fh_set] );
        
       timer_id = setInterval(function () {
          log("Проверка температуры тёплого пола в  {},  Температура = {}, Уставка = {} ",_fh_namber , dev[_fh_condition],dev[_fh_set]  );
           if  (dev[ _fh_condition ] > dev[_fh_set]+_fh_delta) {
            log("Температура в {} выше уставки, выключаем реле ", _fh_namber);
            dev[_fh_rele]=false;
            return;
            }
          if  ( dev[ _fh_condition ] < dev[_fh_set]-_fh_delta) {
              dev[_fh_rele]=true;
              log("Температура в {} ниже уставки, включаем реле", _fh_namber);
              }
        },_fh_frequency);

        return;
      }
  
      log ("Выключаем модуль тёплых полов  в {}", _fh_namber);
         dev[_fh_rele]=false;
          clearTimeout (timer_id);
   }
   });
  
  
  
  