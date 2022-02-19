# Deploy a Typesense cluster to Docker Swarm

To Deploy a Typesense cluster on multiple hosts which run in [Docker Swarm](https://docs.docker.com/engine/swarm/) mode, follow these steps:

- Initialize Docker Swarm. 
  For example, in a 4 node Docker Swarm setup (Node1 acting as docker `manager` and Node2, Node3, Node4 acting as docker `worker`), run `docker swarm init` on the docker `manager` node.

  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shellsession
  # Run docker swarm init on the docker manager node
  
  $ docker swarm init --advertise-addr $(hostname -i) 
  
  Swarm initialized: current node (6082x127zz98f0pwgjexbv5xp) is now a manager.   
  To add a worker to this swarm, run the following command:
  docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377
  To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
  ```
    </template>
  </Tabs>

- Create a user-defined `overlay` network on the docker `manager` node for typesense service communication. 
  Run the command below on the docker `manager` node. 

  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shell
  # Run docker network create on the docker manager node
  
  docker network create \
    --driver overlay \
    --subnet=10.11.0.10/16 \
    ts_net
  
  ```
    </template>
  </Tabs>

  Take a note of the `subnet` value. The same `subnet` value will be used in `docker-stack.yml --peering-subnet` flag below.

- Add Docker instance running on rest of the Docker nodes to the existing Docker Swarm as `worker`. 
  Remember to change the `token` or retrieve the `token` using the command `docker swarm join-token worker` and repeat the command below on all the docker nodes.

  <Tabs :tabs="['Node2', 'Node3', 'Node4']">
    <template v-slot:Node2>
  
  ```shell
  # Change the token and join the swarm as a worker 
  #        This command is identical on all docker nodes
  docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377
  This node joined a swarm as a worker.
  ```
  
    </template>
    <template v-slot:Node3>
  
  ```shell
  # Change the token and join the swarm as a worker 
  #        This command is identical on all docker nodes
  docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377
  This node joined a swarm as a worker.
  ```
  
    </template>
    <template v-slot:Node4>
  
  ```shell
  # Change the token and join the swarm as a worker 
  #        This command is identical on all docker nodes
  docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377
  This node joined a swarm as a worker.
  ```
  
    </template>
  </Tabs>

- Verify status and roles of `docker swarm` nodes by running command below on the docker `manager` node.
  
  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shell
  # Check the status of the Swarm
  docker node ls
  ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
  6082x127zz98f0pwgjexbv5xp *   node1      Ready     Active         Leader           20.10.0
  z1n71a3h0bw7clclw22i5f0ys     node2      Ready     Active                          20.10.0
  xm1h48xsgzzqftvqaod0nx673     node3      Ready     Active                          20.10.0
  mde8zbj3bsqrvwk02529cm3le     node4      Ready     Active                          20.10.0
  
  ```
  
    </template>
  </Tabs>

- Create a new `nodes` file on each docker `worker` node part of swarm.

  <Tabs :tabs="['Node2', 'Node3', 'Node4']">
    <template v-slot:Node2>
  
  ```shell
  # Create nodes file
  #   This command is identical on all docker nodes
  mkdir /root/typesense && cd /root/typesense && echo 'typesense-1:7107:7108,typesense-2:8107:8108,typesense-3:9107:9108' | sudo tee /root/typesense/nodes
  ```
  
    </template>
    <template v-slot:Node3>
  
  ```shell
  # Create nodes file
  #   This command is identical on all docker nodes
  mkdir /root/typesense && cd /root/typesense && echo 'typesense-1:7107:7108,typesense-2:8107:8108,typesense-3:9107:9108' | sudo tee /root/typesense/nodes
  ```
  
    </template>
    <template v-slot:Node4>
  
  ```shell
  # Create nodes file
  #   This command is identical on all docker nodes
  mkdir /root/typesense && cd /root/typesense && echo 'typesense-1:7107:7108,typesense-2:8107:8108,typesense-3:9107:9108' | sudo tee /root/typesense/nodes
  ```
  
    </template>
  </Tabs>

- Connect to each Docker `worker` node and create the `data` folder.

  <Tabs :tabs="['Node2', 'Node3', 'Node4']">
    <template v-slot:Node2>
  
  ```shell
  # Create data folder
  #   This command is identical on all docker nodes
  mkdir /tmp/typesense-data-1/ &&  mkdir /tmp/typesense-data-2/ && mkdir /tmp/typesense-data-3/
   ```
  
    </template>
    <template v-slot:Node3>

   ```shell
   # Create data folder
   #   This command is identical on all docker nodes
   mkdir /tmp/typesense-data-1/ &&  mkdir /tmp/typesense-data-2/ && mkdir /tmp/typesense-data-3/
   ```
  
    </template>
    <template v-slot:Node4>
  
  ```shell
  # Create data folder
  #   This command is identical on all docker nodes
   mkdir /tmp/typesense-data-1/ &&  mkdir /tmp/typesense-data-2/ && mkdir /tmp/typesense-data-3/
  ```
  
    </template>
  </Tabs>

- Create `docker-stack.yml` file on the docker `manager` node. This file will be used to deploy Typesense service across all the docker `worker` nodes.

  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shell
  # Create docker-stack.yml
  mkdir \typesense && touch /root/typesense/docker-stack.yml
  ```
  
    </template>
  </Tabs>

  #### Content for `docker-stack.yml` file

  :::warning IMPORTANT 
  In the `Docker swarm` setup `--peering-subnet` flag should be the same `subnet` defined in the default or user-defined `overlay` network. `--peering-subnet` was introduced in [`typesense/typesense:0.23.0.rc21`](https://hub.docker.com/layers/typesense/typesense/0.23.0.rc21/images/sha256-d0fd1b142b10600cb8518cc5f313683324d53f3791c0dad509033445c2c3bfdf?context=explore). For more information on `Overlay` networks, read the official Docker documentation [here](https://docs.docker.com/network/overlay/).
  :::

  ```yaml
  version: "3.8"
  services:
    typesense-1:
      image: typesense/typesense:0.23.0.rc22
      hostname: typesense-1
      volumes:
        - /tmp/typesense-data-1/:/data
        - ./nodes:/nodes
      ports:
        - 7108:7108
        - 7107:7107
      command: ["--peering-subnet","10.11.0.10/16","--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","7107","--api-port","7108","--enable-cors"]
      deploy:
        replicas: 1
        labels:
          feature.description: “typesense-1”
        restart_policy:
          condition: any
        placement:
          constraints: [node.hostname == node2]
      networks:
          - ts_net
    typesense-2:
      image: typesense/typesense:0.23.0.rc22
      hostname: typesense-2
      volumes:
        - /tmp/typesense-data-2/:/data
        - ./nodes:/nodes
      ports:
        - 8108:8108
        - 8107:8107
      command: ["--peering-subnet","10.11.0.10/16","--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","8107","--api-port","8108","--enable-cors"]
      deploy:
        replicas: 1
        labels:
          feature.description: “typesense-2”
        restart_policy:
          condition: any
        placement:
          constraints: [node.hostname == node3]
      networks:
          - ts_net
    typesense-3:
      image: typesense/typesense:0.23.0.rc22
      hostname: typesense-3
      volumes:
        - /tmp/typesense-data-3/:/data
        - ./nodes:/nodes
      ports:
        - 9108:9108
        - 9107:9107
      
      command: ["--peering-subnet","10.11.0.10/16","--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","9107","--api-port","9108","--enable-cors"]
      deploy:
        replicas: 1
        labels:
          feature.description: “typesense-3”
        restart_policy:
          condition: any
        placement:
          constraints: [node.hostname == node4]
      networks:
          - ts_net
  networks:
    ts_net:
      external: true
  ```

- Deploy the stack from the docker `manager` node by running the command below.

  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shell
  # Deploy stack
  docker stack deploy --compose-file /root/typesense/docker-stack.yml --with-registry-auth ts
  ```
    </template>
  </Tabs>

- List the distribution of services and tasks across docker `worker` nodes from the `manager` node. `docker stack ps` command will display the typesense service distribution across all the docker `worker` nodes.

  <Tabs :tabs="['Node1']">
    <template v-slot:Node1>
  
  ```shell
  docker stack ps ts
  ID             NAME               IMAGE                        NODE      DESIRED STATE   CURRENT STATE           ERROR     PORTS
  x4w38438c7bn   ts_typesense-1.1   typesense/typesense:0.23.0.rc22   node2     Running         Running 5 minutes ago
  0iacq1bhw1ia   ts_typesense-2.1   typesense/typesense:0.23.0.rc22   node1     Running         Running 5 minutes ago
  wqyec57a3d4o   ts_typesense-3.1   typesense/typesense:0.23.0.rc22   node3     Running         Running 5 minutes ago
  ```
  
    </template>
  </Tabs>

- Verify if typesense service is `clustered` successfully by connecting to any docker `worker` node.

  **NOTE:** For a successful docker swarm setup, you can determine whether a container node is a `leader` or `follower` by the value of the `state` field in the `/debug` end-point response. The state value for at least one of the container node should be `1` as documented in [Multi-node deployment](https://typesense.org/docs/0.22.1/api/#multi-node-deployment)
  
  <Tabs :tabs="['Node2']">
    <template v-slot:Node2>
  
  ```shell
  # Connect to docker container
  docker exec -it ts_typesense-1.1.trnoz5k698vzfwtom5lg3bi4p bash
  root@typesense-1:/# apt-get update && apt-get -y install curl
  
  
  root@typesense-1:/# curl 'http://typesense-1:7108/debug' -X GET -H "x-typesense-api-key: xyz" && curl 'http://typesense-2:8108/debug' -X GET -H "x-typesense-api-key: xyz" && curl 'http://typesense-3:9108/debug' -X GET -H "x-typesense-api-key: xyz"
  {"state":1,"version":"0.23.0.rc22"}{"state":4,"version":"0.23.0.rc22"}{"state":4,"version":"0.23.0.rc22"}
  ```
    </template>
  </Tabs>
