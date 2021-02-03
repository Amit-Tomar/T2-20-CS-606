export default class Mesh
{
	constructor(gl)
	{
		this.vertexAttributesData = new Float32Array([
			//  x , y,  z ,	r , g ,b 
			0.5, 0.5, 0.0, 1.0, 0.0, 0.0,
			-0.5, 0.5, 0.0, 0.0, 1.0, 0.0,
			0.5, -0.5, 0.0, 0.0, 0.0, 1.0,
			-0.5, -0.5, 0.0, 0.0, 0.0, 0.0,
		]);

		this.gl = gl;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}
	}

	draw(shader)
	{
		let elementPerVertex = 3;

		// Prototype : void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 6 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);
		
		const aColor = shader.attribute("aColor");
		this.gl.enableVertexAttribArray(aColor);
		this.gl.vertexAttribPointer(aColor, elementPerVertex, this.gl.FLOAT, false, 6 * this.vertexAttributesData.BYTES_PER_ELEMENT, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT);

		this.gl.drawArrays(this.gl.POINTS, 0, this.vertexAttributesData.length / (2 * elementPerVertex));
	}
}