import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Rect from './rect.js'

let systemMode = 0;
let shapeMode = 'r';
let rotationAngle = 0;

const renderer = new Renderer();
const gl = renderer.webGlContext();
const primitives = [];

let selectedPrimitive = null;
let globalCentroid = [0, 0];

function addListElement(list, text = "")
{
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(text));
	list.prepend(li);
}

window.onload = () =>
{
	const list = document.querySelector('#eventQueue');

	// Convert mouse click to coordinate system as understood by webGL
	renderer.getCanvas().addEventListener('click', (event) =>
	{
		let mouseX = event.clientX;
		let mouseY = event.clientY;

		/* Needed in some cases ?
		let rect = renderer.getCanvas().getBoundingClientRect();
		mouseX = mouseX - rect.left;
		mouseY = mouseY - rect.top;*/

		const clipCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);

		addListElement(list, `Left mouse clicked`)

		if (systemMode === 0)
		{
			if (shapeMode === 'r')
			{
				let color = vec3.create();
				vec3.set(color, 1.0, 0.0, 0.0)
				primitives.push(new Rect(gl, clipCoordinates[0], clipCoordinates[1], 0.1, 0.2, color));
			}
			else if (shapeMode === 's')
			{
				let color = vec3.create();
				vec3.set(color, 1.0, 0.0, 1.0)
				primitives.push(new Rect(gl, clipCoordinates[0], clipCoordinates[1], 0.1, 0.1, color));
			}
		}

		else if (systemMode === 1) 
		{
			let distanceMin = 1000000;
			let closestPrimitiveIndex = 0;
			
			primitives.forEach((primitive, index) =>
			{
				const distanceFromPrimitiveCentroid = primitive.distanceFromPoint(clipCoordinates[0], clipCoordinates[1]);
				if (distanceFromPrimitiveCentroid < distanceMin)
				{
					distanceMin = distanceFromPrimitiveCentroid;
					closestPrimitiveIndex = index;
				}
			});

			if (closestPrimitiveIndex >= 0)
			{
				selectedPrimitive = primitives[closestPrimitiveIndex];
			}
			else 
			{
			}
		}
	});

	window.addEventListener("keydown", function (event)
	{
		if (event.defaultPrevented)
		{
			return; // Do nothing if the event was already processed
		}

		addListElement(list, `${event.key} Pressed`)

		switch (event.key)
		{
			case "ArrowDown":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.setTranslate(vec3.fromValues(selectedPrimitive.transform.translate[0], selectedPrimitive.transform.translate[1] - .05, selectedPrimitive.transform.translate[2]));
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}

				break;
			case "ArrowUp":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.setTranslate(vec3.fromValues(selectedPrimitive.transform.translate[0], selectedPrimitive.transform.translate[1] + .05, selectedPrimitive.transform.translate[2]));
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}
				break;
			case "ArrowLeft":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.setTranslate(vec3.fromValues(selectedPrimitive.transform.translate[0] - .05, selectedPrimitive.transform.translate[1], selectedPrimitive.transform.translate[2]));
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}
				else if (systemMode === 2)
				{
					rotationAngle += .05;
				}
				break;
			case "ArrowRight":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.setTranslate(vec3.fromValues(selectedPrimitive.transform.translate[0] + .05, selectedPrimitive.transform.translate[1], selectedPrimitive.transform.translate[2]));
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}
				else if (systemMode === 2)
				{
					rotationAngle -= .05;
				}

				break;
			case "r":
				shapeMode = 'r';
				break;
			case "s":
				shapeMode = 's';
				break;
			case "c":

				break;
			case "x":
				primitives.pop();
				break;
			case "+":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.scale = vec3.fromValues(selectedPrimitive.transform.scale[0] + .05, selectedPrimitive.transform.scale[1] + .05, selectedPrimitive.transform.scale[2] + .05);
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}
				break;
			case "-":
				if (systemMode === 1)
				{
					selectedPrimitive.transform.scale = vec3.fromValues(selectedPrimitive.transform.scale[0] - .05, selectedPrimitive.transform.scale[1] - .05, selectedPrimitive.transform.scale[2] - .05);
					selectedPrimitive.transform.updateMVPMatrixLocal();
				}
				break;
			case "m":
				systemMode = (systemMode + 1) % 3;

				if (2 === systemMode)
				{
					// Find bounding box, axis aligned
					let minX = 10000, minY = 10000;
					let maxX = -1, maxY = -1;
					primitives.forEach((primitive, index) =>
					{
						if (primitive.centroidAfterTransforms()[0] < minX)
						{
							minX = primitive.centroidAfterTransforms()[0];
						}

						if (primitive.centroidAfterTransforms()[0] > maxX)
						{
							maxX = primitive.centroidAfterTransforms()[0];
						}

						if (primitive.centroidAfterTransforms()[1] < minY)
						{
							minY = primitive.centroidAfterTransforms()[1];
						}

						if (primitive.centroidAfterTransforms()[1] > maxY)
						{
							maxY = primitive.centroidAfterTransforms()[1];
						}
					});

					// Center of bounding box
					globalCentroid[0] = (minX + maxX) / 2;
					globalCentroid[1] = (minY + maxY) / 2;
				}
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}

		document.querySelector('#systemMode').innerHTML = `systemMode : ${systemMode}`;

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);
}

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

let rotationAxis = vec3.create();

//Draw loop
function animate()
{
	vec3.set(rotationAxis, 0, 0, 1);

	renderer.clear();
	primitives.forEach(primitive =>
	{
		mat4.identity(primitive.transform.mvpMatrixGlobal);

		if (systemMode === 2)
		{
			mat4.translate(primitive.transform.mvpMatrixGlobal, primitive.transform.mvpMatrixGlobal, [globalCentroid[0], globalCentroid[1], 0]);
			mat4.rotate(primitive.transform.mvpMatrixGlobal, primitive.transform.mvpMatrixGlobal, rotationAngle, rotationAxis);
			mat4.translate(primitive.transform.mvpMatrixGlobal, primitive.transform.mvpMatrixGlobal, [-globalCentroid[0], -globalCentroid[1], 0]);
		}
		else
		{
			rotationAngle = 0;
		}

		primitive.draw(shader);
	});
	window.requestAnimationFrame(animate);
}

animate();
shader.delete();