---
sidebarDepth: 2
---

# Running Integration Tests with Testcontainers

[Testcontainers](https://testcontainers.com/) is a popular library for integration 
testing, designed to simplify the setup and management of test environments. It 
enables running real services in isolated Docker containers, making it easy to create
consistent testing scenarios both locally and in CI/CD pipelines.

With Testcontainers, you can run the `typesense/typesense` Docker image using your preferred programming language. You can achieve this via the Generic Container API, offering full control and flexibility, or leverage a prebuilt module, which streamlines container configuration and setup, saving time and effort.

## Java

First, let's import the dependency using Gradle or Maven.

Using Gradle:

```groovy
testImplementation "org.testcontainers:typesense:1.20.4"
```

or Maven:

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>typesense</artifactId>
    <version>1.20.4</version>
    <scope>test</scope>
</dependency>
```

Now, let's write a test using `TypesenseContainer`, which will start the container.
Then, configure Typesense's client to connect with the container. 

```java
try (
    TypesenseContainer typesense = new TypesenseContainer("typesense/typesense:27.1")
) {
    typesense.start();
    List<Node> nodes = Collections.singletonList(
        new Node("http", typesense.getHost(), typesense.getHttpPort())
    );
    Configuration configuration = new Configuration(nodes, Duration.ofSeconds(5), typesense.getApiKey());
    Client client = new Client(configuration);
}
```

There is also integration with JUnit 4, JUnit 5 and Spock test libraries. For more information about Testcontainers for Java, check the [docs](https://java.testcontainers.org/).
