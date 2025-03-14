<script setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";
import Dots from "@/assets/images/dots.svg";
</script>
<template>
  <section class="flex items-end justify-between gap-6 max-md:flex-col">
    <div
      class="flex-col items-center max-md:flex max-md:w-full max-md:text-center"
    >
      <Badge>We've got your back</Badge>
      <h2>
        Backed by<br />
        <strong>responsive</strong><br class="max-md:hidden" />
        support
      </h2>
      <p class="subtext">
        Let us help you build a scalable and<br />
        robust search experience
      </p>
    </div>

    <div
      class="overflow-hidden rounded-3xl bg-secondary-bg pr-16 pt-16 max-md:bg-bg max-md:p-0"
    >
      <div
        class="flex max-w-[592px] flex-col gap-4 rounded-tr-3xl bg-bg-gray-2 p-4 shadow-[-5px_4px_34px_0px_rgba(0,_0,_0,_0.10)] max-md:p-0"
      >
        <Dots class="self-end max-md:hidden" />
        <div class="card">
          <div class="description">
            <img
              src="/images/support/priority-support.svg"
              alt="Priority Support"
            />
            <h4>Priority Support</h4>
            <p>
              Fast-tracked assistance directly from the Typesense team, ensuring
              your issues are resolved quickly and efficiently.
            </p>
          </div>
          <div class="heading-cta">
            <h4>Priority Support</h4>
            <Button type="white">Learn More <ArrowRight /></Button>
          </div>
        </div>
        <div class="card">
          <div class="description">
            <img src="/images/support/github-support.svg" alt="Github" />
            <h4>Github</h4>
            <p>
              Access Typesense’s open-source repository on GitHub, where you can
              report issues, request features, and contribute to the ongoing
              development of the project.
            </p>
          </div>
          <div class="heading-cta">
            <h4>Github</h4>
            <Button type="white">Learn More <ArrowRight /></Button>
          </div>
        </div>
        <div class="card !bg-primary">
          <div class="description">
            <img src="/images/support/slack-support.svg" alt="Slack Support" />
            <h4 class="text-text-inverted">Slack</h4>
            <p class="!text-text-inverted">
              Typesense community and team in real-time through Slack. Get quick
              answers, share ideas, and collaborate on solutions in an
              interactive environment.
            </p>
          </div>
          <div class="heading-cta">
            <h4 class="text-text-inverted">Slack</h4>
            <Button>Learn More <ArrowRight /></Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.card {
  @apply flex flex-col gap-8 rounded-2xl bg-bg-gray-3 p-6 max-sm:gap-6;
}

.card p {
  @apply text-sm leading-[1.8] tracking-tight text-text-muted;
}
.heading-cta {
  @apply flex items-center justify-between;
}
.heading-cta h4 {
  @apply max-md:hidden;
}
.description {
  @apply flex gap-6 max-sm:flex-col max-sm:gap-0;
}
.description h4 {
  @apply mb-2 mt-3 hidden max-sm:block;
}
.description img {
  @apply max-sm:size-14;
}
</style>
