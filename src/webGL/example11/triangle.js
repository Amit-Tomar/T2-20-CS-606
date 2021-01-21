export default class Triangle
{
	constructor(gl, centerX, centerY, color)
	{
		this.vertexAttributesData = new Float32Array([
			//  x , y,  z 
			centerX, centerY + 0.025, 0.0,
			centerX - 0.025, centerY - 0.025, 0.0,
			centerX + 0.025, centerY - 0.025, 0.0,
		]);

		this.gl = gl;
		this.color = color;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}
	}

	draw(shader)
	{
		let elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);

		const uPrimitiveColor = shader.uniform("uPrimitiveColor");		
		shader.setUniform3f(uPrimitiveColor, this.color);

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexAttributesData.length / (elementPerVertex));
	}

	addVertex(position, color)
	{
		this.vertexAttributesData = new Float32Array([...this.vertexAttributesData, ...position, ...color])
	}
}