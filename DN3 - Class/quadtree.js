class Quadtree{
	constructor(limit, max_circles, max_levels, level){
		this.max_circles = max_circles || 3; //kolk zogic rab bit notr da se izrise
		this.max_levels = max_levels || 4; //kolk level naj je max level
		this.level = level || 0; //zacne z 0 pa povecuje
		this.limit = limit; //WIDTH pa HEIGHT
		this.circles = [];
		this.nodes = [];
	}
	
	split(){
		var nextLevel = this.level+1; //quad level
		//velikost 
		var subWidth = Math.round( this.limit.width / 2 ); 
		var subHeight = Math.round( this.limit.height / 2 );

		//pozicija
		var x = Math.round( this.limit.x );
		var y = Math.round( this.limit.y );		
		//console.log("x: " + x + "y: " + y);
		 //zgoraj desno
		this.nodes[0] = new Quadtree({x:x + subWidth, y:y,width:subWidth,height:subHeight},this.max_circles, this.max_levels, nextLevel);
		
		//zgoraj levo
		this.nodes[1] = new Quadtree({x:x,y:y,width:subWidth,height:subHeight}, this.max_circles, this.max_levels, nextLevel);
		
		//spodaj levo
		this.nodes[2] = new Quadtree({x:x,y:y+subHeight,width:subWidth,height:subHeight}, this.max_circles, this.max_levels, nextLevel);
		
		//spodaj desno
		this.nodes[3] = new Quadtree({x:x+subWidth,y:y+subHeight,width:subWidth,height:subHeight}, this.max_circles, this.max_levels, nextLevel);
	}
	getIndex(circle){
		var index = -1,
		verticalMidpoint = this.limit.x + (this.limit.width / 2),
		horizontalMidpoint = this.limit.y + (this.limit.height / 2),
		topQuadrant = (circle.y + circle.radius < horizontalMidpoint),
		bottomQuadrant = (circle.y - circle.radius > horizontalMidpoint);
		if( circle.x + circle.radius < verticalMidpoint ) {
			if( topQuadrant ) {
				index = 1;
			} else if( bottomQuadrant ) {
				index = 2;
			}
		} else if( circle.x - circle.radius > verticalMidpoint ) {
			if( topQuadrant ) {
				index = 0;
			} else if( bottomQuadrant ) {
				index = 3;
			}
		}
		return index;	
	}
	insert(circle){
		var i = 0;
		var index;
		if( typeof this.nodes[0] !== 'undefined' ) {
			index = this.getIndex( circle );
			  if( index !== -1 ) {this.nodes[index].insert( circle ); return;}
		}
		this.circles.push(circle);

		if(this.circles.length > this.max_circles && this.level < this.max_levels ) {
			if( typeof this.nodes[0] === 'undefined' )this.split();
			for(;i < this.circles.length;) {
				index = this.getIndex( this.circles[ i ] );
				if( index !== -1 ) {					
					this.nodes[index].insert( this.circles.splice(i, 1)[0] );
				} else {
					i++;
				 }
			 }
		}
	}
	clear(){
		this.circles = [];
		for( var i=0; i < this.nodes.length; i++) {
			if( typeof this.nodes[i] !== 'undefined' ) {
				this.nodes[i].clear();
			}
		}
		this.nodes = [];
		
	}
};
window.Quadtree = Quadtree;	//damo v globalno zato da lahko dobimo vn v main.js