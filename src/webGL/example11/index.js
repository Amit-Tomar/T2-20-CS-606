import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Triangle from './triangle.js'

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
let currentPrimitive = -1;
const primitives = [];

// Convert mouse click to coordinate system as understood by webGL
renderer.getCanvas().addEventListener('click', (event) =>
{
	for (let index = 0; index < 10; index++) {
		
		primitives.push( new Triangle(gl, -1 + (Math.random()*2), -1 + (Math.random()*2), vec3.fromValues(.8,.8,.8) ) );
		
	}
});

window.addEventListener("keydown", function (event)
	{
		switch (event.key)
		{
			case "ArrowDown":
				currentPrimitive = (currentPrimitive+1)%primitives.length;
				break;			
		}

	}, true);

//Draw loop
function animate()
{
	renderer.clear();
	primitives.forEach((primitive,index) => {

		if( index == currentPrimitive )
		{
			primitive.color = vec3.fromValues(0,0,0);
		}
		else {
			primitive.color = vec3.fromValues(.8,.8,.8);
		}
		primitive.draw(shader);
		
	});
	window.requestAnimationFrame(animate);
}

animate();
shader.delete();