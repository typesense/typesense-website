<script setup lang="ts">
const libraries = [
  {
    name: "JavaScript",
    image: "/images/api-libraries/javascript.svg",
    link: "https://github.com/typesense/typesense-js",
    width: 43,
  },
  {
    name: "Go",
    image: "/images/api-libraries/golang.svg",
    link: "https://github.com/typesense/typesense-go",
    width: 106,
  },

  {
    name: "PHP",
    image: "/images/api-libraries/php.svg",
    link: "https://github.com/typesense/typesense-php",
    width: 64,
  },
  {
    name: "Clojure",
    image: "/images/api-libraries/clojure-logo.svg",
    link: "https://github.com/runeanielsen/typesense-clj",
    width: 53,
  },
  {
    name: "Swift",
    image: "/images/api-libraries/swift_logo.svg",
    link: "https://github.com/typesense/typesense-swift",
    width: 47,
  },
  {
    name: "Ruby",
    image: "/images/api-libraries/ruby.svg",
    link: "https://github.com/typesense/typesense-ruby",
    width: 43,
  },
  {
    name: "Python",
    image: "/images/api-libraries/python.svg",
    link: "https://github.com/typesense/typesense-python",
    width: 43,
  },
  {
    name: "Dart",
    image: "/images/api-libraries/logo_dart_192px.svg",
    link: "https://github.com/typesense/typesense-dart",
    width: 51,
  },
  {
    name: ".NET",
    image: "/images/api-libraries/dotnet-logo.svg",
    link: "https://github.com/DAXGRID/typesense-dotnet",
    width: 43,
  },
  {
    name: "Java",
    image: "/images/api-libraries/java.svg",
    link: "https://github.com/typesense/typesense-java",
    width: 30,
  },
];
</script>
<template>
  <section class="max-sm:[&_img]:scale-[80%]">
    <div class="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-1">
      <div class="max-sm:text-center sm:col-span-2">
        <h2>
          <strong>API Libraries</strong> In Your<br class="show-sm" />
          Favorite Languages
        </h2>
        <p class="subtext mb-7 max-sm:mb-6">
          And if you don't find a library, reach out to us to<br
            class="show-sm"
          />
          collab on one
        </p>
      </div>
      <div
        class="grid grid-cols-2 items-end gap-4 max-lg:grid-cols-1 max-sm:grid-cols-2 lg:col-span-2"
      >
        <a
          v-for="(library, i) in libraries.slice(0, 2)"
          :key="library.name"
          :href="library.link"
          target="_blank"
          rel="noopener"
          :class="{
            'max-lg:hidden max-sm:block': i == 1,
          }"
        >
          <Card
            ><img
              :width="library.width"
              :src="library.image"
              :alt="library.name"
          /></Card>
        </a>
      </div>
    </div>
    <div
      class="card-list mt-4 max-sm:mt-3 [&>:first-child]:hidden max-lg:[&>:first-child]:block max-sm:[&>:first-child]:hidden"
    >
      <a
        v-for="library in libraries.slice(1)"
        :key="library.name"
        :href="library.link"
        target="_blank"
        rel="noopener"
      >
        <Card
          ><img :width="library.width" :src="library.image" :alt="library.name"
        /></Card>
      </a>
    </div>
  </section>
</template>
