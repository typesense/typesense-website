<template>
  <div class="version-switcher">
    <select @change="switchVersion">
      <option v-for="version in $site.themeConfig.versions"
              :value="version"
              :selected="version === currentVersion">
        v{{ version }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "VersionDropdown",
  computed: {
    currentVersion() {
      return this.$page.typesenseVersion;
    }
  },
  methods: {
    switchVersion(event) {
      const newVersion = event.target.value;
      if (this.$page.typesenseVersion !== newVersion) {
        this.$router.push(`/${newVersion}/`);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.version-switcher
  display: inline-block;

  select:-ms-expand
    display: none;

  select
    display: inline-block;
    box-sizing: border-box;
    padding: 0 1.6em 0 0.5em;
    border: 1px solid $white;
    font: inherit;
    line-height: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    background-repeat: no-repeat;
    background-image: linear-gradient(45deg, transparent 50%, $accentColor 50%), linear-gradient(135deg, $accentColor 50%, transparent 50%);
    background-position: right 15px top 1.2em, right 10px top 1.2em;
    background-size: 5px 5px, 5px 5px;
</style>
