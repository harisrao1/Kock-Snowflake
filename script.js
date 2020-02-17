class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	

	divideScalar(s) {
		this.x /= s;
		this.y /= s;
		return this;
	}
	
	multiplyScalar(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	
	normalize() {
		const length = this.getLength();
		return this.divideScalar(length);
	}
	
	getAngle() {
		return Math.atan2(this.y, this.x);
	}
	
	getLength() {
		return Math.sqrt(
			this.x * this.x +
			this.y * this.y
		);
	}
  
	clone() {
		return new Vector2(this.x, this.y);
	}
	
	min() {
		return Math.min(this.x, this.y);
	}
	
	static fromScalar(s = 0) {
		return new Vector2(s, s);
	}
	
	static subtract(a, b) {
		return new Vector2(
			b.x - a.x,
			b.y - a.y
		);
	}
	
	static lerp(a, b, t) {
		return new Vector2(
			a.x + (b.x - a.x) * t,
			a.y + (b.y - a.y) * t
		);
	}
}

class Path {
	constructor(points = []) {
		this.points = points;
	}
	
	
  break(breakLine) {
		let newPoints = [];
		
    
		for (let i = 0; i < this.points.length - 1; i++) {
      const start = this.points[i];
			 const end = this.points[i + 1];
			 const line = Vector2.subtract(start, end);
      
			
			newPoints = newPoints.concat(breakLine(start, end, line));
		}
    
 
    
   
		
		this.points = newPoints;
		return this;
	}
	
	render(context, size = Vector2.fromScalar(1)) {
		const center = size.clone().divideScalar(2);
		const scale = size.min() / 2;
		const startPosition = this.points[0].clone()
			.multiplyScalar(scale)
			.add(center);
		
		context.beginPath();
		context.moveTo(startPosition.x, startPosition.y);
		
		this.points.slice(1).forEach((point, index) => {
			const position = point.clone()
				.multiplyScalar(scale)
				.add(center);
			
			context.lineTo(position.x, position.y);
		});
		
		context.lineWidth = 1;
		context.strokeStyle = '#000';
		context.stroke();
	}
}
//Rendering Settings for the SnowFlake
class SnowFlake {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		
		this.size = new Vector2(1, 1);
		
		this.setRenderSettings(null);
		this.loop = this.render.bind(this);
	}
	
	setRenderSettings(settings) {
		this.renderSettings = settings;
		this.reset();
	}
	
	setSize(size) {
		this.size = size;
		
		this.canvas.height = size.y;
		this.canvas.width = size.x;
	}
	
	reset() {
		this.side1 = new Path([
			new Vector2(-0.5, 0),
			new Vector2(0.5, 0),
		]);
    
    this.side2 = new Path([
			new Vector2(0.5, 0),
			new Vector2(0, 0.866),
		]);
    
    this.side3 = new Path([
			new Vector2(0,0.866),
			new Vector2(-0.5, 0),
		]);
		
		this.iteration = -1;
	}
	
	render() {
		if (this.renderTimeout) {
			clearTimeout(this.renderTimeout);
			this.renderTimeout = null;
		}
		
		if (++this.iteration < this.renderSettings.iterations) {
			this.renderTimeout = setTimeout(this.loop, 800);
		}
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.side1.render(this.context, this.size);
    this.side2.render(this.context, this.size);
    this.side3.render(this.context, this.size);
		this.side1.break(this.renderSettings.breakLine);
    this.side2.break(this.renderSettings.breakLine);
    this.side3.break(this.renderSettings.breakLine);
	}
}


//Math for the SnowFlake
const koch = {
		iterations: 5,
		breakLine: (start, end, line) => {
			const lineLength = line.getLength();
			const extrude = Math.sqrt(3) / 2 * lineLength / 3;
			const extrudeAngle = line.getAngle() + Math.PI / -2;
			
			return [
				start,
				Vector2.lerp(start, end, 1/3),
				Vector2.lerp(start, end, 1/2)
					.add(new Vector2(
						Math.cos(extrudeAngle) * extrude,
						Math.sin(extrudeAngle) * extrude
					)),
				Vector2.lerp(start, end, 2/3),
				end,
			];
    }
  };

// Rendering the SnowFlake
const koch_snowflake = new SnowFlake();
koch_snowflake.setSize(new Vector2(window.innerWidth, window.innerHeight));
koch_snowflake.setRenderSettings(koch);
koch_snowflake.render();

document.body.appendChild(koch_snowflake.canvas);




//Button For Replaying the SnowFlake
const kochB = document.getElementById('button-koch');
const button = kochB;
button.addEventListener('click', () => {
  koch_snowflake.setRenderSettings(koch);
  koch_snowflake.render();

});



