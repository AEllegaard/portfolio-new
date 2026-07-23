<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollSmoother from "gsap/ScrollSmoother"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

let cursor = null
let cleanupCursor = () => {}

const initCursor = () => {
  if (!window.matchMedia('(pointer: coarse)').matches) {
    cursor = document.createElement('div')
    cursor.classList.add('custom-cursor')
    document.body.appendChild(cursor)

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    document.addEventListener('mousemove', moveCursor)

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', moveCursor)
      if (cursor) {
        document.body.removeChild(cursor)
      }
    }
  }
  return () => {}
}

onMounted(() => {
  // Initialize cursor only on non-mobile devices
  cleanupCursor = initCursor()

  // GSAP ScrollSmoother
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true
  })
})

onUnmounted(() => {
  // Remove cursor if it exists
  if (cleanupCursor) cleanupCursor()
})
</script>

<template>
  <header class="flex w-full font-display font-light sticky top-0 z-50 bg-back-100">
    <nav class="h-10 flex items-center justify-center md:justify-end gap-6 md:gap-8 md:px-9 w-full py-6">
      <router-link to="/" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Home</span>
      </router-link>
      <router-link to="/work" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Work</span>
      </router-link>
      <router-link to="/about" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">About</span>
      </router-link>
      <router-link to="/contact" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Contact</span>
      </router-link>
    </nav>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.radio-circle {
  width: 10px;
  height: 10px;
  border: 1px solid #000;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: all 0.5s ease;
}

.radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background-color: #000;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.5s ease;
}

.nav-item.router-link-active .radio-circle::after {
  width: 9px;
  height: 9px;
  opacity: 0.8;
}

.nav-text {
  font-size: 0.9rem;
}

/* Hide custom cursor on mobile devices */
@media (pointer: coarse) {
  .custom-cursor {
    display: none !important;
  }
}
</style>