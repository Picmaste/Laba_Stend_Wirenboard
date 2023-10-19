defineVirtualDevice("WC1_L1", {
  title: "Уборная",	
  cells: {
   	  switch: {
     		title: "Вкл/Выкл ",
          	type: "switch",
			value: false
		},
    }
});

defineVirtualDevice("WC1_L2", {
  title: "Уборная",	
  cells: {
   	  switch: {
     		title: "Вкл/Выкл ",
          	type: "switch",
			value: false
		},
    }
});

defineRule({    // WC1 -1
  whenChanged: ["wb-gpio/EXT1_IN1","WC1_L1/switch"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
      
 	
     if (devName=="WC1_L1"){
     dev["wb-mr6cu_32/K1"] = newValue;
       return;
     }	
     
     
     if (newValue){
     dev["wb-mr6cu_32/K1"] = !dev["wb-mr6cu_32/K1"];
     }  
       
     } });


defineRule({    // WC1 -2
  whenChanged: ["wb-gpio/EXT1_IN4","WC1_L2/switch"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
      
 	
     if (devName=="WC1_L2"){
     dev["wb-mr6cu_32/K2"] = newValue;
       return;
     }	
     
     
     if (newValue){
     dev["wb-mr6cu_32/K2"] = !dev["wb-mr6cu_32/K2"];
     }  
       
     } });






