const container = document.body
const tooltip = document.querySelector('.tooltip')
let spriteActive = false

/* Def Scene */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 200)
/* Controller */
const controls = new THREE.OrbitControls( camera )
controls.rotateSpeed = 0.2
controls.enableZoom = true //false si vous voulez retirer le scrool
/* controls.autoRotate =  true ;Pour laisser tourner la camera automatiquement*/
camera.position.set(-1, 0 , 0)
controls.update()

/************* CREATE SCENE **************/
let s = new Scene('public/assets/360-plage.jpg',camera)
let s2 = new Scene('public/assets/home.jpg',camera)

//interconnection scene
s.addPoint({
  position: new THREE.Vector3(48.39841923242322, -7.2566635097418235 ,-11.436779997969428 ),
  name: 'Maison',
  scene: s2
})
s2.addPoint({
  position: new THREE.Vector3(1, 0.5 ,0 ),
  name: 'Plage',
  scene: s
})

//first point on Scene
s.createScene(scene) 

/*********** END CREATE SCENE *************/

              /* Renderer */
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
container.appendChild( renderer.domElement )




/* SPECIAL FUNCTIONS */
function animate() {
	requestAnimationFrame( animate )
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update()
	renderer.render( scene, camera )
}

animate()

const rayCaster = new THREE.Raycaster()

function onResize (){
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

/* Donne la position de la souris à travers un repere fournis par la camera ( x et y)*/
function onClick(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth ) * 2 - 1,
    - (e.clientY / window.innerHeight ) * 2 + 1
  );
  //console.log(mouse);
  rayCaster.setFromCamera(mouse, camera)
  let intersects = rayCaster.intersectObjects(scene.children)
  // Foreach permet de parcourir les intersections
  intersects.forEach(function (intersect) {
      if (intersect.object.type === 'Sprite') {
        intersect.object.onClick()
      }
  })
/**
  Pour definir des points

  let intersects = rayCaster.intersectObject(sphere)
  //console.log(interset);

  if (intersects.length > 0) {
    console.log(intersects[0].point)
    addTooltip(intersects[0].point)
  }
**/
}

function onMouseMove(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth ) * 2 - 1,
    - (e.clientY / window.innerHeight ) * 2 + 1
  )
  rayCaster.setFromCamera(mouse, camera)
  let foundSprite = false
  let intersects = rayCaster.intersectObjects(scene.children)
  // Foreach permet de parcourir les intersections
  intersects.forEach(function (intersect) {
      if (intersect.object.type === 'Sprite') {
        let p = intersect.object.position.clone().project(camera)
        tooltip.style.top = ((-1 * p.y + 1) * window.innerHeight / 2 ) + 'px'
        tooltip.style.left = ((p.x + 1) * window.innerWidth / 2 ) + 'px'
        tooltip.classList.add('is-active')
        tooltip.innerHTML = intersect.object.name
        spriteActive = intersect.object
        foundSprite = true
      }
  })
  if (foundSprite === false && spriteActive) {
    /* RETIRE LA CLASS isActive si on n'a pas trouver de sprite*/
    tooltip.classList.remove('is-active')
    spriteActive = false
  }
}

window.addEventListener('resize', onResize)
container.addEventListener('click', onClick)
container.addEventListener('mousemove', onMouseMove)
