---
layout: page
title: Typesense Premium
nav_label: premium
permalink: /premium/
---

<div class="row no-gutters">
    <div id="doc-col" class="col-md-8">
        <h3>Features</h3>
        <div class="feature-block">
            <img src="/assets/images/customize_icon.png" alt="Customize"/>
            <h5>Curation &amp; Customization</h5>
            <p>Tailor your search results to perfection by promoting or filtering specific documents over others
                via query rules. <a href="/premium/10.2/api/#curation">Learn more.</a></p>
        </div>

        <div class="feature-block">
            <img src="/assets/images/alias_icon.png" alt="Alias"/>
            <h5>Collection Alias</h5>
            <p>Reindex your documents in the background in a new collection and swap
                to it instantly, without any changes to your code. <a href="/premium/10.2/api/#aliases">Learn more.</a>
            </p>
        </div>

        <div class="feature-block">
            <img src="/assets/images/performance_icon.png" alt="Performance"/>
            <h5>Performance</h5>
            <p>Although Typesense is already <em>pretty fast</em>, the Premium version offers increased
                parallelism for faster searching and indexing.</p>
        </div>

        <div class="feature-block">
            <img src="/assets/images/support_icon.png" alt="Support"/>
            <h5>Priority Support</h5>
            <p>Search is a crucial part of your infrastructure. Get priority email support from Typesense
                for any unforeseen issues.</p>
        </div>

    </div>

    <div class="col-md-1 row no-gutters"></div>

    <div class="col-md-2" id="premium-sidebar">
        <button id="checkout-button" class="btn btn-success btn-purchase" role="link">Purchase (990 USD / year)</button>
        <div id="error-message"></div>
        <p id="money-back">We offer a 7-day, 100% money back guarantee.</p>
        <hr/>
        &raquo; <a href="/premium/api">Documentation</a> <br/>
        &raquo; <a href="/premium/downloads">Downloads</a> <br/>
    </div>
</div>

<script src="https://js.stripe.com/v3"></script>
<script>
    (function () {
        var mode = 'live';
        // var mode = 'test';

        var configs = {
            live: {
                apiKey: 'pk_live_pzQPnHTRKFoYHxQnWS2UYZwl00gXQgwLHm',
                planId: 'plan_FwBLNJ8AfjFBmT',
                domain: 'https://typesense.org'
            },
            test: {
                apiKey: 'pk_test_cp6nTePPYy58kSSHlWghWIym00FTp0mZLv',
                planId: 'plan_FwBc8uWcBMiSNk',
                domain: 'http://127.0.0.1:4000'
            }
        };

        var stripe = Stripe(configs[mode].apiKey);

        var checkoutButton = document.getElementById('checkout-button');
        checkoutButton.addEventListener('click', function () {
            stripe.redirectToCheckout({
                items: [{plan: configs[mode].planId, quantity: 1}],
                successUrl: configs[mode].domain + '/premium/purchase-success',
                cancelUrl: configs[mode].domain + '/premium'
            })
                .then(function (result) {
                    if (result.error) {
                        var displayError = document.getElementById('error-message');
                        displayError.textContent = result.error.message;
                    }
                });
        });
    })();
</script>
