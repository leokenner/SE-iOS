
function List()
{
	List.makeNode=function(){ 
 		return  {data:null,next:null};
	};
	
	this.start=null;
	
	this.add=function (data){
 		if(this.start===null){ 
   			this.start=List.makeNode(); 
   			this.end=this.start;
 		}
 		else{ 
  			this.end.next=List.makeNode(); 
  			this.end=this.end.next; 
 		};
 		this.end.data=data; 
	};
	
	var current = this.start;
	
	this.insertAsFirst = function(d) {
 		var temp = List.makeNode();
 		temp.next = this.start; 
 		this.start = temp; 
 		temp.data = d; 
	};
	
	this.deleteNode = function(data) {
 		var current = this.start; 
 		var previous = this.start; 
 		while (current !== null) { 
  			if (data === current.data) { 
   				if (current === this.start) { 
    				this.start = current.next; 
    				return; 
  				} 
  			if (current == this.end) this.end = previous; 
  			previous.next = current. next; 
  			return; 
 			} 
 			previous = current; 
 			current = current.next; 
 		} 
	};
	
	this.deleteNodeAtIndex = function(index) {
		if(this.start == null) return;
		var current = this.start;
		var i=0;
		while(current != null)
		{
			if(i == index)
			{
				if (current === this.start) { 
    				this.start = current.next; 
    				return; 
  				} 
  				if (current == this.end) this.end = previous; 
  				previous.next = current. next; 
  				return; 
			}
			previous = current; 
 			current = current.next;
		}
	}
	
	this.item=function(i){ 
 		var current = this.start; 
 		while (current !== null) {
  			//i--; 
  			if(i===0) return current; 
  			current = current.next;
  			i--; 
 		} 
 		return null;
	};
	
	this.getIndex = function(value) {
		var current = this.start;
		var i=0;
		while(current != null)
		{
			if(value == current.data) return i;
			else {
				i++;
				current = current.next;
			}
		}
		return -1;
	}
	
	this.each = function(f) {
 		var current = this.start; 
 		while (current !== null) { 
  		f(current); 
  		current = current.next;
  		}
 	};
  		
  	this.length = function() {
  		if(this.start == null) return 0;
  		var current = this.start;
  		var length=0;
  		while(current != null) {
  			length++;
  			current=current.next;
  		}
  		return length;
  	}

	
	
}
