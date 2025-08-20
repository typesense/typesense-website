---
sidebarDepth: 2
---

# Running E2E Tests with the Typesense in GitHub Action

When using Typesense you might want to run end-to-end tests - these are tests that run with real instances of your application's dependencies and not against mocks. 

Running your tests against an actual Typesense instance increases the confidence in your code and the contract between your app and Typesense. Adding Typesense to a GitHub Action is pretty straightforward.

There are two options:

### Option 1: Pre-Built action

There is a GitHub Action built a member of the Typesense Community. You'll find it in the GitHub marketplace at [jirevwe/typesense-github-action](https://github.com/marketplace/actions/typesense-server-in-github-actions) and install it from there.

You can configure the Typesense server in your workflow YAML file. Depending on your needs, you may configure it to run on a different port or you may make run your tests against a matrix of multiple Typesense versions.

Here's a sample configuration using the [jirevwe/typesense-github-action](https://github.com/marketplace/actions/typesense-server-in-github-actions) package to add Typesense to your GitHub Actions:

```yaml
name: Run tests

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        typesense-version: [0.22.0, 0.23.1]

    steps:
      - name: Start Typesense
        uses: jirevwe/typesense-github-action@v1.0.1
        with:
          typesense-version: ${{ matrix.typesense-version }}
          typesense-port: 20863

      - name: Curl Typesense
        run: sleep 10 && curl http://localhost:8108/health
```

This workflow setup runs your action's steps against each version of Typesense specified in the `typesense-version` list. This allows you run your tests against multiple versions of Typesense. One usecase of running your tests against multiple versions is if you want to be sure that updating your Typesense self-hosted or cloud version won't break your app's functionality.

There's a full example of how this works [here](https://github.com/jirevwe/typesense-actions-demo).

### Option 2: Without Dependencies

If you want something direct without any additional dependencies, add this to your GitHub actions config file:

```yaml
name: Run tests

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        # versions are wrapped in quotes to preserve the exact versions
        # especially numbers that has "0" on right-most side (e.g. 26.0)
        typesense-version: ['28.0', '29.0']
        typesense-port: ['8108:8108']

    services:
      typesense:
        image: typesense/typesense:${{ matrix.typesense-version }}

    steps:
      - name: Start Typesense
        run: |
          docker run -id \
          -p 8108:8108 \
          --name typesense \
          -v /tmp/typesense-data:/data \
          -v /tmp/typesense-analytics-data:/analytics-data \
          typesense/typesense:${{ matrix.typesense-version}} \
          --api-key=xyz \
          --data-dir=/data \
          --enable-search-analytics=true \
          --analytics-dir=/analytics-data  \
          --analytics-flush-interval=60 \
          --analytics-minute-rate-limit=100 \
          --enable-cors

      - name: Wait for Typesense to be healthy
        shell: bash
        run: |
          start_time=$(date +%s)
          timeout=30
          counter=0
          echo "Waiting for Typesense to be healthy..."
          until curl -s http://localhost:8108/health | grep -q '"ok":true'; do
            if [ $counter -eq $timeout ]; then
              echo "Timed out waiting for Typesense to be healthy"
              exit 1
            fi  
            sleep 1
            counter=$((counter + 1))
          done
          end_time=$(date +%s)
          elapsed=$((end_time - start_time))
          echo "Typesense healthcheck elapsed: ${elapsed}s"
```

A full example file can be found here: [jaeyson/ex_typesense](https://github.com/jaeyson/ex_typesense/blob/main/.github/workflows/ci.yml).

And that's it!

