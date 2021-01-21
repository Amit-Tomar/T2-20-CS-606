const fragmentShaderSrc = `      
		precision mediump float;  
		uniform vec3 uPrimitiveColor;   
        void main () {               
          gl_FragColor = vec4(uPrimitiveColor,1.0); 
        }                            
	  `;

export default fragmentShaderSrc;
