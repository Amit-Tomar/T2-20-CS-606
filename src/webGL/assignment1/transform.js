import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
	constructor()
	{
		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 1, 0, 0);

		this.mvpMatrixLocal = mat4.create();
		this.mvpMatrixGlobal = mat4.create();

		this.updateMVPMatrixLocal();
	}

	// Keep in mind that modeling transformations are applied to objects in the opposite of the order in which they occur in the code
	updateMVPMatrixLocal()
	{
		mat4.identity(this.mvpMatrixLocal);
		mat4.translate(this.mvpMatrixLocal, this.mvpMatrixLocal, this.translate);
		mat4.scale(this.mvpMatrixLocal, this.mvpMatrixLocal, this.scale);
		mat4.rotate(this.mvpMatrixLocal, this.mvpMatrixLocal, this.rotationAngle, this.rotationAxis);
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}

	getRotate()
	{
		return this.rotate;
	}
}