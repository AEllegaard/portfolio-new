<template>
  <div>
    <h1 class="font-display font-light mx-4 mt-20 text-lg md:text-5xl md:leading-[70px] tracking-tight">
      All my projects - <br>
      <span class="like-cursor bg-green-100 p-1">That I like.</span>
    </h1>

    <!-- projekt header -->
    <div class="md:mx-4 mt-30 font-display">
      <div class="grid grid-cols-4 w-full items-center ml-2 font-display border-b-1">
        <h2 class="font-display font-light text-sm md:text-lg">Title</h2>
        <h2 class="font-display font-light text-sm md:text-lg">Date</h2>
        <h2 class="font-display font-light text-sm md:text-lg -ml-1">Category</h2>
      </div>

      <!-- projekt liste -->
      <div v-for="project in projects" :key="project.slug">
        <div
          class="flex h-10 w-full cursor-pointer"
          @click="toggleProject(project.slug)"
          @mouseover="handleMouseOver(project.hover)"
          @mousemove="updatePosition"
          @mouseleave="handleMouseLeave"
        >
          <div class="grid grid-cols-4 w-full items-center mt-2 ml-2 font-display hover:opacity-50">
            <h2 class="font-display font-light"
              :class="{
                'text-sm md:text-lg': expandedProjectSlug !== project.slug,
                'text-lg md:text-lg': expandedProjectSlug === project.slug
              }"
            >
              {{ project.title }}
            </h2>

            <h2 class="font-display font-light"
              :class="{
                'text-sm md:text-lg': expandedProjectSlug !== project.slug,
                'text-lg md:text-lg': expandedProjectSlug === project.slug
              }"
            >
              {{ project.dato }}
            </h2>

            <h2 class="font-display font-light"
              :class="{
                'text-sm md:text-lg': expandedProjectSlug !== project.slug,
                'text-lg md:text-lg': expandedProjectSlug === project.slug
              }"
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

        <!-- Udvidet projekt info: 50/50 tekst og slideshow -->
        <div
          v-if="expandedProjectSlug === project.slug"
          class="border-t-0.5 border-green-100 overflow-hidden"
          :ref="el => expandedBoxes[project.slug] = el"
        >
          <div class="flex flex-col md:flex-row w-full mt-4 mb-6 gap-6 md:gap-4">

            <!-- Tekst, 50% -->
            <div class="w-full md:w-1/2 ml-2 expand-col">
              <p class="font-display font-light text-base text-justify">
                {{ project.description }}
                <a class="text-green-100 underline" target="_blank" :href="project.link">
                  {{ project.linktext }}
                </a>
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
              </div>

              <!-- Dots til manuel navigation, kun hvis der er mere end 1 billede -->
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
                  :aria-label="'Vis billede ' + (index + 1)"
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

    <!-- Modal -->
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
      slideTimers: {}
    };
  },

  mounted() {
    fetch('/projects.json')
      .then(response => response.json())
      .then(data => {
        this.projects = data;
      });

    this.detectTouchDevice();
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    Object.values(this.slideTimers).forEach(timerId => clearInterval(timerId));
  },

  methods: {
    // Galleri: brug project.images hvis det findes og ikke er tomt, ellers fald tilbage til preview
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

      // Klik på det allerede åbne projekt: luk det
      if (previousSlug === slug) {
        this.closeProject(slug);
        return;
      }

      // Der er et andet projekt åbent: luk det først, åbn så det nye
      if (previousSlug) {
        this.closeProject(previousSlug, () => {
          this.openProject(slug);
        });
        return;
      }

      // Intet er åbent: åbn direkte
      this.openProject(slug);
    },

    openProject(slug) {
      this.expandedProjectSlug = slug;
      this.$set(this.slideIndexes, slug, 0);

      this.$nextTick(() => {
        const box = this.expandedBoxes[slug];
        if (!box) return;

        const cols = box.querySelectorAll('.expand-col');
        gsap.set(cols, { opacity: 0, y: 14 });

        gsap.fromTo(
          box,
          { height: 0, opacity: 0 },
          {
            height: box.scrollHeight,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              box.style.height = "auto";
            }
          }
        );

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

      const project = this.projects.find(p => p.slug === slug);
      if (!project) return;

      const images = this.getGalleryImages(project);
      if (images.length <= 1) return;

      this.slideTimers[slug] = setInterval(() => {
        const current = this.slideIndexes[slug] || 0;
        this.$set(this.slideIndexes, slug, (current + 1) % images.length);
      }, 3500);
    },

    stopSlideshow(slug) {
      if (this.slideTimers[slug]) {
        clearInterval(this.slideTimers[slug]);
        delete this.slideTimers[slug];
      }
    },

    goToSlide(project, index) {
      this.$set(this.slideIndexes, project.slug, index);
      // Nulstil timeren, så autoplay ikke skifter væk igen med det samme
      this.startSlideshow(project.slug);
    },

    showHoverImage(image) {
      this.hoverImage = image;
    },

    updatePosition(event) {
      if (!this.isTouchDevice) {
        this.mouseX = event.clientX + 1;
        this.mouseY = event.clientY + 1;
      }
    },

    hideHoverImage() {
      this.hoverImage = null;
    },

    handleMouseOver(hoverImage) {
      if (!this.isTouchDevice) {
        this.showHoverImage(hoverImage);
      }
    },

    handleMouseLeave() {
      if (!this.isTouchDevice) {
        this.hideHoverImage();
      }
    },

    detectTouchDevice() {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    showModal(media) {
      this.modalMedia = media;
    },

    closeModal() {
      this.modalMedia = null;
    },

    handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped>
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
  max-width: 100%;
  max-height: 100%;
}

.modal-media {
  max-width: 50vw;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

.video-responsive {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .video-responsive {
    max-width: 90%;
    max-height: 200px;
  }
}

@media (hover: none) {
  .hover-image {
    display: none !important;
  }
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