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

        },// Dimm
      
        }  // calls  
});    //      floor_heating1

