---
layout: page
title: API Documentation
nav_label: api
permalink: /api/
---

<div class="row no-gutters">
    <div class="col-md-2 row no-gutters">
      <nav id="navbar-docs" class="position-fixed navbar navbar-light">
        <nav class="nav nav-pills flex-column">
          <a class="nav-link" href="#installation">Installation</a>
          <a class="nav-link" href="#item-2">Item2</a>
          <a class="nav-link" href="#item-3">Item3</a>
          <nav class="nav nav-pills flex-column">
            <a class="nav-link ml-3 my-1" href="#item-3-1">Item 3-1</a>
            <a class="nav-link ml-3 my-1" href="#item-3-2">Item 3-2</a>
          </nav>
        </nav>
      </nav>
    </div>

    <div class="col-md-8">
      <h4 id="installation">Installation</h4>

      {% code_block %}
        ```ruby
        def foo
          puts 'foo'
        end
        ```

        ```python
        def foo:
          print('foo')
        ```

      {% endcode_block %}

      <ul class="nav nav-tabs mb-3" id="pills-tab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="install-ruby-tab" data-toggle="tab" href="#install-ruby" role="tab" aria-controls="install-ruby" aria-selected="true">Ruby</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="install-python-tab" data-toggle="tab" href="#install-python" role="tab" aria-controls="install-python" aria-selected="false">Python</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="install-node-tab" data-toggle="pill" href="#install-js" role="tab" aria-controls="install-js" aria-selected="false">Node</a>
        </li>
      </ul>

      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="install-ruby" role="tabpanel" aria-labelledby="pills-home-tab">
          <pre><code class="shell">gem install typesense</code></pre>
        </div>
        <div class="tab-pane fade" id="install-python" role="tabpanel" aria-labelledby="pills-profile-tab">
          <pre><code class="shell">pip install typesense</code></pre>
        </div>
        <div class="tab-pane fade" id="install-js" role="tabpanel" aria-labelledby="pills-contact-tab">
          <pre><code class="shell">npm install typesense</code></pre>
        </div>
      </div>

      <h5 id="item-1-1">Item 1-1</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h5 id="item-1-2">Item 2-2</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h4 id="item-2">Item 2</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h4 id="item-3">Item 3</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h5 id="item-3-1">Item 3-1</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h5 id="item-3-2">Item 3-2</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>
