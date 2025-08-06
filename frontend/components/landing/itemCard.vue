<template>
  <div class="item-card" @click="navigateTo">
    <div class="card-container">
      <!-- Left side - Icon area -->
      <div class="icon-section">
        <div class="icon-container">
          <img :src="image" :alt="title" class="icon-image" />
        </div>
      </div>
      
      <!-- Right side - Text content -->
      <div class="content-section" :style="{ backgroundColor: backgroundColor }">
        <div class="content-wrapper">
          <h2 class="card-title">{{ title }}</h2>
          <p class="card-description">{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemCard',
  
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    backgroundColor: {
      type: String,
      default: '#DD3C51'
    },
    link: {
      type: String,
      default: ''
    }
  },
  
  methods: {
    navigateTo() {
      if (this.link) {
        this.$router.push(this.link);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.item-card {
  width: 100%;
  max-width: 100%;
  margin: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.card-container {
  display: flex;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.icon-section {
  width: 30%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #fff;
}

.icon-image {
  max-width: 60px;
  max-height: 60px;
  object-fit: contain;
  filter: grayscale(0%);
  transition: filter 0.3s ease;
}

.item-card:hover .icon-image {
  filter: brightness(1.2) saturate(1.8) contrast(1.2);
}

.content-section {
  width: 70%;
  padding: 10px;
  display: flex;
  align-items: center;
}

.content-wrapper {
  width: 100%;
}

.card-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  line-height: 1.3;
  text-align: left;
}

.card-description {
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  opacity: 0.95;
}

// Responsive design
@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
  }
  
  .icon-section {
    width: 100%;
    border-right: none;
  }
  
  .content-section {
    width: 100%;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .card-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .item-card {
    margin: 10px;
  }
  
  .card-container {
    border-radius: 6px 6px 0 0;
  }
  
  .icon-section {
    padding: 15px;
  }
  
  .content-section {
    padding: 15px;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .card-description {
    font-size: 0.85rem;
  }
}
</style>