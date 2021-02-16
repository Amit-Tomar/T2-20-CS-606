import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Transform from './transform.js'
export default class Rect
{
	constructor(gl, centroidX, centroidY, width, height, color)
	{
		this.centroidX = centroidX;
		this.centroidY = centroidY;
		this.width = width;
		this.height = height;
		this.color = color;

		this.vertexAttributesData = new Float32Array([
			//  x , y,  z 
			width / 2, + height / 2, 0.0,
			width / 2, - height / 2, 0.0,
			- width / 2, + height / 2, 0.0,
			- width / 2, - height / 2, 0.0,
		]);

		this.gl = gl;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}

		this.transform = new Transform();
		this.transform.translate = vec3.fromValues(centroidX, centroidY, 0);
		this.transform.updateMVPMatrixLocal();
	}

	draw(shader)
	{
		const uModelTransformMatrixLocal = shader.uniform("uModelTransformMatrixLocal");
		const uModelTransformMatrixGlobal = shader.uniform("uModelTransformMatrixGlobal");
		const uPrimitiveColor = shader.uniform("uPrimitiveColor");
		let elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.STATIC_DRAW);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);

		shader.setUniformMatrix4fv(uModelTransformMatrixLocal, this.transform.mvpMatrixLocal);
		shader.setUniformMatrix4fv(uModelTransformMatrixGlobal, this.transform.mvpMatrixGlobal);
		shader.setUniform3f(uPrimitiveColor, this.color);

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexAttributesData.length / (elementPerVertex));
	}

	addVertex(position, color)
	{
		// New data can not be pushed to Typed arrays, we need to re-create them when required to edit
		this.vertexAttributesData = new Float32Array([...this.vertexAttributesData, ...position, ...color])
	}

	distanceFromPoint(posX, posY)
	{
		return vec4.distance(vec4.fromValues(posX, posY, 0, 1), this.centroidAfterTransforms());
	}

	centroidAfterTransforms()
	{
		const currentVertex = vec4.fromValues(0, 0, 0, 1);
		const updatedVertex = vec4.create();
		vec4.transformMat4(updatedVertex, currentVertex, this.transform.mvpMatrixLocal);
		vec4.transformMat4(updatedVertex, updatedVertex, this.transform.mvpMatrixGlobal);
		return updatedVertex;
	}
}