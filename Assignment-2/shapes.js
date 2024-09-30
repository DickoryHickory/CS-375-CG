
let gl = undefined;

let angle = 0.0;
let ms; // Declare matrix stack globally
let cone;
let sphere;
let tetrahedron;


function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave");
        return; }

    // Add initialization code here

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);

    ms = new MatrixStack();

    tetrahedron = new Tetrahedron(gl);
    tetrahedron.color = vec4(0.0, 1.0, 0.0, 1.0);

    sphere = new Sphere(gl, 18, 9);
    sphere.color = vec4(0.778, 0.928, 0.245, 1.0);

    cone = new Cone(gl, 36);
    cone.color = vec4(0.434, 0.346, 0.676, 1.0);



    render();
}

function render() {

    // Add rendering code here
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angle += 1.0;
    angle %= 360.0;

// *****************************************************************************************
// Tetrahedron
    ms.push();
    ms.rotate(angle, [1, 1, 0]);

    ms.translate([0.0, 0.0, 0.0]);
    ms.scale([0.25, 0.25, 0.25]);

    tetrahedron.MV = ms.current();
    tetrahedron.draw();
    ms.pop();



// *****************************************************************************************
// Sphere
    ms.push();

    ms.rotate(angle, [0, 1, 0]);
    ms.translate([-0.25, 0.5, 0.0]);
    ms.scale(0.1);
    sphere.MV = ms.current();
    sphere.draw();
    ms.pop();


//******************************************************************************************
// Cone
    ms.push();
    ms.rotate(angle, [1, 1, 0]);
    ms.scale(0.2);
    ms.translate([-0.5, -3.0, 0.0]);
    cone.MV = ms.current();
    cone.draw();
    ms.pop();



    requestAnimationFrame(render);
}

window.onload = init;

