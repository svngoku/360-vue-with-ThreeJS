var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)


/* Controller */
const controls = new THREE.OrbitControls( camera )
controls.rotateSpeed = 0.2
controls.enableZoom = true //false si vous vouler supprimer le scrool
/*
  controls.autoRotate =  true ;
  Pour laisser tourner la camera automatiquement
*/
camera.position.set(1, 0 , 0)
controls.update()

/* Definition de la sphere */
const geometry = new THREE.SphereGeometry( 50, 32, 32 )
const textureLoader = new THREE.TextureLoader()
const texture = new textureLoader.load('assets/360-3D.jpg')
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
})
const sphere = new THREE.Mesh( geometry, material )
scene.add( sphere )

/* Renderer */
const renderer = new THREE.WebGLRenderer()
 renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )







/* SPECIAL FUNCTIONS */
function animate() {

	requestAnimationFrame( animate )
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update()
	renderer.render( scene, camera )

}
animate()
