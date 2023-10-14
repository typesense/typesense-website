<template>
  <div class="bg-gradient-3 text-white py-5">
    <div class="container">
      <h2
        class="text-center text-shadow-primary-1"
        data-aos="zoom-out"
        data-aos-duration="350"
      >
        Backed by responsive support
      </h2>
      <div class="text-center">
        Let us help you build a scalable and robust search experience
      </div>
      <div class="mt-3">&nbsp;</div>
      <div class="container">
        <div
          class="row mt-5 text-center d-flex justify-content-between justify-content-sm-center"
        >
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/github.svg')"
              :image-height="45"
              href="https://github.com/typesense/typesense/issues"
              target="_blank"
              name="GitHub Issues"
            ></HomeSupportOption>
          </div>
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/email.svg')"
              name="Email"
              href="#"
              onclick="Beacon('navigate', '/ask/message/'); Beacon('open'); return false;"
            ></HomeSupportOption>
          </div>
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/slack.svg')"
              name="Slack"
              :image-height="35"
              image-margin="6px"
              href="https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg"
              target="_blank"
            ></HomeSupportOption>
          </div>
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/np_help_3407902_FFFFFF.svg')"
              name="Office Hours"
              :image-height="45"
              image-margin="6px"
              href="https://calendly.com/jason-typesense/typesense-office-hours"
              target="_blank"
            ></HomeSupportOption>
          </div>
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/video_call.svg')"
              name="Phone call"
              href="#"
              onclick="Beacon('navigate', '/ask/message/'); Beacon('open'); return false;"
            ></HomeSupportOption>
          </div>
        </div>
      </div>

      <div class="mt-3">&nbsp;</div>
      <div class="row mt-5">
        <div class="col-sm">
          <div class="text-center">
            <h4 class="mb-2">
              <img
                src="~/assets/images/magic_wand.svg"
                alt="magic wand"
                width="35"
                height="35"
                class="mr-2 mb-3 mb-sm-0"
              /><br class="d-block d-sm-none" />
              We also offer Concierge Onboarding and Prioritized Support, for
              when you need it.
            </h4>
            <div>
              <NuxtLink class="text-white" to="/support/">Learn more</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
