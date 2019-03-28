import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'

class Globe extends Component {
  constructor(props) {
    super(props);
    this.camera = undefined
    this.mouse = { x: 0, y: 0 };
     this.projector = { x: 0, y: 0 };
    this.targetList = []
    this.controls = undefined
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    var VIEW_ANGLE = 45, ASPECT = width / height, NEAR = 0.1, FAR = 20000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
	this.camera.position.set(0,150,400);
	this.camera.lookAt(this.scene.position);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer( {antialias:true} )
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //ADD CUBE
    const geometry = new THREE.BoxGeometry(2, 1, 5)
    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors })
    const red = new THREE.Color(1, 0, 0);
    for (var i = 0; i < geometry.faces.length; i++) {
      geometry.faces[i].color = red;
    }
    this.cube = new THREE.Mesh(geometry, material)
    //this.cube.geometry.faces[0].color = green

    var faceColorMaterial = new THREE.MeshBasicMaterial( 
        { color: 0xffffff, vertexColors: THREE.FaceColors } );
    var sphereGeometry = new THREE.SphereGeometry( 80, 32, 16 );
	for ( var i = 0; i < sphereGeometry.faces.length; i++ ) 
	{
		let face = sphereGeometry.faces[ i ];	
		face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );		
	}
    var sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
	sphere.position.set(0, 50, 0);
	this.scene.add(sphere);
	
	this.targetList.push(sphere);
   // this.scene.add(this.cube)
    // this.animate = this.animate.bind(this)
    // this.targetList.push(this.cube);

    
    this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.start()
    

  }

  onDocumentMouseDown(event) {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)

    event.preventDefault();
    console.log("Click.");

    // update the mouse variable
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // find intersections
    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    //this.projector.unprojectVector( vector, this.camera );

    var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    ray.setFromCamera(this.mouse, this.camera);
    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects(this.targetList);

    // if there is one (or more) intersections
    if (intersects.length > 0) {
      console.log("Hit @ " + toString(intersects[0].point));
      intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
		intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
      // change the color of the closest face.
    //   const blue = new THREE.Color(0, 0, 1)
    //   intersects[0].object.geometry.faces[intersects[0].faceIndex].color = blue
    //   // forca update de cor
    //   intersects[0].object.geometry.elementsNeedUpdate = true;
      //intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
      // intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
      // intersects[ 0 ].object.geometry.groupsNeedUpdate= true;
      // intersects[ 0 ].object.geometry.lineDistancesNeedUpdate= true;
      // intersects[ 0 ].object.geometry.normalsNeedUpdate= true;
      // intersects[ 0 ].object.geometry.uvsNeedUpdate= true;
      // intersects[ 0 ].object.geometry.verticesNeedUpdate= true;

    }
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
  stop() {
    cancelAnimationFrame(this.frameId)
  }
  animate() {
    // this.cube.rotation.x += 0.01
    // this.cube.rotation.y += 0.01
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }
  renderScene() {
    // habilita que mouse ande pela sala
    this.controls.update();
    this.renderer.render(this.scene, this.camera)
  }
  render() {
    return (
      <div
        style={{ width: '100%', height: '100%', position: 'absolute', left:'0px;', top:'0px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
export default Globe