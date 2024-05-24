# Running E2E Tests with the Typesense Github Action

GitHub Actions provides powerful automation which enables you to setup your continuous integration and continuous deployment pipelines; you can use it to run tests in your codebase, build images and deploy workloads to different environments.

## Use Typesense in GitHub Actions

When using Typesense you might want to run end-to-end tests -- these are test that run with real instances of your application's dependencies and not against mocks. Running your tests against an actual Typesense instance increases the confidence in your code and the contract between your app and Typesense. Adding Typesense to a GitHub Action is pretty straightforward.

There is a GitHub Action providing a Typesense server. You can find it in the GitHub marketplace at [jirevwe/typesense-github-action](https://github.com/marketplace/actions/typesense-server-in-github-actions) and install it from there.

You can configure the Typesense server in your workflow YAML file. Depending on your needs, you may configure it to run on a different port or you may make run your tests against a matrix of multiple Typesense versions.

Here’s a sample configuration using the [jirevwe/typesense-github-action](https://github.com/marketplace/actions/typesense-server-in-github-actions) package to add Typesense to your GitHub Actions:

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

Or you want something direct, no additional Github actions package needed:

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
        typesense-version: ['0.25.2', '26.0']
        typesense-port: ['8108:8108']

    services:
      typesense:
        image: typesense/typesense:${{ matrix.typesense-version }}

    steps:
      - name: Start Typesense
        run: |
          docker run -d \
          -p ${{ matrix.typesense-port }} \
          --name typesense \
          -v /tmp/typesense:/data \
          typesense/typesense:${{ matrix.typesense-version}} \
          --api-key=xyz \
          --data-dir /data \
          --enable-cors

      - name: Curl Typesense
        run: sleep 1 && curl http://localhost:8108/health
```

A full example file can be found [here](https://github.com/jaeyson/ex_typesense/blob/main/.github/workflows/ci.yml).

And that's it! As we saw above, Typesense is easy to set up and simple to use. You can use it with your apps to create fast, typo-tolerant search interfaces. And with this package you can easily test your Typesense integration. If you face any difficulties with Typesense or would like to see any new features added, head over to our [GitHub repo](https://github.com/typesense/typesense) and create an issue.

