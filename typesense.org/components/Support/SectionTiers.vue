<template>
  <div class="bg-dark text-white py-5">
    <div class="container">
      <div class="row mt-5">
        <div class="col-sm">
          <div class="table-responsive">
            <table class="table table-borderless text-white">
              <thead>
                <tr class="text-center h5">
                  <th scope="col" style="width: 10%"></th>
                  <th scope="col"><span>Typesense Cloud</span></th>
                  <th scope="col">
                    <span>Typesense Self-Hosted</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="text-right">Support Channels</td>
                  <td>
                    Email<br />
                    Phone / Video Calls<br />
                    Private Slack Connect<br />
                    GitHub Issues<br />
                    Public Slack Community<br />
                  </td>
                  <td>
                    GitHub Issues<br />
                    Public Slack Community<br />
                  </td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Production Support SLA</td>
                  <td>
                    Starts from 30 mins<br /><span class="text-muted"
                      >24 x 7 x 365</span
                    >
                  </td>
                  <td>N/A</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Prioritized Response SLA</td>
                  <td>Starts from 24 hours</td>
                  <td>N/A</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">1:1 Consultative Support</td>
                  <td>Available</td>
                  <td>N/A</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Prioritized Feature Requests</td>
                  <td>Available</td>
                  <td>Based on community demand</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Infrastructure Management</td>
                  <td>Included</td>
                  <td>N/A</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Feature Availability <br /></td>
                  <td>
                    Full API Access <br />
                    Visual Dashboard<br />
                    Search Delivery Network<br />
                    Shared Team Access<br />
                    Role-Based Access Control<br />
                    Single Sign-on<br />
                    Auto-Scaling<br />
                    SOC 2 (Type 2) Compliance
                  </td>
                  <td>Full API Access</td>
                </tr>
                <tr class="text-center">
                  <td class="text-right">Cost</td>
                  <td>
                    Support Plans starting at $0/month <br />
                    + Cluster Costs starting $22/month
                  </td>
                  <td>Free</td>
                </tr>
                <tr class="text-center">
                  <td></td>
                  <td>
                    <a
                      href="https://cloud.typesense.org/support-plans"
                      target="_blank"
                      class="btn btn-outline-primary text-decoration-none"
                      role="button"
                    >
                      <strong>Cloud Support Plans ></strong>
                    </a>
                  </td>
                  <td>
                    <a
                      href="https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig"
                      target="_blank"
                      class="btn btn-outline-primary text-decoration-none"
                      role="button"
                    >
                      <strong>Public Slack Community ></strong>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

  tr {
    td:first-of-type {
      color: $primary;
      font-weight: 400;
    }

    td:not(:first-of-type) {
      border-right: $primary-dark-1 1px solid;
    }

    td {
      padding-bottom: 3em;
    }
  }

  th {
    span {
      padding-bottom: 0;
      border-bottom: $primary-dark-2 1px solid;
    }
  }

  tbody:before {
    line-height: 2em;
    content: '\200C';
    display: block;
  }
}
</style>
<script setup></script>
