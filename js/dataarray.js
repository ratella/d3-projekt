//DataArray.js 
function DataArray() {
	this.groups = [];
	this.items = [];
}

DataArray.prototype.add = function(item) {
	item._filterValue = "";
	this.items.push(item);
}

DataArray.prototype.count = function(item) {
	return this.items.length;
}

//selector is a property or a member function of the value object
DataArray.prototype.filter = function(property, selector) {
	this.items.forEach(function(item) {                               
		var value = item[property];
		if (selector) {
			if (typeof(value[selector]) == "function") {
				value = value[selector]();
			}
			else {
				value = value[selector];
			}
		}
		item._filterValue = value;
	});
	return this;
}        

DataArray.prototype.containing = function(value) {
	var result = new DataArray();   				
	result.items = this.items.filter(function(item) {  
		var filterValue = item._filterValue;
		if (!item._filterValue) return false;
		
		if (filterValue.constructor == "Array") {
			var hasCategory = false;
	    	item.categories.forEach(function(category, i, arr) {
				hasCategory = hasCategory || (category == categoryName)
			});  
			return hasCategory;			
		}                      
		else {
			return filterValue.indexOf(value) > -1;
		}
	});       
	return result;
} 

DataArray.prototype.equals = function(value) {
	var result = new DataArray();   				
	result.items = this.items.filter(function(item) {  
		return item._filterValue == value;
	});       
	return result;
}

DataArray.prototype.sum = function(property) { 	
	if (this.groups.length > 0) {
		this.groups.forEach(function(group) {     
			var sum = 0;    
			group.items.forEach(function(item) { 
				sum += item[property];
	    	});
			group.value = sum;
    	});  
		return this.groups;
	}   
	else {           
		var sum = 0;    
		this.items.forEach(function(item) { 
			sum += item[property];
    	});
		return sum;
	}	
}     

DataArray.prototype.groupBy = function(property, selector) { 
	var groupMap = {};  
	var keys = [];
	this.groups = [];
	this.items.forEach(function(item) {                               
		var value = item[property];
		if (selector) { 
			if (typeof(value[selector]) == "function") {
				value = value[selector]();
			}
			else {
				value = value[selector];
			}
		}
		if (value.constructor != Array) {
			value = [value];
		}	                
		for(var i in value) {
			var key = value[i];
			if (groupMap[key] == undefined) {
				groupMap[key] = []; 
				keys.push(key);
			}   
			groupMap[key].push(item)
		}
	}); 
	
	keys.sort();
	for(var i=0; i<keys.length; i++) {
	    this.groups.push({
			key: keys[i],
			items: groupMap[keys[i]]
		});
	}  
	return this;
}