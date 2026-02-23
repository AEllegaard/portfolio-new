<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// ============================================
// KONFIGURATION - HER KAN DU TILFØJE/FJERNE ORD OG STYLE DEM
// ============================================

const nameBox = ref({
  text: 'Anna Ellegaard',
  class: 'word-name'
})

const words = ref([
  { text: 'Digital Designer', class: 'word-large text-green-100' },
  { text: 'Game Dev', class: 'word-large text-green-100' },
  { text: 'Playful Design', class: 'word-large text-green-100' },
  { text: 'Creative Code', class: 'word-large text-green-100' },
  { text: 'Experience Designer', class: 'word-large text-green-100' },
  { text: 'Bold Ideas', class: 'word-large text-green-100' },
  { text: 'Creative Tech', class: 'word-large text-green-100' },
  { text: 'Immersive Media', class: 'word-large text-green-100' },
])

let engine, render, runner
let bodies = []

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js'
  script.onload = () => setTimeout(initMatter, 200)
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (runner && window.Matter) {
    window.Matter.Render.stop(render)
    window.Matter.Runner.stop(runner)
  }
})

function initMatter() {
  const Matter = window.Matter
  const {Engine, Render, Bodies, Composite, MouseConstraint, Mouse} = Matter

  // Create engine
  engine = Engine.create()
  const world = engine.world
  
  // FORCE gravity settings - Reduced for realistic physics
  engine.gravity.x = 0
  engine.gravity.y = 0.5  // REDUCED from 1
  engine.gravity.scale = 0.001  // Standard Matter.js scale
  
  console.log('Gravity set to:', engine.gravity)

  const matterBox = document.querySelector('.matter-box')
  const nameElem = document.querySelector('.name-box')
  const wordElems = document.querySelectorAll('.word-box')
  
  if (!matterBox || !nameElem || wordElems.length === 0) return

  const width = matterBox.clientWidth
  const height = matterBox.clientHeight

  // Add walls
  Composite.add(world, [
    Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
    Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
    Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
    Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true })
  ])

  // Create Anna body - nederst i midten
  const nameW = nameElem.offsetWidth
  const nameH = nameElem.offsetHeight
  const nameX = width / 2
  const nameY = height - 100
  
  const nameBody = Bodies.rectangle(nameX, nameY, nameW, nameH)
  Composite.add(world, nameBody)

  // Create word bodies - stablet ovenpå hinanden fra bunden
  const wordBodies = []
  let currentY = height - 200 // Start over Anna
  
  wordElems.forEach((elem, i) => {
    const w = elem.offsetWidth
    const h = elem.offsetHeight
    const x = width / 2 + (Math.random() - 0.5) * 200 // Lidt spredt omkring midten
    
    const body = Bodies.rectangle(x, currentY, w, h)
    Composite.add(world, body)
    wordBodies.push(body)
    
    currentY -= h + 10 // Næste boks lidt over
  })

  console.log('Bodies created:', wordBodies.length + 1, 'Total in world:', world.bodies.length)

  // Create renderer
  render = Render.create({
    element: matterBox,
    engine: engine,
    options: { width, height, wireframes: false, background: 'transparent' }
  })

  render.canvas.style.opacity = '0'
  render.canvas.style.position = 'absolute'
  render.canvas.style.zIndex = '1'

  Render.run(render)

  // Add mouse
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2 }
  })
  Composite.add(world, mouseConstraint)
  render.mouse = mouse

  // Change cursor based on hover/grab
  render.canvas.style.cursor = 'grab'
  
  Matter.Events.on(mouseConstraint, 'mousedown', () => {
    if (mouseConstraint.body) {
      render.canvas.style.cursor = 'grabbing'
    }
  })
  
  Matter.Events.on(mouseConstraint, 'mouseup', () => {
    render.canvas.style.cursor = 'grab'
  })
  
  Matter.Events.on(mouseConstraint, 'startdrag', () => {
    render.canvas.style.cursor = 'grabbing'
  })
  
  Matter.Events.on(mouseConstraint, 'enddrag', () => {
    render.canvas.style.cursor = 'grab'
  })

  // Manual update loop
  let frameCount = 0
  function updatePhysics() {
    Engine.update(engine, 1000 / 60)
    
    frameCount++
    if (frameCount === 1 || frameCount === 60) {
      console.log(`Frame ${frameCount}: Word 0 Y = ${wordBodies[0].position.y.toFixed(1)}, Velocity = ${wordBodies[0].velocity.y.toFixed(2)}`)
    }

    // Update DOM
    nameElem.style.left = (nameBody.position.x - nameW / 2) + 'px'
    nameElem.style.top = (nameBody.position.y - nameH / 2) + 'px'
    nameElem.style.transform = `rotate(${nameBody.angle}rad)`

    wordBodies.forEach((body, i) => {
      const elem = wordElems[i]
      elem.style.left = (body.position.x - elem.offsetWidth / 2) + 'px'
      elem.style.top = (body.position.y - elem.offsetHeight / 2) + 'px'
      elem.style.transform = `rotate(${body.angle}rad)`
    })

    requestAnimationFrame(updatePhysics)
  }

  updatePhysics()

  // Log after 1 second
  setTimeout(() => {
    console.log('After 1 sec - Word 0 Y:', wordBodies[0].position.y.toFixed(1))
  }, 1000)
}
</script>

<template>
  <div class="matter-box">
    <!-- Anna Ellegaard boks - fast position -->
    <div class="name-box" :class="nameBox.class">
      {{ nameBox.text }}
    </div>
    
    <!-- Faldende ord bokse -->
    <div
      v-for="(word, index) in words"
      :key="index"
      class="word-box"
      :class="word.class"
    >
      {{ word.text }}
    </div>
  </div>
</template>

<style scoped>
.matter-box {
  width: 100%;
  height: 80vh;
  position: relative;
  overflow: hidden;
  background-color: var(--color-back-100, #F5F5F5);
}

.name-box,
.word-box {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: 400;
  user-select: none;
  padding: 0.75rem 2rem;
  background: #fff;
  color: #000;
  transform-origin: center center;
  z-index: 10;
  will-change: transform;
}

/* ============================================
   STYLING - HER KAN DU STYLE ORDENE
   ============================================ */

/* Anna Ellegaard boks */
.word-name {
  font-size: 3rem;
  padding: 0px 15px;
  background-color: var(--color-green-100, #46FB47);
  font-weight: 400;
  z-index: 10;
}

/* Størrelse klasser for faldende ord */
.word-large {
  font-size: 2.5rem;
  padding: 0px 15px;
}


/* Farve klasser */
.text-green-100 {
  background-color: var(--color-green-100, #46FB47);
}

.text-red-100 {
  background-color: var(--color-red-100, #FE5F58);
}

.text-yellow-100 {
  background-color: var(--color-yellow-100, #FFBC30);
}
</style>