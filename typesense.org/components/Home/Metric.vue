<template>
  <div class="metric d-flex justify-items-center align-items-center">
    <div class="text-display-font metric-value">
      <a :href="metricLink" target="_blank" class="metric-link">{{
        metricValue
      }}</a>
    </div>
    <div class="metric-name">
      <a :href="metricLink" target="_blank" class="metric-link">{{
        metricName
      }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    metricName: {
      type: String,
      default: 'Metric Name',
    },
    metricValue: {
      type: String,
      default: '10.1K',
    },
    metricLink: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped lang="scss">
.metric-name {
  line-height: 1.5;
  white-space: pre-line;
  margin-left: 15px;
  text-align: left;
}
.metric-value {
  border-right: 2px solid $primary;
  padding: 0 15px;
  font-size: 3rem;
  text-shadow: 0px 0px 30px rgba(253, 220, 25, 0.52);
}
.metric-link {
  text-decoration: none;
  transition: text-shadow 0.1s ease, color 0.1s ease;
  &:hover {
    text-decoration: none;
    text-shadow: 0px 0px 20px #ffdd1785;
  }
}
</style>
