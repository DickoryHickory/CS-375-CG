/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {

        vertexShader ||= `
            #version 300 es
            in vec3 aPosition;
            in vec3 aColor;

            uniform mat4 P;
            uniform mat4 MV;
            
            out vec3 vColor;
            
            void main() {
                vColor = aColor;
                gl_Position = P * MV * vec4(aPosition, 1.0);
            }
        `;
        fragmentShader ||= `
        
            #version 300 es
            precision mediump float;
            
            in vec3 vColor;
            out vec4 fragColor;
            
            
            void main() {
                fragColor = vec4(vColor, 1.0);
            }
        `;


        let program = initShaders(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        const vertices = new Float32Array([
            -1.0, -1.0, -1.0,  // Back bottom left
            1.0, -1.0, -1.0,  // Back bottom right
            1.0,  1.0, -1.0,  // Back top right
            -1.0,  1.0, -1.0,  // Back top left
            -1.0, -1.0,  1.0,  // Front bottom left
            1.0, -1.0,  1.0,  // Front bottom right
            1.0,  1.0,  1.0,  // Front top right
            -1.0,  1.0,  1.0   // Front top left
        ]);

        const colors = new Float32Array([
            1.0, 0.0, 0.0,  // Red
            0.0, 1.0, 0.0,  // Green
            0.0, 0.0, 1.0,  // Blue
            1.0, 1.0, 0.0,  // Yellow
            1.0, 0.0, 1.0,  // Magenta
            0.0, 1.0, 1.0,  // Cyan
            1.0, 0.5, 0.0,  // Orange
            0.5, 0.0, 0.5   // Purple
        ]);


        //gl_Position = P * MV * vec4(aPosition, 1.0);





        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);



        const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
        const colorAttributeLocation = gl.getAttribLocation(program, 'aColor');


        this.positionAttributeLocation = positionAttributeLocation;
        this.colorAttributeLocation = colorAttributeLocation;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
        this.program = program;  // Store the shader program instance


        };


        draw = () => {
            //program.use();

            const gl = this.gl;

            gl.useProgram(this.program);

            // Enable and bind the position attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.enableVertexAttribArray(this.positionAttributeLocation);
            gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

            // Enable and bind the color attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.enableVertexAttribArray(this.colorAttributeLocation);
            gl.vertexAttribPointer(this.colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

            // Draw the cube using gl.drawArrays (or gl.drawElements if you use indices)
            gl.drawArrays(gl.TRIANGLES, 0, 36);  // 36 vertices if the cube is fully defined with triangles

            // Disable the vertex attributes after drawing
            gl.disableVertexAttribArray(this.positionAttributeLocation);
            gl.disableVertexAttribArray(this.colorAttributeLocation);

            // Unbind the shader program
            gl.useProgram(null);


        };
}