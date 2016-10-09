/**
 * Created by Igor Amorim Silva on 09/10/2016.
 */
var gui, scene, camera, renderer, orbit, ambientLight, lights, mesh, bones, skeletonHelper;

var state = {

    animateBones : false

};

function initScene () {

    gui = new dat.GUI();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 200 );
    camera.position.z = 40;
    camera.position.y = 40;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    document.body.appendChild( renderer.domElement );

    orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    ambientLight = new THREE.AmbientLight( 0x000000 );
    scene.add( ambientLight );

    lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );

    window.addEventListener( 'resize', function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );

    initBones();
    setupDatGui();

}

function createGeometry ( sizing ) {

    var geometry = new THREE.CylinderGeometry(
        4,                       // radiusTop
        4,                       // radiusBottom
        sizing.height,           // height
        8,                       // radiusSegments
        sizing.segmentCount , // heightSegments
        true                     // openEnded
    );

    for ( var i = 0; i < geometry.vertices.length; i ++ ) {

        var vertex = geometry.vertices[ i ];
        var y = ( vertex.y + sizing.halfHeight );

        var skinIndex = Math.floor( y / sizing.segmentHeight );
        var skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;

        geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
        geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );

    }

    return geometry;

};

function createBones ( sizing ) {

    bones = [];

    var prevBone = new THREE.Bone();
    bones.push( prevBone );
    prevBone.position.y = - sizing.halfHeight;

    for ( var i = 0; i < sizing.segmentCount; i ++ ) {

        var bone = new THREE.Bone();
        bone.position.y = sizing.segmentHeight;
        bones.push( bone );
        prevBone.add( bone );
        prevBone = bone;

    }

    return bones;

};

function createMesh ( geometry, bones ) {

    var material = new THREE.MeshPhongMaterial( {
        skinning : true,
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    } );

    var mesh = new THREE.SkinnedMesh( geometry,	material );
    var skeleton = new THREE.Skeleton( bones );

    mesh.add( bones[ 0 ] );

    mesh.bind( skeleton );

    skeletonHelper = new THREE.SkeletonHelper( mesh );
    skeletonHelper.material.linewidth = 2;
    scene.add( skeletonHelper );

    return mesh;

};

function setupDatGui () {

    var folder = gui.addFolder( "General Options" );

    folder.add( state, "animateBones" );
    folder.__controllers[ 0 ].name( "Animate Bones" );

    folder.add( mesh, "pose" );
    folder.__controllers[ 1 ].name( ".pose()" );

    var bones = mesh.skeleton.bones;



    var data ={};



var controllerRotationX=[];
var controllerRotationY=[];
var controllerRotationZ=[];


    for ( var i = 0; i < bones.length; i ++ ) {

        var bone = bones[ i ];

        folder = gui.addFolder( "Bone " + i );

        folder.add( bone.position, 'x', - 10 + bone.position.x, 10 + bone.position.x );
        folder.add( bone.position, 'y', - 10 + bone.position.y, 10 + bone.position.y );
        folder.add( bone.position, 'z', - 10 + bone.position.z, 10 + bone.position.z );

        folder.add( bone.rotation, 'x', - Math.PI * 0.5, Math.PI * 0.5 );
        folder.add( bone.rotation, 'y', - Math.PI * 0.5, Math.PI * 0.5 );
        folder.add( bone.rotation, 'z', - Math.PI * 0.5, Math.PI * 0.5 );

        folder.add( bone.scale, 'x', 0, 2 );
        folder.add( bone.scale, 'y', 0, 2 );
        folder.add( bone.scale, 'z', 0, 2 );

        folder.__controllers[ 0 ].name( "position.x" );
        folder.__controllers[ 1 ].name( "position.y" );
        folder.__controllers[ 2 ].name( "position.z" );

        controllerRotationX[i] = folder.__controllers[ 3 ].name( "rotation.x" );
        controllerRotationY[i] = folder.__controllers[ 4 ].name( "rotation.y" );
        controllerRotationZ[i] = folder.__controllers[ 5 ].name( "rotation.z" );


    }

    // Envia dados do Servo da Base
    controllerRotationY[0].onFinishChange(function(value){
     var angulo = value * 180 / Math.PI;
        var socket = io.connect('http://localhost:8080');
        data1 = {servo1: angulo};
        console.log(data1);
        socket.emit('base',data1);
    });

    // Envia dados do Servo do Eixo 1
    controllerRotationZ[1].onFinishChange(function(value){
        var angulo = value * 180 / Math.PI;
        var socket = io.connect('http://localhost:8080');
        data2 = {servo2: angulo};
        console.log(data2);
        socket.emit('one',data2);



    });

    // Envia dados do Servo do Eixo 2
    controllerRotationZ[2].onFinishChange(function(value){
        var angulo = value * 180 / Math.PI;
        var socket = io.connect('http://localhost:8080');
        data3 = {servo3: angulo};
        console.log(data3);
        socket.emit('two',data3);

    });


}

function initBones () {

    var segmentHeight = 8;
    var segmentCount = 4;
    var height = segmentHeight * segmentCount;
    var halfHeight = height * 0.5;

    var sizing = {
        segmentHeight : segmentHeight,
        segmentCount : segmentCount,
        height : height,
        halfHeight : halfHeight
    };

    var geometry = createGeometry( sizing );
    var bones = createBones( sizing );
    mesh = createMesh( geometry, bones );

    mesh.scale.multiplyScalar( 1 );
    scene.add( mesh );

};

function render () {

    requestAnimationFrame( render );

    var time = Date.now() * 0.001;

    var bone = mesh;


    //Wiggle the bones
    if ( state.animateBones ) {

        for ( var i = 0; i < mesh.skeleton.bones.length; i ++ ) {

            mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;

        }

    }

    skeletonHelper.update();

    renderer.render( scene, camera );

};

initScene();
render();