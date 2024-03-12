<template>
  <div class="container">
    <div class="grid-container">
      <div class="grid-item">
        <HomeMetric
          :metric-name="`GitHub\nStars`"
          :metric-value="`${githubStars}`"
          metric-link="https://github.com/typesense/typesense"
          :data-aos="animationEffect"
          :data-aos-duration="animationDuration"
        ></HomeMetric>
      </div>
      <div class="grid-item">
        <HomeMetric
          :metric-name="`Docker\nPulls`"
          :metric-value="`${dockerPulls}`"
          metric-link="https://hub.docker.com/r/typesense/typesense"
          :data-aos="animationEffect"
          :data-aos-duration="animationDuration"
        ></HomeMetric>
      </div>
      <div class="grid-item">
        <HomeMetric
          :metric-name="`Typesense Cloud\nSearches per Month`"
          :metric-value="`${cloudSearchesPerMonth}`"
          metric-link="https://cloud.typesense.org"
          :data-aos="animationEffect"
          :data-aos-duration="animationDuration"
        ></HomeMetric>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      githubStars: '17K',
      dockerPulls: '12M',
      cloudSearchesPerMonth: '3B',
      animationDuration: 350,
      animationEffect: 'zoom-out',
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
