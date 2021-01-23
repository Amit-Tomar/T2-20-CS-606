import Transform from './transform.js'
import { vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Mesh
{
	constructor(gl)
	{
		this.vertexAttributesData = new Float32Array([
			//  x , y,  z 
			-0.25, -0.25, 0.0, 
			0.25, -0.25, 0.0, 
			-0.25, 0.25, 0.0, 
			0.25, 0.25, 0.0, 
		]);

		this.gl = gl;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}

		this.transform = new Transform();
	}

	draw(shader)
	{
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		let elementPerVertex = 3;
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);

		shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexAttributesData.length / ( elementPerVertex));
	}

	addVertex(position, color)
	{
		// New data can not be pushed to Typed arrays, we need to re-create them when required to edit
		this.vertexAttributesData = new Float32Array([...this.vertexAttributesData, ...position, ...color])
	}

	getTransformedVertexPositions() 
	{
		// Position of bottom left vertex
		const currentVertex = vec4.fromValues(this.vertexAttributesData[0],this.vertexAttributesData[1],this.vertexAttributesData[2],1);
		const updatedVertex = vec4.create();
		vec4.transformMat4( updatedVertex, currentVertex , this.transform.getMVPMatrix() );
		console.log(updatedVertex);
		return updatedVertex;
	}
}