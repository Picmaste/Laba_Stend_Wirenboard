	defineVirtualDevice("Hollway_L1", {
      
 	cells: {
    	switch: {
		type: "switch",
		value: false
		},
    }
});


defineRule({    // ХОЛЛ
  whenChanged: ["wb-mr6c-nc_109/Input 5","Hollway_L1/switch"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
      
     
     log(" Hallway_L1 - {} ",newValue);
     
     if (devName=="Hollway_L1"){
     dev["wb-mr6c-nc_109/K5"] = !newValue;
     return;
     }	
     
     if (newValue){
     dev["wb-mr6c-nc_109/K5"] = !dev["wb-mr6c-nc_109/K5"];
     dev["Hollway_L1/switch"] = dev["wb-mr6c-nc_109/K5"];
     }  
       
       
     } });
