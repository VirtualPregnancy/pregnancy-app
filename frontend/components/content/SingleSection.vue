<template>
  <div class="w-full">
    <article class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div class="p-6 md:p-10">
        <!-- Use custom component if specified -->
        <component 
          v-if="section.component" 
          :is="section.component"
          v-bind="section.props || {}"
          class="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium"
        />
        <!-- Fallback to HTML content -->
        <div 
          v-else 
          class="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-lg prose-code:bg-slate-100 prose-code:rounded prose-pre:bg-slate-50" 
          v-html="section.content"
        >
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'SingleSection',
  
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Single section specific styles can be added here if needed */
</style>

