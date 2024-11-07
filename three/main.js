import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 5, 0);
//    controls.autoRotate = true;
    controls.update();

var face=0;
var facedir=0;
const loader2 = new GLTFLoader();
loader2.load( '/res/snatch.gltf', function ( gltf ) { 
  face = gltf;
  scene.add( gltf.scene );
  scene.rotation.z=-5;
  scene.rotation.x=0.2;
  scene.rotation.y=1.6;
  scene.position.set(0,5 ,0);
  gltf.asset; // Object
}, undefined, function ( error ) { console.error( error ); } );
    const color = 0xFFFFFF;
    const intensity = 0.1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
console.log(loader2)

function animate() {
  renderer.render( scene, camera ); 
  if(face!=0){
    if(facedir==0){
    if(face.scene.rotation.y>0.2){
      facedir=1;
    }else{
    face.scene.rotation.y+=0.0001;
    }
    }else{
    if(face.scene.rotation.y<-0.2){
      facedir=0;
    }else{
    face.scene.rotation.y-=0.0001;
    }
    }
    console.log(face.scene.rotation.y);
  }
}


renderer.setAnimationLoop( animate);
