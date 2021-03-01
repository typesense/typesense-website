<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <h2 class="text-center">Choose from one of our support tiers</h2>
        <div class="text-center">Or reach out to us for custom needs</div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-sm">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr class="text-center">
                <th scope="col"></th>
                <th scope="col">Free</th>
                <th scope="col">Startup</th>
                <th scope="col">Business</th>
                <th scope="col">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center">
                <td class="text-right">Support Channels</td>
                <td>
                  Github issues<br />
                  Slack Community
                </td>
                <td>
                  Github issues<br />
                  Slack Community
                  <br />
                  Email
                </td>
                <td>
                  Github issues<br />
                  Slack Community<br />
                  Email<br />
                  Phone Calls
                </td>
                <td>
                  Github issues<br />
                  Slack Community<br />
                  Email<br />
                  Phone Calls<br />
                  Video Calls<br />
                  Private Slack
                </td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Response SLA</td>
                <td>Best effort</td>
                <td>72 hours</td>
                <td>48 hours</td>
                <td>24 hours</td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Prioritized Feature Requests</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Available</td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Hands-on Setup & Training</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Available at an additional cost, based on scope</td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Cost</td>
                <td>Free</td>
                <td>$2,000/yr</td>
                <td>$5,000/yr</td>
                <td>$15,000/yr</td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Covered clusters</td>
                <td>N/A</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr class="text-center">
                <td class="text-right">Additional clusters</td>
                <td>N/A</td>
                <td>+5% of cluster costs</td>
                <td>+10% of cluster costs</td>
                <td>+15% of cluster costs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table {
  td:not(:first-child) {
    width: 20%;
  }
}
</style>
