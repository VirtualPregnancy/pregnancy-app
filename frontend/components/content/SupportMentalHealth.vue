<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-xl  font-bold text-center text-blue-600 mb-6">Why maternal mental health is important</h1>
    <p class="text-left mb-3">
      Maternal mental health is crucial for strong families in New Zealand. 
      During the first 1,000 days from conception to age two, 12-18% of 
      mothers and 10% of fathers experience mental health issues, 
      with higher rates among Māori, Pacific, and Asian populations. 
      Poor maternal mental health can lead to inadequate prenatal care, 
      preterm birth, and negative parent-infant relationships, resulting in 
      children having difficult temperaments, poor health, developmental delays, 
      and long-term behavioral problems that affect their lifelong wellbeing.
    </p>

    <div class="text-center text-gray-600 mb-8">
      <p class="text-lg text-left mb-3 text-bold">Services that help you navigate pregnancy mental health in Aotearoa New Zealand:</p>
      <ul class="list-disc list-inside space-y-3 text-left ">  
        <li  v-for="service in mentalHealthServices['National']" :key="service.name">
          <span class="cursor-pointer hover:text-blue-600 transition-colors " @click="openServiceLink(service)">
        <v-icon color="primary" size="20" class="mt-0.5">mdi-heart-outline</v-icon>
          <strong>{{ service.name }}</strong>
          <v-icon color="blue" size="16" class="ml-2">mdi-open-in-new</v-icon>
          </span>
          <p class="text-left mb-3 font-italic">{{ service.description }}</p>
        </li>
      </ul>
    </div>


  </div>
</template>

<script>
import { mentalHealthServices } from "@/assets/data/supportData.json";
export default {
  layout: "default",
  name: "SupportMentalHealth",
  data() {
    return {
      title:"Mental Health Support Services",
      mentalHealthServices:mentalHealthServices,
    };
  },
  methods: {
    openServiceLink(service) {
      window.open(service.link, "_blank");
    },
  },
};

</script>

<style lang="scss" scoped>
// Simple responsive design with Tailwind CSS
.max-w-4xl {
  max-width: 56rem;
}

// Ensure proper spacing and alignment
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
ul
{
    list-style-type: none;
}

// Cursor pointer for clickable items
.cursor-pointer {
  cursor: pointer;
}

// Smooth transitions
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out;
}

// Responsive text sizes
@media (max-width: 768px) {
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.15rem;
  }
}
</style>