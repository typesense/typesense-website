<template>
  <div class="container">
    <h2 class="text-center">Backed by responsive support</h2>
    <div class="text-center">
      Let us help you build a scalable and robust search experience
    </div>

    <div class="mt-4">
      <HomeSupportOption
        :image="require('~/assets/images/github.svg')"
        name="Github Issues"
      ></HomeSupportOption>
      <HomeSupportOption
        :image="require('~/assets/images/email.svg')"
        name="Email"
        class="ml-3"
      ></HomeSupportOption>
      <HomeSupportOption
        :image="require('~/assets/images/slack.svg')"
        name="Slack"
        class="ml-3"
      ></HomeSupportOption>
      <HomeSupportOption
        :image="require('~/assets/images/video_call.svg')"
        name="Phone call"
        class="ml-3"
      ></HomeSupportOption>
    </div>

    <div class="mt-3">&nbsp;</div>
    <div class="row mt-5">
      <div class="col-sm">
        <div class="text-center">
          <h4>
            <img src="~/assets/images/magic_wand.svg" alt="magic wand" />
            We also offer Expert Onboarding, Training and Prioritized Support,
            for when you need it.
          </h4>
          <div>Learn More</div>
        </div>
      </div>
    </div>
  </div>
</template>
