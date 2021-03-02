<template>
  <div class="bg-gradient-3 text-white py-5">
    <div class="container">
      <h2 class="text-center">Backed by responsive support</h2>
      <div class="text-center">
        Let us help you build a scalable and robust search experience
      </div>
      <div class="mt-3">&nbsp;</div>
      <div class="mt-5 text-center">
        <HomeSupportOption
          :image="require('~/assets/images/github.svg')"
          :image-height="45"
          name="Github Issues"
        ></HomeSupportOption>
        <HomeSupportOption
          :image="require('~/assets/images/email.svg')"
          name="Email"
          class="ml-5"
        ></HomeSupportOption>
        <HomeSupportOption
          :image="require('~/assets/images/slack.svg')"
          name="Slack"
          :image-height="35"
          image-margin="6px"
          class="ml-5"
        ></HomeSupportOption>
        <HomeSupportOption
          :image="require('~/assets/images/video_call.svg')"
          name="Phone call"
          class="ml-5"
        ></HomeSupportOption>
      </div>

      <div class="mt-3">&nbsp;</div>
      <div class="row mt-5">
        <div class="col-sm">
          <div class="text-center">
            <h4 class="mb-2">
              <img
                src="~/assets/images/magic_wand.svg"
                alt="magic wand"
                class="mr-2"
              />
              We also offer Concierge Onboarding and Prioritized Support, for
              when you need it.
            </h4>
            <div>
              <NuxtLink to="/support" class="text-white"
                ><span class="text-underline-primary"
                  >Learn more</span
                ></NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
