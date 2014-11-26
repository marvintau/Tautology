function run_3d(canvas){
    var camera, scene, renderer;

    var controls;

    init();
    animate();

    function init() {
        var geometry;   //Alternative
        
        var canvas_len = canvas.width / window.devicePixelRatio;
        var canvas_hi = canvas.height / window.devicePixelRatio;
        var straw_stripes = 16;     // Straw resolution

        var radius = 5;
        var angle = Math.PI*2/straw_stripes;
        var stripe_height = 2*radius * Math.tan(angle/2);

        
        camera = new THREE.PerspectiveCamera( 25, canvas_len / canvas_hi, 10, 1000 );
        camera.position.z = 200;

        scene = new THREE.Scene();

        geometry = new THREE.CylinderGeometry( 5, 5, 200, 30, 1, true);

                
        texture  = new THREE.Texture(canvas.getElement());
        texture.needsUpdate = true;
        // texture.repeat = new THREE.Vector2(-1, -1);
        // texture.offset = new THREE.Vector2(1,1);
        material = new THREE.MeshLambertMaterial({ color:0x8f8f8f,
                                                   opacity: 0.6,
                                                   transparent: true,
                                                   side: THREE.DoubleSide,
                                                   map: texture,

                                                   _needsUpdate: true}); 
        
        // for(var i = 0; i < straw_stripes; i++){
        //     mesh = new THREE.Mesh(geometries[i], material);
        //     mesh.translateY(radius* Math.cos(angle*i));
        //     mesh.translateZ(radius* Math.sin(angle*i));
        //     mesh.rotateX(angle*i+Math.PI-Math.PI/2);

        //     scene.add(mesh);

        // }

        scene.add(new THREE.Mesh(geometry, material));
         
        // Configure render
        renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
        renderer.setSize( canvas_len, canvas_hi );
        renderer.shadowMapEnabled = true;

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 400;
        $("#viewport").append( renderer.domElement );


        light = new THREE.PointLight( 0xf2f2f2, 1 );
        light.shadowCameraVisible = true;
        light.position = camera.position;
        scene.add( light );

        light = new THREE.AmbientLight( 0xaaaaaa );
        scene.add( light );

        // Configure trackball control
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = false;
        controls.dynamicDampingFactor = 0.1;
        controls.addEventListener( 'change', render );
        
        render();
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        render();
    }

    function render(){
        texture.needsUpdate = true;
        renderer.render( scene, camera );
    }

    // Register an event handler, the 'canvas' here is a fabric.js canvas
    // object. Then we find out all HTML canvas elements over the straw
    // model, and then update the texture. The source canvas for drawing
    // Logo is called 'canvas_elem', which shouldn't be confused with
    // fabric.js canvas object.

}

function setup_canvas(){
    canvas = new fabric.Canvas("c");

    if( window.devicePixelRatio !== 1 ){
        var c = canvas.getElement(); // canvas = fabric.Canvas
        
        var w = c.width, h = c.height;
 
        c.setAttribute('width', w*window.devicePixelRatio);
        c.setAttribute('height', h*window.devicePixelRatio);
        c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
 
    }
	var rect = new fabric.Rect({
		left: 100,
		top: 100,
		fill: 'red',
		width: 50,
		height: 40
	});
	canvas.add(rect);
}


$(document).ready( function(){

    setup_canvas();
    
    run_3d(canvas);
    
    canvas.backgroundColor = 'rgba(255,255,255, 1)';

});
