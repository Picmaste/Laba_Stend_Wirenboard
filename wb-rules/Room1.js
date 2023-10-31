//////////////////////////////////////////////////////////////////////////
//
// Создание виртулалных драйверов для взаимодействия с Wevo
//
////////////////////////////////////////////////////////////////////////////////////

defineVirtualDevice("Room1_L2",  {
  
  title: "Гостинная Димируемая подсветка ",
 	cells: {
    
      switch: {
        title: "ON/OFF",
		type: "switch",
		value: false

        },// switch
      dim: {
        title: "Яркость",
		type: "range",
	    value: 10,
        max: 100,
        min: 1

        },// Dimm
      
        }  // calls  
});    //      Room1_L2
     
defineVirtualDevice("Room1_L1",  {
  title: "Гостинная основной свет",
 	cells: {
    
      switch: {
        title: "ON/OFF",
		type: "switch",
		value: false
        },// switch
        }  // calls  
});    //      Room1_L1

        
defineVirtualDevice("Room1_roll",  {
  title: "Гостинная Шторы ",
 	cells: {
    
      tag: {
        title: "tag",
		    type: "range",
	      value: 55,
        max: 100,
        min: 1
        },// tag
      
      up: {
        title: "Roll UP",
		    type: "switch",
		    value: false
        },// up
      stop: {
        title: "Roll STOP",
		    type: "switch",
		value: false
        },//stop
      dn: {
        title: "Roll DN",
		type: "switch",
		value: false
        },// dn
      
      delay_Timer: {
        title: "Delay",
			type: "range",
	    value: 20,
        max: 30,
        min: 10
        },// delay_Timer
            
     }  // calls  
});    //      Room1_L2




/////

 	var f_button_press= false;
 	var timer2s_up = false; 
 	var timer_id = null; 
	var Timer_2s_id = null; 
	var  timer_1s_id= null; 

	var device_roll = "wb-mr6cu_32"; 
	var rele_up = "K5"
	var rele_dn = "K6"
	var no_dubl = 0;
    
   var device_input_button_up = "wb-gpio/EXT1_IN6";
	var device_input_button_dn = "wb-gpio/EXT1_IN7"
	
    var roll_condition=dev["Room1_roll/tag"];
   // var delay_Timer=20;  // время хода штор 
    
	var _Room_tag = "Room1_roll/tag";
	var _Room_stop = "Room1_roll/stop";
	var _Room_dn = "Room1_roll/dn";
	var _Room_up = "Room1_roll/up";

	
	var _Room = "Room1_roll";
	var _Room_delay = "Room1_roll/delay_Timer";



    //**
    
    defineRule({
    whenChanged: _Room_tag,
   then: function (newValue, devName, cellName) {
		
		log("Room_roll/tag    старт");
         if (dev[device_input_button_dn] || dev[device_input_button_up] ){
         log("Room/rool_stop  - Нажата одна из кнопок");
           return;
		}
       	
     timer2s_up = false;
		 if ( roll_condition  > newValue ) { // Проверяем куда бечь .
			log(" Проверяем куда бечь - Уставка меньше текущего значения, открываем шторы  ,roll_condition= {}, newValue= {}, delay_Timer= {} , Ttimer = {}" ,roll_condition,newValue,dev[_Room_delay],((roll_condition - newValue )* dev[_Room_delay]*10) );
           // Уставка меньше текущего значения 
			//  открываем шторы 
		 
           dev[device_roll][rele_up] =  true;
			dev[device_roll][rele_dn] =  false;
		
           timer_id=setTimeout(function () {
             log("Room_roll/tag   stop  UP");
			 dev[device_roll][rele_up]  = false;
             roll_condition=newValue;
             log(" Текущее состояние  ,roll_condition= {}",roll_condition);
          
		     },((roll_condition - newValue )* dev[_Room_delay]*10));
		  }	//if 
		else 		{
			// else 
			// Уставка большe текущего значения 
			//  закрываем  шторы 
			//dev[_Room][delay_Timer]
          //dev["Room1_roll/delay_Timer"]
          log("Room_roll/tag   start  DN,roll_condition= {}, newValue= {}, Room_roll/delay_Timer= {} , Ttimer = {}",roll_condition,newValue,dev[_Room_delay],((newValue- roll_condition)* dev[_Room_delay]*10) );
          dev[device_roll][rele_dn] =  true;
           dev[device_roll][rele_up] =  false;
		
		timer_id=setTimeout(function () {
          log("Room1_roll/tag   stop  DN");
			 dev[device_roll][rele_dn]  = false;
			roll_condition=newValue;        
          log(" Текущее состояние  ,roll_condition= {}",roll_condition);
          
			},((newValue - roll_condition)* dev[_Room_delay]*10)); 
         }	 
   
        }   
    });
    
    
    //**
    
    defineRule({
    whenChanged: _Room_stop,
   then: function (newValue, devName, cellName) {
     if (newValue) {
       log("Room1/rool_stop");
         dev["Room1/rool_stop"] = false;
         if (dev[device_input_button_dn] || dev[device_input_button_up] ){
         log("Room1/rool_stop  - Нажата одна из кнопок");
           return;
         }   
     
      	dev[device_roll][rele_dn] =  false;
      	dev[device_roll][rele_up] =  false;
       	timer2s_up = false;
		clearTimeout(timer_id);
      }   
   }   
  });

  defineRule({
    whenChanged: _Room_up,
   then: function (newValue, devName, cellName) {
    	
     if (newValue) {
         log("Room1_roll/up  - start ");
       	dev["Room1_roll/up"] = false;
         
       if ( dev[device_input_button_up] || dev[device_input_button_dn] ) {

         log("Room1_roll/up  - button press  ");
           return;
         }   
      if (dev[device_roll][rele_up] ){  // шторы и так открываються .
        log("Room1_roll/up  - шторы и так открываються .  ");
        return; 				  //  ничего не делаем .
         }   

      if (dev[device_roll][rele_dn] ){  // шторы закрываються
		      	dev[device_roll][rele_dn]  =false;   //     останавливаем  закрытие штор    
      	
        		clearTimeout(timer_id);
        		timer2s_up = false;
        log("Room1_roll/up  - останавливаем  закрытие штор  ");
       	}   
       log("Room1_roll start up, timer= {},Room_roll/delay_Timer = {} , roll_condition= {}",(roll_condition* dev[_Room_delay]*10),dev[_Room_delay],roll_condition);
       dev[device_roll][rele_up] = true;  //
       timer_id=setTimeout(function () {
          roll_condition=0;
         dev[_Room_tag]=0;
		 dev[device_roll][rele_up]  = false;
	 	 },roll_condition*dev[_Room_delay]*10);
	}
   }   
  });

  defineRule({
    whenChanged: _Room_dn,
   then: function (newValue, devName, cellName) {
     if (newValue) {
        log("Room1_roll/dn start ");
       	dev["Room1_roll/dn"] = false;
         if (dev[device_input_button_dn] || dev[device_input_button_up] ){  // Если нажаты кнопки , ничего не делае. 
        log("Room1_roll/dn -нажата одна из кнопок ");
           return;
         }   
      if (dev[device_roll][rele_dn] ){  // шторы и так закрываються.
        log("Room1_roll/dn   шторы и так закрываються"); 
        return; 				  //  ничего не делаем .
         }   

      if (dev[device_roll][rele_up]){  // шторы открываються
		      	dev[device_roll][rele_up] = false;   //        
      			clearTimeout(timer_id);
      			timer2s_up = false;
          }   
     log("Room1_roll start up, timer= {},dev[Room1_roll/delay_Timer] = {} , roll_condition= {}",((100-roll_condition)* dev[_Room_delay]*10),dev[_Room_delay],roll_condition);
       dev[device_roll][rele_dn] = true;  //
      timer_id=setTimeout(function () {
		dev[device_roll][rele_dn] = false;
        roll_condition=100;
        dev[_Room_tag]=100;
	 	 },(100-roll_condition)*dev[_Room_delay]*10 );
	}
   }   
  });

///
  
defineRule("UP", {	
  	whenChanged:   device_input_button_up, 
    then: function (newValue, devName, cellName) {
    
      log("Room1_roll press up, timer= {},dev[Room1_roll/delay_Timer] = {} , roll_condition= {}",((100-roll_condition)* dev[_Room_delay]*10),dev[_Room_delay],roll_condition);
	
     if (newValue){   // кнопку нажали 
		log("Press button UP  "); // вывод сообщения в лог 
      
			if (dev[device_roll][rele_dn]){   //проверка на работу двигателя в противофазе .
				log("проверка на работу двигателя в противофазе - 1 "); // вывод сообщения в лог 
      			dev[device_roll][rele_dn]= false;  // Отключили двигатель на закрывание 
				f_button_press=true;							//взвели флаг на ожидание отпускания кнопки .
	 			clearTimeout(timer_id);
      			clearTimeout( timer_1s_id);
        		timer2s_up = false;
    			log("проверка на работу двигателя в противофазе - 2 "); // вывод сообщения в лог 
    	    	return;
  			  	}

			if (dev[device_roll][rele_up]){   //проверка на работу двигателя в ту же сторону.
				log("проверка на работу двигателя в ту же сторону. - 1 "); // вывод сообщения в лог 
      			dev[device_roll][rele_up] = false;  	// Отключили двигатель на открытие 
				f_button_press=true;							//взвели флаг на ожидание отпускания кнопки .
				clearTimeout(timer_id);
      			clearTimeout( timer_1s_id);
      			timer2s_up = false;
				log("проверка на работу двигателя в ту же сторону. - 1 "); // вывод сообщения в лог 
      			return;
				}
	
       
       if (roll_condition < 1) {
       roll_condition=0;
         return;
       }
     
    	dev[device_roll][rele_dn] = false;  // запустили привод на открытие 
		dev[device_roll][rele_up] = true;  // запустили привод на открытие 
	
    	timer_1s_id= setInterval(function () {
	 			roll_condition=roll_condition - (100/dev[_Room_delay] ); 
      			log("UP Roll_condition= {}",roll_condition);
        }, 1000);
	
      
      	timer2s_up=true;
	 	timer_2s_id=setTimeout(function () {
			 timer2s_up = false;
		}, 1500);
	
	 	timer_id=setTimeout(function () {
			dev[device_roll][rele_up] = false;
       		clearTimeout(timer_1s_id);
            roll_condition=0;
	 	 },((roll_condition)* dev[_Room_delay]*10)); 
	}
          
	else  {   // кнопку отпустили 
		
      	
      log("Room1_Release press up, timer= {},dev[Room1_roll/delay_Timer] = {} , roll_condition= {}",((100-roll_condition)* dev[_Room_delay]*10),dev[_Room_delay],roll_condition);
      
	if (f_button_press){      // 
		f_button_press=false;
      	log("f_button_press=false");
		}
	else{ 
		if (!timer2s_up){  	// 
			dev[device_roll][rele_up] = false;	//  кнопку отпустили через 2  сек.
			clearTimeout(timer_id);
          	clearTimeout(timer_1s_id);
          log("кнопку отпустили через 2  сек");								// Откл. привод
		}
		else{
				timer2s_up=false;
         	}
	}	
}
	
      }
    });
	
    	
defineRule("DN", {	

	whenChanged: device_input_button_dn,
    then: function (newValue, devName, cellName) {
    
	
	if (newValue){   // кнопку нажали 
	log("Press button DN  "); // вывод сообщения в лог 
      
	if (dev[device_roll][rele_up]){   //проверка на работу двигателя в противофазе .
		dev[device_roll][rele_up]= false;  // Отключили двигатель на закрывание 
	 clearTimeout(timer_1s_id);
      f_button_press=true;							//взвели флаг на ожидание отпускания кнопки .
		log("wb-mr6cu_32/K5 - is work ");
    	clearTimeout(timer_id);
        timer2s_up = false;
      return;

    }

	if (dev[device_roll][rele_dn]){   //проверка на работу двигателя в ту же сторону.
		dev[device_roll][rele_dn] = false;  	// Отключили двигатель на открытие 
		f_button_press=true;							//взвели флаг на ожидание отпускания кнопки .
		log("dev[device_roll][rele_dn]- is work ");
    	clearTimeout(timer_id);
       clearTimeout(timer_1s_id);
      timer2s_up = false;
      return;
	}
      
      
	 timer_1s_id= setInterval(function () {
		roll_condition=roll_condition + (100/dev[_Room_delay] )  ; 
     }, 1000);
      
      
 
       if (roll_condition > 99) {
       		roll_condition=100;
        	return;
       }
      
	dev[device_roll][rele_up] = false;
	dev[device_roll][rele_dn] = true;  // запустили привод на открытие 
      
     timer2s_up=true;
	 timer_2s_id=setTimeout(function () {
		 timer2s_up = false;
		}, 1500);
	
	 timer_id=setTimeout(function () {
		 dev[device_roll][rele_dn] = false;
    	 clearTimeout(timer_1s_id);
       roll_condition=100;   
	 	 },((100 - roll_condition)* dev[_Room_delay]*10));
	}
          
	else  {   // кнопку отпустили 
		
      	log("Release button DN  ");
      
	if (f_button_press){      // 
		f_button_press=false;
      	log("f_button_press=false");
		}
	else{ 
		if (!timer2s_up){  	//    
			dev[device_roll][rele_dn] = false;	//  кнопку отпустили после 2  сек.
			clearTimeout(timer_id);
          clearTimeout(timer_1s_id);
          log("!timer2s_DN");								// Откл. привод
		}
		else{
			timer2s_up=false;
            }
		}	
	}
  }
});

/////

defineRule({  // Гостинная Подсветка 
   whenChanged:  ["wb-mdm3_23/Input 2","wb-mdm3_23/Input 1","Room1_L2/switch"], // правило сработает, когда значение параметра изменится на истинное 
  then: function (newValue, devName, cellName) {
  log("Log - Гостинная Подсветка devName= {} ,cellName= {} =, Value=  {}  ",devName,cellName,newValue);  
   
    
    if (devName=="Room1_L2") {
    dev["wb-mdm3_23/K1"] = newValue ;
	log("Log1 - devName= {} ,cellName= {} =, Value=  {}  ",devName,cellName,newValue);  
  
      return;   
    }
    
     if (!newValue){
       
       dev["Room1_L2/switch"]= dev["wb-mdm3_23/K1"];
       dev["Room1_L2/dim"]=dev ["wb-mdm3_23/Channel 1"]  ;
     }  // if
     
    
   }
});


defineRule({  // Гостинная Яркость Подсветки
   whenChanged:  ["wb-mdm3_23/Channel 1"], // правило сработает, когда значение параметра изменится на истинное 
  then: function (newValue, devName, cellName) {
   
    
    dev["Room1_L2/dim"]= newValue ;
       
   }
});




defineRule({  // Гостинная Яркость Подсветки
   whenChanged:  ["Room1_L2/dim"], // правило сработает, когда значение параметра изменится на истинное 
  then: function (newValue, devName, cellName) {
    
   dev["wb-mdm3_23/Channel 1"] = newValue ;
   
       
   }
});




defineRule({  //  Гостинная 
 whenChanged: ["wb-mr6c-nc_109/Input 1","Room1_L1/switch"],
   
  then: function (newValue, devName, cellName) {
   log("Log  -  Гостинная  -    devName {}   , cellName= {}    , Value  = {} ", devName , cellName , newValue );
   
    if (devName=="Room1_L1"){
      
    dev["wb-mr6c-nc_109/K1"] = !newValue ;
    log("Log 2  Гостинная  - devName =  {}, cellName =  {}, Value =  {} ",devName,cellName,newValue);
    return;
    }
    
    if (newValue) {
   dev["wb-mr6c-nc_109/K1"] = !dev["wb-mr6c-nc_109/K1"];
   dev["Room1_L1/switch"]=dev["wb-mr6c-nc_109/K1"];
      log("Log 3  Гостинная  - devName =  {}, cellName =  {}, Value =  {} ",devName,cellName,newValue);
    }
  }
  });


