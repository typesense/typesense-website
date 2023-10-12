<template>
  <div class="metric d-flex justify-items-center align-items-center">
    <div class="text-display-font metric-value">
      {{ metricValue }}
    </div>
    <div class="metric-name">{{ metricName }}</div>
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
</style>
