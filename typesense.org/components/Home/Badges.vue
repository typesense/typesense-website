<template>
  <div class="container">
    <div class="grid-container">
      <div class="grid-item">
        <HomeMetric
          :metric-name="`GitHub\nStars`"
          :metric-value="`${githubStars}`"
        ></HomeMetric>
      </div>
      <div class="grid-item">
        <HomeMetric
          :metric-name="`Docker\nPulls`"
          :metric-value="`${dockerPulls}`"
        ></HomeMetric>
      </div>
      <div class="grid-item">
        <HomeMetric
          :metric-name="`Typesense Cloud\nSearches per Month`"
          :metric-value="`${cloudSearchesPerMonth}`"
        ></HomeMetric>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      githubStars: '15K',
      dockerPulls: '8.5M',
      cloudSearchesPerMonth: '1.5B',
    }
  },
}
</script>

<style scoped>
a {
  border-bottom: unset;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; /* Space between grid items */
  align-items: center; /* Vertical alignment */
  justify-items: center; /* Horizontal alignment */

  .grid-item {
    padding: 20px;
    text-align: center;
  }

  /* Responsive */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: start; /* Horizontal alignment */
  }
}
</style>
