<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Simple heading -->
    <h2 class="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
      Pregnancy Support Services
    </h2>
    
    <div class="text-center text-gray-600 mb-8">
      <p class="text-left mb-3 font-bold">Services that help you navigate pregnancy and connect with appropriate care:</p>
      <ul class="list-disc list-inside space-y-3 text-left ">  
        <li class="cursor-pointer hover:text-blue-600 transition-colors" v-for="service in regionalServices['National']" :key="service.name" @click="openServiceLink(service)">
          <v-icon color="green" size="20" class="mt-0.5">mdi-check</v-icon>
          {{ service.name }}
          <v-icon color="blue" size="16" class="ml-2">mdi-open-in-new</v-icon>
        </li>
      </ul>
    </div>

    <div class="text-left mb-3 font-bold">
      Or could also use the dropdown list to identify any regional specific services:
    </div>

    <!-- Services list -->
    <ServiceList :title="title" :regions="regions" :regionalServices="regionalServices" />
  </div>
</template>

<script>
import ServiceList from "@/components/ServiceList.vue";
import { regions, regionalServices } from "@/assets/data/supportData.json";
export default {
  layout: "default",
  name: "SupportPage",
  components: {
    ServiceList,
  },
  data() {
    return {
      regions:regions,
      regionalServices:regionalServices,
      title:"Pregnancy Support Services",
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

// Enhanced hover effects for service items
.shadow-sm:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  transform: translateY(-1px);
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
    font-size: 1.25rem;
  }
}
</style>