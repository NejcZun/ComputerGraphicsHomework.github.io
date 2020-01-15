class Vector4f{
	constructor(x, y, z){
		if(typeof x === "string" || typeof y === "string" || typeof z === "string"){
			console.log("Vpisali niste števila!");
			this.x = null;
			this.y = null;
			this.z = null;
			this.w = null;
		}else{
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = 1;
		}
	}
	static info(input){
		return "<table><tr><td>" + input.x + "</td></tr><tr><td>" + input.y + "</td></tr><tr><td>" + input.z + "</td></tr><tr><td>" + input.w + "</td></tr></table>";
	}
	static negate(input){
		return new Vector4f(-input.x, -input.y, -input.z);
	}
	static add(input1, input2){
		return new Vector4f(input1.x + input2.x, input1.y + input2.y, input1.z + input2.z);
	}
	static scalarProduct(input1, input2){
		return new Vector4f(input1*input2.x, input1*input2.y, input1*input2.z);
	}
	static dotProduct(input1, input2){
		return input1.x*input2.x + input1.y*input2.y+ input1.z*input2.z;
	}
	static crossProduct(input1, input2){
		return new Vector4f((input1.y*input2.z)-(input1.z*input2.y),(input1.z*input2.x)-(input1.x*input2.z),(input1.x*input2.y)-(input1.y * input2.x));
	}
	static length(input){
        return Math.sqrt(Math.pow(input.x, 2) + Math.pow(input.y,2) + Math.pow(input.z,2));
    }
    static normalize(input){
        let l = Vector4f.length(input);
		if(!l){console.log("Dolžina je manjša od 0 - deljenje ni možno!"); return null;}
        return new Vector4f(input.x / l, input.y / l, input.z / l, input.w / l);
    }
    static project(input1, input2){
        let n = Vector4f.dotProduct(input1, input2);
		let l = Vector4f.length(input1);
		let l2= Math.pow(l, 2);
        if(!l2){console.log("Dolžina je manjša od 0 - deljenje ni možno!"); return null;}
        return Vector4f.scalarProduct(n/l2, input1);
    }
    static cosPhi(input1, input2){
        let up = Vector4f.dotProduct(input1, input2);
		let down = (Vector4f.length(input1) * Vector4f.length(input2));
		if(!down){console.log("Spodna meja je pod 0 - deljenje ni možno!"); return null;}
        return Math.acos(up/down);
    }
}

class Matrix4f{
	constructor(matrix){
		if(matrix[0].length !=4 || matrix[1].length != 4 || matrix[2].length != 4 || matrix[3].length != 4){
			this.matrix = null;
			console.log("Matrika mora biti 4x4, prosim ponovno podajte elemente!");
		}else{
			this.matrix = matrix;
		} 
	}
	static info(input){
		let string = "<table>";
		for (const array of input.matrix) {
			string += "<tr>";
			for (const el of array) {
				string += "<td>" + el +"</td>";
			}
			string += "</tr>";
		}
		return string + "</table>";
	}
	static negate(input){
		let matrika = [];
		for (const array of input.matrix) matrika.push(array.map(value => -value));
		return new Matrix4f(matrika);
	}
	static add(input1, input2){
		let matrika = [];
		let temp1 = input1.matrix;
		let temp2 = input2.matrix;
		temp1.forEach((t, n1) => {
			let sum = [];
			t.forEach((num, n2) => {
				sum.push(num + temp2[n1][n2]);
			});
			matrika.push(sum);
		});
		return new Matrix4f(matrika);
	}
	static transpose(input){
		return new Matrix4f(input.matrix[0].map((col, i) => input.matrix.map(row => row[i])));
	}
	static multiplyScalar(scalar, input){
		return new Matrix4f(input.matrix.map(v => v.map(a => a*scalar)));
	}
	static multiply(input1, input2){
		let temp1 = input1.matrix;
		let temp2 = input2.matrix;
		let x = temp1.length,
		z = temp1[0].length,
		y = temp2[0].length;
		if (temp2.length !== z) {
			console.log("Število vrstic se ne ujema s številom stolpcov!")
		}
		let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
		let product = new Array(x);
		for (let p = 0; p < x; p++) {
			product[p] = productRow.slice();
		}
		for (let i = 0; i < x; i++) {
			for (let j = 0; j < y; j++) {
				for (let k = 0; k < z; k++) {
					product[i][j] += temp1[i][k] * temp2[k][j];
				}
			}
		}
		return new Matrix4f(product);
	}

}
class PointManager{
	constructor(){
		let vrednosti = document.getElementById("area");
		let raw_line = vrednosti.value.split("\n");
		let array_vrednosti = [];
		let i=1;
		for (const line of raw_line) {
			let koordinate = line.split(" ");
			if(koordinate.length != 4 || !isFinite(koordinate[1]) || !isFinite(koordinate[2]) || !isFinite(koordinate[3])){ 
				console.log("Vektor na vrstici " + i + ". je napačno formatiran!"); 
				return undefined;
			}else{
				array_vrednosti.push(new Vector4f(parseFloat(koordinate[1]), parseFloat(koordinate[2]), parseFloat(koordinate[3])));
			}
			i++;
		}
		return array_vrednosti;
	}
}

class Transformation{
	
	transformationMatrix = new Matrix4f([[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]]);
	
	static translate(input){
		this.transformationMatrix = new Matrix4f([[1, 0, 0, input.x], [0,1,0, input.y], [0,0,1,input.z], [0,0,0,1]]);
	}
	static scale(input){
		this.transformationMatrix =  new Matrix4f([[input.x, 0,0,0], [0,input.y, 0,0], [0,0,input.z, 0], [0,0,0,1]]);
	}
	static rotateX(input){
		this.transformationMatrix = new Matrix4f([[1, 0, 0, 0], [0, Math.cos(input), -Math.sin(input), 0], [0, Math.sin(input), Math.cos(input), 0], [0,0,0,1]]);
	}
	static rotateY(input){
		this.transformationMatrix = new Matrix4f([[Math.cos(input), 0, Math.sin(input), 0], [0, 1, 0, 0], [-Math.sin(input), 0, Math.cos(input), 0], [0,0,0,1]]);
	}
	static rotateZ(input){
		this.transformationMatrix = new Matrix4f([[Math.cos(input), -Math.sin(input), 0, 0], [Math.sin(input), Math.cos(input), 0, 0], [0, 0, 1, 0], [0,0,0,1]]);
	}
	static transformPoint(input){
		if(!isFinite(input.x) || !isFinite(input.y) || !isFinite(input.z) || !isFinite(input.w)){
			console.log("Prislo je do napake - Dimenzija vektorja ne ustreza!");
			return null;
		}else{
			let vector4f = [input.x, input.y, input.z, input.w];
			let transformedVector = Array(4).fill(0);
			for(let i=0; i < this.transformationMatrix.matrix.length; i++){
				for(let j=0; j < this.transformationMatrix.matrix[i].length; j++){
					transformedVector[i]+= this.transformationMatrix.matrix[i][j] * vector4f[j];
				}
			}
			return new Vector4f(transformedVector[0], transformedVector[1], transformedVector[2]);
		}
	}
	static info(){
		let string = "<table>";
		for (const array of this.transformationMatrix.matrix) {
			string += "<tr>";
			for (const el of array) {
				string += "<td>" + el +"</td>";
			}
			string += "</tr>";
		}
		return string + "</table>";
	}
}

class TransformPoints{
	constructor(array){
		let output="";
		for(const point of array){
			let p;
			Transformation.translate(new Vector4f(1.25, 0, 0, 1));
				p = Transformation.transformPoint(point);

			Transformation.rotateZ(Math.PI/3);
				p = Transformation.transformPoint(p);

			Transformation.translate(new Vector4f(0, 3.14, 4.15, 1));
				p = Transformation.transformPoint(p);

			Transformation.scale(new Vector4f(1.12, 1.12, 1, 1));
				p = Transformation.transformPoint(p);

			Transformation.rotateY(5*Math.PI/8);
				p = Transformation.transformPoint(p);

			output+= 'v '+p.x+' '+p.y+' '+p.z+'\n';
		}
		document.getElementById("output").innerHTML = output;
	}
}

function onButtonClick(){
	start = new PointManager();
	if(start.length != undefined){
		transform = new TransformPoints(start);
	}
}





//Spodaj si lahko pomagate z že narejenimi primeri

/* VEKTORJI */
test = new Vector4f(3, 4, 0);
test2 = new Vector4f(4, 5, 8);

// negacija
	document.getElementById("test").innerHTML = Vector4f.info(Vector4f.negate(test));
//add
	//document.getElementById("test").innerHTML = Vector4f.info(Vector4f.add(test, test2));
//scalar
	//document.getElementById("test").innerHTML = Vector4f.info(Vector4f.scalarProduct(2, test));
//dot
	//document.getElementById("test").innerHTML = Vector4f.dotProduct(test, test2);
//cross
	//document.getElementById("test").innerHTML = Vector4f.info(Vector4f.crossProduct(test, test2));
//length
	//document.getElementById("test").innerHTML = Vector4f.length(test);
//normalize
	//document.getElementById("test").innerHTML = Vector4f.info(Vector4f.normalize(test));
//project
	//document.getElementById("test").innerHTML = Vector4f.info(Vector4f.project(test, test2));
//cosPhi
	//document.getElementById("test").innerHTML = Vector4f.cosPhi(test, test2);

/* MATRIKE */

test = new Matrix4f([[1,2,3,4], [5,6,7,8], [9, 10, 11, 12], [13,14,15,16]]);
test2 = new Matrix4f([[1,2,3,4], [5,6,7,8], [9, 10, 11, 12], [13,14,15,16]]);

//Negacija
	//document.getElementById("test2").innerHTML = Matrix4f.info(Matrix4f.negate(test));
//Add
	document.getElementById("test2").innerHTML = Matrix4f.info(Matrix4f.add(test, test2));
//Transponiranje Matrike:
	//document.getElementById("test2").innerHTML = Matrix4f.info(Matrix4f.transpose(test));
// Multiply Skalar:
	//document.getElementById("test2").innerHTML = Matrix4f.info(Matrix4f.multiplyScalar(2, test));
// Multiply
	//document.getElementById("test2").innerHTML = Matrix4f.info(Matrix4f.multiply(test, test2));


/* TRANSFORM */

test = new Vector4f(1.25,2,-2,1);
//Translate
	//document.getElementById("test2").innerHTML = Transformation.info(Transformation.translate(test));
//Scale
	//document.getElementById("test2").innerHTML = Transformation.info(Transformation.scale(2.5));
//RotateX
	//document.getElementById("test2").innerHTML = Transformation.info(Transformation.rotateX(2.5));
//RotateY
	//document.getElementById("test2").innerHTML = Transformation.info(Transformation.rotateY(2.5));
//RotateZ
	//document.getElementById("test2").innerHTML = Transformation.info(Transformation.rotateZ(2.5));
//let newVector = Transformation.transformPoint(new Vector4f(3.1, 1.24, 4.78, 1));
//console.log(newVector);