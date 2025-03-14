<template>
  <section class="flex flex-col items-end gap-4">
    <div class="flex w-full justify-between gap-10">
      <div>
        <Badge>Testimonials</Badge>
        <h2>
          What <strong>People</strong> Say<br />
          about Typesense
        </h2>
        <p class="subtext">Rave reviews from our community</p>
      </div>
      <div class="card mt-24 h-min flex-1">
        <p class="subtext !mt-0">
          We made the switch to Typesense from Algolia and never looked back. As
          our business was scaling incredibly fast, Typesense was able to
          provide superior performance, technology and support which allowed us
          to take one large feature off our plates while focusing on other core
          business functionalities.
        </p>
        <img
          class="self-end"
          width="73.5"
          src="/images/user_logos/kick-logo.svg"
          alt="Kick"
        />
      </div>
    </div>
    <div class="card mr-[164px] !bg-secondary-bg">
      <p class="subtext !mt-0 opacity-75">
        We switched from our in-house search solution to Typesense Cloud in a
        matter of days, and it has been working reliably for months now.
        Integrating it into our existing tech stack was a breeze, and the
        customization options within the Cloud Dashboard have been the real
        highlights so far.
      </p>
      <img class="self-end" src="/images/user_logos/n8n.svg" alt="n8n" />
    </div>
    <div class="flex w-full items-center justify-between">
      <img
        class="select-none"
        src="/images/backgrounds/quote.svg"
        alt="quote"
      />
      <div class="card mr-16">
        <p class="subtext !mt-0">
          Switched from elasticsearch to @typesense and I think these results
          speak for themselves. The best part? The ranking is better too! ...
          This is what I like to call "brick-shittingly good improvement"
        </p>
        <span class="subtext !mt-0 self-end">- @nucknyan on twitter</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex max-w-[726px] flex-col gap-5 rounded-2xl bg-bg-gray-2 p-4;
}
</style>
