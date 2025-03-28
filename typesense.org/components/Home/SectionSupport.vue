<template>
  <div class="bg-gradient-6 text-white py-5">
    <div class="py-1">&nbsp;</div>
    <div class="container">
      <h2 class="text-center" data-aos="zoom-out" data-aos-duration="350">
        Backed by responsive support
      </h2>
      <div class="text-center">Offered by expert search engineers</div>
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
              :image="require('~/assets/images/slack.svg')"
              name="Slack"
              :image-height="35"
              image-margin="6px"
              href="https://typesense.link/slack-community"
              target="_blank"
            ></HomeSupportOption>
          </div>
          <div class="col-sm-2 mt-4 mt-sm-0 d-flex justify-content-center">
            <HomeSupportOption
              :image="require('~/assets/images/video_call.svg')"
              name="Priority Support"
              href="/support"
            ></HomeSupportOption>
          </div>
        </div>
      </div>
    </div>
    <div class="py-3">&nbsp;</div>
  </div>
</template>

<style lang="scss" scoped></style>
<script setup lang="ts"></script>
