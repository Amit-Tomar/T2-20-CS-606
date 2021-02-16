const vertexShaderSrc = `      
        attribute vec3 aPosition;  
		uniform mat4 uModelTransformMatrixLocal;
		uniform mat4 uModelTransformMatrixGlobal;
  
        void main () {             
        	gl_Position = uModelTransformMatrixGlobal * uModelTransformMatrixLocal * vec4(aPosition, 1.0); 
		  	gl_PointSize = 5.0;     
        }                          
	  `;

export default vertexShaderSrc;
