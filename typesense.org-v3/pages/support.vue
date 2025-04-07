<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] min-w-max -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="relative">
    <div class="site-padding mt-[120px] !gap-14 max-md:mt-24 max-md:!gap-10">
      <section class="text-center">
        <div class="mb-4 flex gap-4 max-md:mb-2">
          <FlashFill /> <SearchFill />
        </div>
        <h1 class="max-md:!text-[32px]">
          <span>
            Need help building<br />
            <strong>with Typesense?</strong><br />
            We know someone
          </span>
        </h1>
        <p class="subtext md:mt-4">
          We strive to provide good support through our<br class="show-md" />
          GitHub Issue tracker.<br class="max-md:hidden" />
          We also offer paid prioritized support with guaranteed SLAs,
          consulting and<br />
          training for Typesense Cloud.
        </p>
      </section>
      <section
        class="isolate m-auto w-full max-w-[1024px] gap-20 max-md:gap-14"
      >
        <div class="relative w-full rounded-xl p-2 max-md:p-0">
          <div class="background max-md:hidden"></div>
          <div class="gradient max-md:invisible"></div>
          <div
            class="table-head mb-2 grid w-full grid-cols-3 items-center rounded-xl bg-bg text-text-primary max-md:px-0.5 max-md:shadow-[-3px_2px_30px_0px_rgba(0,0,0,0.10)] max-md:[&>div]:!pl-2.5"
          >
            <div>
              <img
                src="/typesense-logo.svg"
                class="h-[29px] max-md:hidden"
                alt="Typesense logo"
              />
              <img
                src="/typesense-logo-text.svg"
                class="show-md h-5"
                alt="Typesense logo"
              />
            </div>
            <div>Typesense Cloud</div>
            <div>
              Typesense<br class="show-md" />
              Self-Hosted
            </div>
          </div>
          <table
            class="w-full max-w-full leading-[1.1] tracking-tighter max-md:text-[14px]"
          >
            <tbody
              class="rounded-xl max-md:shadow-[-3px_4px_30px_0px_rgba(0,0,0,0.10)]"
            >
              <tr>
                <td>
                  <div class="feature">
                    <img src="/icons/network.svg" alt="Support channels" />
                    Support Channels
                  </div>
                </td>
                <td>
                  <div class="content">
                    Email<br />
                    Phone / Video Calls <br />
                    Private Slack Connect<br />
                    GitHub Issues<br />
                    Public Slack Community
                  </div>
                </td>
                <td>
                  <div class="content">
                    GitHub Issues<br />
                    Public Slack Community
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img
                      src="/icons/services.svg"
                      alt="Production Support SLA"
                    />
                    Production Support SLA
                  </div>
                </td>
                <td>
                  <div class="content">Starts from 30 mins 24 x 7 x 365</div>
                </td>
                <td>
                  <div class="content">N/A</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img
                      src="/icons/online-chat.svg"
                      alt="Prioritized Response SLA"
                    />
                    Prioritized Response SLA
                  </div>
                </td>
                <td>
                  <div class="content">Starts from 24 hours</div>
                </td>
                <td>
                  <div class="content">N/A</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img src="/icons/talk.svg" alt="1:1 Consultative Support" />
                    1:1 Consultative Support
                  </div>
                </td>
                <td>
                  <div class="content">Available</div>
                </td>
                <td>
                  <div class="content">N/A</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img
                      src="/icons/request.svg"
                      alt="Prioritized Feature Requests"
                    />
                    Prioritized Feature Requests
                  </div>
                </td>
                <td>
                  <div class="content">Available</div>
                </td>
                <td>
                  <div class="content">Based on community demand</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img
                      src="/icons/jigsaw.svg"
                      alt="Infrastructure Management"
                    />
                    Infrastructure Management
                  </div>
                </td>
                <td>
                  <div class="content">Included</div>
                </td>
                <td>
                  <div class="content">N/A</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img src="/icons/instock.svg" alt="Feature Availability" />
                    Feature Availability
                  </div>
                </td>
                <td>
                  <div class="content">
                    Full API Access<br />
                    Visual Dashboard<br />
                    Search Delivery Network<br />
                    Shared Team Access<br />
                    Role-Based Access Control<br />
                    Single Sign-on<br />
                    Auto Scaling<br />
                    SOC 2 (Type 2) Compliance
                  </div>
                </td>
                <td>
                  <div class="content">Full API Access</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="feature">
                    <img src="/icons/save-money.svg" alt="Cost" />
                    Cost
                  </div>
                </td>
                <td>
                  <div class="content">
                    Support Plans starting at $0/month + Cluster Costs starting
                    $22/month
                  </div>
                </td>
                <td>
                  <div class="content">Free</div>
                </td>
              </tr>
              <tr class="max-md:hidden">
                <td></td>
                <td>
                  <div class="content">
                    <Button
                      class="m-auto"
                      link="https://cloud.typesense.org/support-plans"
                      with-arrow
                      >Cloud Support Plans</Button
                    >
                  </div>
                </td>
                <td>
                  <div class="content">
                    <Button
                      class="m-auto"
                      link="https://typesense.link/slack-community"
                      with-arrow
                      >Public Slack Community</Button
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card">
            <div class="small">Build with Typesense</div>
            <h4 class="mb-4">Typesense Cloud</h4>
            <div class="w-max self-end text-nowrap">
              <Button
                link="https://cloud.typesense.org/support-plans"
                with-arrow
                >Cloud Support Plans</Button
              >
            </div>
          </div>
          <div class="card">
            <div class="small">Build with Typesense</div>
            <h4 class="mb-4">Typesense Self-Hosted</h4>
            <div class="w-max self-end text-nowrap">
              <Button link="https://typesense.link/slack-community" with-arrow
                >Public Slack Community</Button
              >
            </div>
          </div>
        </div>

        <div
          class="relative isolate flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-primary px-8 py-7 max-md:rounded-xl max-md:p-4"
        >
          <img
            class="absolute right-0 top-0 z-[-1] h-full scale-[2] max-md:-right-36"
            src="/images/backgrounds/layer.svg"
            alt="Read the Guide"
          />
          <h3
            class="flex-1 normal-case tracking-[-0.96px] text-text-inverted max-md:self-start"
          >
            Have Any <span class="text-secondary">Questions?</span>
          </h3>
          <Button link="https://typesense.org/docs" with-arrow
            >Read the Guide</Button
          >
        </div>
      </section>
    </div>
    <img
      class="absolute bottom-[-1000px] left-1/2 z-[-1] w-max -translate-x-1/2 scale-x-110 max-md:bottom-[-220px] max-md:scale-[2]"
      src="/images/backgrounds/tunnels-bottom.svg"
      alt="background"
    />
  </div>
</template>
<style scoped>
section {
  @apply flex flex-col items-center;
}
table {
  border-collapse: separate;
  border-spacing: 0;
}
.feature {
  @apply flex items-center gap-4 text-left font-semibold leading-[1.3] tracking-tighter text-primary max-md:flex-col max-md:items-start max-md:gap-2;
}
.content {
  @apply max-sm:w-[25vw];
}
td,
.table-head div {
  @apply text-center leading-[1.1] max-md:!px-0 max-md:!py-4 max-md:text-left;
}
.table-head div {
  @apply px-8 py-[18px] font-semibold max-md:!pl-2.5;
}
td {
  @apply w-1/3 p-8 leading-[1.6] tracking-tighter text-text-muted max-md:py-4 max-md:!pl-2.5 max-md:align-top;
}
tbody tr:nth-child(odd) {
  @apply bg-bg;
}

tbody tr:nth-child(even) {
  @apply bg-[#F5F5FD];
}
tr td:first-child {
  @apply max-md:!pl-3;
}
tbody tr:first-of-type td:first-child {
  @apply rounded-tl-xl;
}
tbody tr:first-of-type td:last-child {
  @apply rounded-tr-xl;
}
tbody tr:last-of-type td:first-child {
  @apply rounded-bl-xl;
}
tbody tr:last-of-type td:last-child {
  @apply rounded-br-xl;
}
.background {
  @apply pointer-events-none absolute inset-0 z-[-1];
  border-radius: 12px;
  box-shadow:
    0px 4px 80px 0px rgba(165, 165, 165, 0.15),
    0px 4px 9px 0px rgba(255, 255, 255, 0.25) inset;
}
.gradient {
  @apply absolute inset-0 z-[-3] overflow-hidden rounded-xl;
}
.gradient::after {
  @apply pointer-events-none relative z-[-3] block size-full;
  content: "";
  background: linear-gradient(
    120deg,
    rgba(53, 64, 215, 0.01) 0%,
    rgba(53, 64, 215, 0.15) 32%,
    rgba(225, 255, 178, 0.7) 110%
  );
  filter: blur(92px);
}
.card {
  @apply mb-1 hidden flex-col rounded-2xl bg-bg p-4 shadow-[-3px_4px_30px_0px_rgba(0,0,0,0.15)] max-md:flex;
}
.card .small {
  @apply mb-2 text-sm leading-[1.6] tracking-tight text-text-muted;
}
</style>

<script lang="ts" setup>
useSeoMeta({
  title: "Support | Typesense",
  ogTitle: "Support | Typesense",
  description:
    "Need help building with Typesense? We've got your covered. GitHub issues, Slack community, Email, Phone Calls.",
  ogDescription:
    "Need help building with Typesense? We've got your covered. GitHub issues, Slack community, Email, Phone Calls.",
});
import FlashFill from "@/assets/icons/flash-fill.svg";
import SearchFill from "@/assets/icons/search-fill.svg";
</script>
