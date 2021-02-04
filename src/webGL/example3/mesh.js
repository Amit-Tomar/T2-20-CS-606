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

		this.gl = gl;

		this.vertexPositionBuffer = this.gl.createBuffer();
		if (!this.vertexPositionBuffer)
		{
			throw new Error("Buffer could not be allocated");
		}
	}

	draw(shader)
	{
		let elementPerVertex = 3;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, elementPerVertex * this.vertexPositionData.BYTES_PER_ELEMENT, 0);
		
		const vColor = shader.uniform("vColor");
		shader.setUniform4f(vColor, new Float32Array([0.0, 1.0, 0.0, 1.0]))

		this.gl.drawArrays(this.gl.POINTS, 0, this.vertexPositionData.length / elementPerVertex);
	}
}
