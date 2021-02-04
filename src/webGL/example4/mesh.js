export default class Mesh
{
	constructor(gl)
	{
		this.vertexPositionData = new Float32Array([
			0.5, 0.5, 0.0,
			-0.5, 0.5, 0.0,
			0.5, -0.5, 0.0,
			-0.5, -0.5, 0.0,
		]);

		this.vertexColorData = new Float32Array([
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 0.0,
		]);

		this.gl = gl;

		this.vertexPositionBuffer = this.gl.createBuffer();
		if (!this.vertexPositionBuffer)
		{
			throw new Error("Buffer for vertex could not be allocated");
		}

		this.colorBuffer = this.gl.createBuffer();
		if (!this.colorBuffer)
		{
			throw new Error("Buffer for color could not be allocated");
		}
	}

	draw(shader)
	{
		let elementPerVertexPosition = 3;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertexPosition, this.gl.FLOAT, false, elementPerVertexPosition * this.vertexPositionData.BYTES_PER_ELEMENT, 0);

		let elementPerVertexColor = 3;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexColorData, this.gl.STATIC_DRAW);
		
		const aColor = shader.attribute("aColor");
		this.gl.enableVertexAttribArray(aColor);
		this.gl.vertexAttribPointer(aColor, elementPerVertexColor, this.gl.FLOAT, false, elementPerVertexColor * this.vertexColorData.BYTES_PER_ELEMENT, 0);

		this.gl.drawArrays(this.gl.POINTS, 0, this.vertexPositionData.length / elementPerVertexColor);
	}
}
