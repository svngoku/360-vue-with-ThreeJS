const container = document.body
const tooltip = document.querySelector('.tooltip')
let spriteActive = false

/* Class SceneB */
class Scene {
  constructor(image, camera) {
    this.image = image
    this.points = []
    this.sprites = []
    this.scene = null
    this.camera = camera
  }

  createScene(scene) {
    this.scene = scene
    /* Definition de la sphere */
    const geometry = new THREE.SphereGeometry( 50, 32, 32 )
    const texture = new THREE.TextureLoader().load(this.image)
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.x = -1
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    material.transparent = true
    this.sphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphere)
    this.points.forEach(this.addTooltip.bind(this))
  }

  /* TOOLS TYPES*/
  addPoint(point) {
    this.points.push(point)
  }

   addTooltip( point ) {
    let spriteMap = new THREE.TextureLoader().load( "assets/info.png" )
    let spriteMaterial = new THREE.SpriteMaterial({
      map: spriteMap
    })
    let sprite = new THREE.Sprite( spriteMaterial )
    sprite.name = point.name
    sprite.position.copy(point.position.clone().normalize().multiplyScalar(30))
    sprite.scale.multiplyScalar(2)
    this.scene.add( sprite )
    this.sprites.push( sprite )
    sprite.onClick = () => {
      this.destroy()
      point.scene.createScene(scene)
      point.scene.appear()
    }
  }

  destroy(){
    TweenLite.to(this.sphere.material, 1, {
      opacity: 0,
      onComplete: () => {
        this.scene.remove(this.sphere)
      }
    })
    this.sprites.forEach((sprite) => {
      TweenLite.to(sprite.scale, 1, {
        x: 0,
        y: 0,
        z: 0,
        onComplete: () => {
          this.scene.remove(sprite)
        }
      })
    })
  }

/**********PARTIE APPARITION************/
  appear(){
    this.sphere.material.opacity = 0
    TweenLite.to(this.sphere.material, 1, {
      opacity:  1
    })
    this.sprites.forEach((sprite) => {
      sprite.scale.set(0,0,0)
      TweenLite.to(sprite.scale, 1, {
        x: 2,
        y: 2,
        z: 2
      })
    })
  }
}
/* END CLASS */

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
let s = new Scene('assets/360-plage.jpg',camera)
let s2 = new Scene('assets/360-3.jpg',camera)

//interconnection scene
s.addPoint({
  position: new THREE.Vector3(48.39841923242322, -7.2566635097418235 ,-11.436779997969428 ),
  name: 'Narnia gates',
  scene: s2
})
s2.addPoint({
  position: new THREE.Vector3(1, 0.5 ,0 ),
  name: 'Sortie',
  scene: s
})

s.createScene(scene) //first point on Scene

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
function onClick (e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth ) * 2 - 1,
    - (e.clientY / window.innerHeight ) * 2 + 1
  )
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
