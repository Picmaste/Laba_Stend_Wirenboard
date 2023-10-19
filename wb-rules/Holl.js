defineVirtualDevice("Holl_L1", {
  title: "Хол",	
  cells: {
   	  switch: {
     		title: "Вкл/Выкл ",
          	type: "switch",
			value: false
		},
    }
});


defineRule({    // inflat -1
  whenChanged: ["wb-mr6c-nc_109/Input 3","Holl_L1/switch"], // правило сработает, когда значение параметра изменится на истинное 
   then: function (newValue, devName, cellName) {
      
 	 
     if (devName=="Holl_L1"){
     dev["wb-mr6c-nc_109/K3"] = ! newValue;
       return;
     }	
     
     
     if (newValue){
     dev["wb-mr6c-nc_109/K3"] = !dev["wb-mr6c-nc_109/K3"];
     }  
       
     } });