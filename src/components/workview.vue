<template>
  <div>
    <h1 class="font-display font-light mx-4 mt-20 text-lg md:text-5xl md:leading-[70px] tracking-tight">
      All my projects - <br />
      <span class="like-cursor bg-green-100 p-1">That I like.</span>
    </h1>

    <!-- projekt header -->
    <div class="md:mx-4 mt-30 font-display">
      <div class="grid grid-cols-4 w-full items-center ml-2 font-display border-b-1">
        <h2 class="font-display font-light text-sm md:text-lg col-span-2 md:col-span-1">Title</h2>
        <h2 class="font-display font-light text-sm md:text-lg hidden md:block">Year</h2>
        <h2 class="font-display font-light text-sm md:text-lg -ml-1">Category</h2>
      </div>

      <!-- projekt liste -->
      <div v-for="project in projects" :key="project.slug">
        <div
          class="flex h-9 md:h-10 w-full cursor-pointer"
          @click="toggleProject(project.slug)"
          @mouseover="handleMouseOver(project.hover)"
          @mousemove="updatePosition"
          @mouseleave="handleMouseLeave"
        >
          <div class="grid grid-cols-4 w-full items-center mt-2 ml-2 font-display hover:opacity-50">
            <h2 class="font-display font-light text-sm md:text-lg col-span-2 md:col-span-1">
              {{ project.title }}
            </h2>

            <h2
              class="font-display font-light text-sm md:text-lg hidden md:block"
            >
              {{ project.dato }}
            </h2>

            <h2
              class="font-display font-light text-sm md:text-lg"
            >
              {{ project.kategori }}
            </h2>

            <img
              class="w-18 md:w-22 h-8 object-cover justify-self-end mr-2"
              :src="project.preview"
              alt=""
            />
          </div>
        </div>

        <!-- Expanded project info: 50/50 text and slideshow -->
        <div
          v-if="expandedProjectSlug === project.slug"
          class="border-t-0.5 border-green-100 overflow-hidden bg-gray-200 mt-4"
          :ref="el => expandedBoxes[project.slug] = el"
        >
          <div class="flex flex-col md:flex-row w-full mt-1 mb-4 gap-6 md:gap-4">
            <!-- Text, 50% -->
            <div class="w-full md:w-1/2 ml-2 expand-col">
              <p class="font-display font-light text-base text-justify w-full md:w-1/2 pr-4 expand-col break-words">
                {{ project.description }}
                <a class="bg-green-100 px-1 underline" target="_blank" :href="project.link"
                  >{{ project.linktext }}</a
                >
              </p>
            </div>

            <!-- Slideshow, 50% -->
            <div class="w-full md:w-1/2 md:mr-4 expand-col">
              <div class="slideshow-frame relative w-full aspect-video overflow-hidden bg-black/5">
                <template v-for="(media, index) in getGalleryImages(project)" :key="media + index">
                  <video
                    v-if="isVideo(media)"
                    :src="media"
                    class="slideshow-media"
                    :class="{ 'is-active': (slideIndexes[project.slug] || 0) === index }"
                    autoplay
                    loop
                    muted
                    playsinline
                    @click="showModal(media)"
                  ></video>

                  <img
                    v-else
                    :src="media"
                    alt="Project media"
                    class="slideshow-media"
                    :class="{ 'is-active': (slideIndexes[project.slug] || 0) === index }"
                    @click="showModal(media)"
                  />
                </template>

                <button
                  v-if="getGalleryImages(project).length > 1"
                  class="slide-arrow slide-arrow-left"
                  @click.stop="prevSlide(project)"
                  aria-label="Previous image"
                >‹</button>
                <button
                  v-if="getGalleryImages(project).length > 1"
                  class="slide-arrow slide-arrow-right"
                  @click.stop="nextSlide(project)"
                  aria-label="Next image"
                >›</button>
              </div>

              <!-- Dots for manual navigation, only if more than 1 image -->
              <div
                v-if="getGalleryImages(project).length > 1"
                class="flex justify-center gap-2 mt-3"
              >
                <button
                  v-for="(media, index) in getGalleryImages(project)"
                  :key="'dot-' + media + index"
                  class="slideshow-dot"
                  :class="{ 'is-active': (slideIndexes[project.slug] || 0) === index }"
                  @click.stop="goToSlide(project, index)"
                  :aria-label="'Show image ' + (index + 1)"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hover preview -->
        <div
          v-if="hoverImage"
          class="hover-media min-w-60 max-h-60"
          :style="{ top: mouseY + 'px', left: mouseX + 'px' }"
        >
          <video
            v-if="hoverImage.endsWith('.webm') || hoverImage.endsWith('.mp4')"
            :src="hoverImage"
            autoplay
            loop
            muted
            playsinline
            class="video-responsive"
          ></video>

          <img
            v-else
            :src="hoverImage"
            alt="Hover preview"
            class="object-contain max-w-60 max-h-60"
          />
        </div>
      </div>
    </div>

    <!-- Modal for full media view -->
    <div
      v-if="modalMedia"
      class="fixed inset-0 z-50 bg-[rgba(130,130,130,0.8)] flex items-center justify-center"
      @click.self="closeModal"
    >
      <div class="modal-wrapper">
        <video
          v-if="modalMedia.endsWith('.webm') || modalMedia.endsWith('.mp4')"
          :src="modalMedia"
          class="modal-media"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <img
          v-else
          :src="modalMedia"
          alt="Full view"
          class="modal-media"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default {
  data() {
    return {
      projects: [],
      expandedProjectSlug: null,
      hoverImage: null,
      mouseX: 0,
      mouseY: 0,
      isTouchDevice: false,
      modalMedia: null,
      expandedBoxes: {},
      slideIndexes: {},
      slideTimers: {},
      scrollDelay: 0.1 // seconds for smooth scrolling
    };
  },

  mounted() {
    fetch('/projects.json')
      .then((response) => response.json())
      .then((data) => {
        this.projects = data;
      });
    this.detectTouchDevice();
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    Object.values(this.slideTimers).forEach((timerId) => clearInterval(timerId));
  },

  methods: {
    getGalleryImages(project) {
      if (project.images && project.images.length) {
        return project.images;
      }
      return [project.preview];
    },

    isVideo(media) {
      return media.endsWith('.webm') || media.endsWith('.mp4');
    },

    toggleProject(slug) {
      const previousSlug = this.expandedProjectSlug;
      if (previousSlug === slug) {
        this.closeProject(slug);
        return;
      }
      if (previousSlug) {
        this.closeProject(previousSlug, () => {
          this.openProject(slug);
        });
        return;
      }
      this.openProject(slug);
    },

    openProject(slug) {
  this.expandedProjectSlug = slug;
  this.slideIndexes[slug] = 0;

  this.$nextTick(() => {
    const box = this.expandedBoxes[slug];
    if (!box) return;

    const cols = box.querySelectorAll('.expand-col');
    gsap.set(cols, { opacity: 0, y: 14 });

    // Animate height from 0 to scrollHeight
    gsap.fromTo(
      box,
      { height: 0, opacity: 0 },
      {
        height: box.scrollHeight,
        opacity: 1,
        duration: 0.50,
        ease: "power2.out",
        onComplete: () => {
          // Set height to auto for responsiveness
          box.style.transition = 'height 0.3s ease';
          box.style.height = 'auto';

          // After height transition, scroll smoothly into view
          gsap.to(window, {
            duration: this.scrollDelay,
            scrollTo: box,
            ease: "power2.out",
            onComplete: () => {
              // Clean up transition
              box.style.transition = '';
            }
          });
        }
      }
    );

    // Animate the columns' opacity and position
    gsap.to(cols, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.1,
      stagger: 0.08,
      ease: "power2.out"
    });
  });

  this.startSlideshow(slug);
},

    closeProject(slug, onComplete) {
      this.stopSlideshow(slug);
      const box = this.expandedBoxes[slug];
      if (!box) {
        if (this.expandedProjectSlug === slug) this.expandedProjectSlug = null;
        if (onComplete) onComplete();
        return;
      }

      const fullHeight = box.scrollHeight;

      gsap.fromTo(
        box,
        { height: fullHeight, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            if (this.expandedProjectSlug === slug) {
              this.expandedProjectSlug = null;
            }
            if (onComplete) onComplete();
          }
        }
      );
    },

    startSlideshow(slug) {
      this.stopSlideshow(slug);
      const project = this.projects.find((p) => p.slug === slug);
      if (!project) return;

      const images = this.getGalleryImages(project);
      if (images.length <= 1) return;

      this.slideTimers[slug] = setInterval(() => {
        const current = this.slideIndexes[slug] || 0;
        this.slideIndexes[slug] = (current + 1) % images.length;
      }, 5000);
    },

    stopSlideshow(slug) {
      if (this.slideTimers[slug]) {
        clearInterval(this.slideTimers[slug]);
        delete this.slideTimers[slug];
      }
    },

    goToSlide(project, index) {
      this.slideIndexes[project.slug] = index;
      this.startSlideshow(project.slug);
    },

    nextSlide(project) {
      const images = this.getGalleryImages(project);
      const current = this.slideIndexes[project.slug] || 0;
      this.slideIndexes[project.slug] = (current + 1) % images.length;
      this.startSlideshow(project.slug);
    },

    prevSlide(project) {
      const images = this.getGalleryImages(project);
      const current = this.slideIndexes[project.slug] || 0;
      this.slideIndexes[project.slug] = (current - 1 + images.length) % images.length;
      this.startSlideshow(project);
    },

    showModal(media) {
      this.modalMedia = media;
    },

    closeModal() {
      this.modalMedia = null;
    },

    handleMouseOver(hoverImage) {
      if (!this.isTouchDevice) {
        this.hoverImage = hoverImage;
      }
    },

    handleMouseLeave() {
      if (!this.isTouchDevice) {
        this.hoverImage = null;
      }
    },

    updatePosition(event) {
      if (!this.isTouchDevice) {
        this.mouseX = event.clientX + 1;
        this.mouseY = event.clientY + 1;
      }
    },

    detectTouchDevice() {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    showModal(media) {
      this.modalMedia = media;
    },

    handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    },

    getGalleryImages(project) {
      if (project.images && project.images.length) {
        return project.images;
      }
      return [project.preview];
    },

    isVideo(media) {
      return media.endsWith('.webm') || media.endsWith('.mp4');
    },
  }
};
</script>

<style scoped>
/* Enable smooth scrolling globally */
html {
  scroll-behavior: smooth;
}

/* Your existing styles... */
.hover-media {
  position: fixed;
  width: 150px;
  height: auto;
  pointer-events: none;
  z-index: 1000;
}
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-media {
  max-width: 50vw;
  max-height: 80vh;
  object-fit: contain;
}
.video-responsive {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
}
.slideshow-frame {
  border-radius: 2px;
}
.slideshow-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
  cursor: pointer;
}
.slideshow-media.is-active {
  opacity: 1;
}
.slide-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  z-index: 10;
}
.slide-arrow-left {
  left: 8px;
}
.slide-arrow-right {
  right: 8px;
}
.slideshow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  padding: 0;
}
.slideshow-dot.is-active {
  background-color: rgb(163, 230, 53);
}
</style>