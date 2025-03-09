<script setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";
import Dots from "@/assets/images/dots.svg";
</script>
<template>
  <section class="mt-[200px] flex items-end justify-between">
    <div>
      <Badge>We've got your back</Badge>
      <h2>
        Backed by<br />
        <strong>responsive</strong><br />
        support
      </h2>
      <p class="subtext">
        Let us help you build a scalable and<br />
        robust search experience
      </p>
    </div>

    <div class="overflow-hidden rounded-3xl bg-secondary-bg pr-16 pt-16">
      <div
        class="flex max-w-[592px] flex-col gap-4 rounded-tr-3xl bg-bg-gray-2 p-4 shadow-[-5px_4px_34px_0px_rgba(0,_0,_0,_0.10)]"
      >
        <Dots class="self-end" />
        <div class="card">
          <div class="flex gap-6">
            <img
              src="/images/support/priority-support.svg"
              alt="Priority Support"
            />
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
          <div class="flex gap-6">
            <img src="/images/support/github-support.svg" alt="Github" />
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
          <div class="flex gap-6">
            <img src="/images/support/slack-support.svg" alt="Slack Support" />
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
  @apply bg-bg-gray-3 flex flex-col gap-8 rounded-2xl p-6;
}

.card p {
  @apply text-sm leading-[1.8] tracking-tight text-text-muted;
}
.heading-cta {
  @apply flex items-center justify-between;
}
</style>
