defineVirtualDevice("Kitchen", {
  
 	cells: {
    	L1: {
			type: "switch",
			value: false
		},
		L2: {
			type: "switch",
			value: false
		},
    	Tamp: {
		type: "range",
	    value: 25,
        max: 28,
        min: 18
		},
    }
});


defineRule({    // Kitchen -1
  whenChanged: ["wb-mr6c-nc_109/Input 2","Kitchen/L1"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
     
     log("Kitchen newValue {} , devName {} , cellName {} ", newValue, devName, cellName ); 
 	
     if (devName =="Kitchen"){
    	 dev["wb-mr6c-nc_109/K2"] = !newValue;
       log("Kitchen -0 "); 
       return;
	  
     }	
     log("Kitchen -1 "); 
     
     if (newValue){
     dev["wb-mr6c-nc_109/K2"] = !dev["wb-mr6c-nc_109/K2"];
     log("Kitchen - 2 "); 
     	}  
     
     } 
});

defineRule({    // Kitchen-2
  whenChanged: ["wb-mr6c-nc_109/Input 4","Kitchen/L2"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
      
 	
     if (devName=="Kitchen"){
     dev["wb-mr6c-nc_109/K4"] = !newValue;
       return;
     }	
     
     
     if (newValue){
     dev["wb-mr6c-nc_109/K4"] = !dev["wb-mr6c-nc_109/K4"];
     }  
       
     } });






