# Building a Search Bar in Swift for iOS

This guide walks you through building a native iOS search interface using Swift, SwiftUI, and Typesense.

You'll create a book search application that demonstrates how to integrate Typesense into your iOS projects using modern architecture patterns like MVVM, Combine, and the official `typesense-swift` client SDK.

Mobile users expect instant results and won't wait around for slow searches. That's why combining iOS's native performance with Typesense's lightning-fast search engine creates the perfect foundation for a mobile app search experience that your users will love.

## What is Typesense?

Typesense is a lightning-fast, typo-tolerant search engine that makes it easy to add powerful search to your applications. Think of it as your personal search assistant that understands what users are looking for, even when they make mistakes.

Here's a real-world scenario: imagine you're building a food delivery app like DoorDash or Uber Eats. A hungry user opens your app at midnight and searches for "piza hut" (with typos). Instead of showing "no restaurants found" and sending them to a competitor's app, Typesense instantly understands they meant "Pizza Hut" and shows nearby locations with delivery times. That split-second difference between a successful search and a frustrated user can make or break your app's retention. That's the magic of intelligent search!

Why developers choose Typesense:

- **Blazing fast** - Search results appear in milliseconds, even across millions of documents.
- **Typo-tolerant** - Automatically corrects spelling mistakes so users find what they need.
- **Feature-Rich** - Full-text search, Synonyms, Curation Rules, Semantic Search, Hybrid search, Conversational Search (like ChatGPT for your data), RAG, Natural Language Search, Geo Search, Vector Search and much more wrapped in a single binary for a batteries-included developer experience.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Prerequisites

This guide assumes you have a basic understanding of Swift, SwiftUI, and iOS development.

Please ensure you have the following installed on your machine before proceeding:

- [Xcode](https://developer.apple.com/xcode/) (latest version)
- [Docker](https://docs.docker.com/get-docker/) - You will need it to run a Typesense server locally and load it with some data
- Basic knowledge of SwiftUI, MVVM architecture, and Combine

This guide will use a Linux/macOS environment for server setup commands, but you can adapt them to your operating system.

## Step 1: Setup your Typesense server

Once Docker is installed, you can run a Typesense container in the background using the following commands:

- Create a folder that will store all searchable data stored for Typesense:

  ```shell
  mkdir "$(pwd)"/typesense-data
  ```

- Run the Docker container:

  <Tabs :tabs="['Shell']">
    <template v-slot:Shell>
      <div class="manual-highlight">
        <pre class="language-bash"><code>export TYPESENSE_API_KEY=xyz
  docker run -p 8108:8108 \
    -v"$(pwd)"/typesense-data:/data typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
    --data-dir /data \
    --api-key=$TYPESENSE_API_KEY \
    --enable-cors \
    -d</code></pre>
      </div>
    </template>
  </Tabs>

- Verify if your Docker container was created properly:

  ```shell
  docker ps
  ```

- You should see the Typesense container running without any issues:

  ```shell
  CONTAINER ID   IMAGE                      COMMAND                  CREATED       STATUS       PORTS                                         NAMES
  82dd6bdfaf66   typesense/typesense:latest   "/opt/typesense-serv…"   1 min ago   Up 1 minutes   0.0.0.0:8108->8108/tcp, [::]:8108->8108/tcp   nostalgic_babbage
  ```

- That's it! You are now ready to create collections and load data into your Typesense server.

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::

## Step 2: Create a new books collection and load sample dataset into Typesense

Typesense needs you to create a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">collection</RouterLink> in order to search through documents. A collection is a named container that defines a schema and stores indexed documents for search. Collection bundles three things together:

  1. Schema
  2. Document
  3. Index

You can create the books collection for this project using this `curl` command:

```shell
curl "http://localhost:8108/collections" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
            "name": "books",
            "fields": [
              {"name": "title", "type": "string", "facet": false},
              {"name": "authors", "type": "string[]", "facet": true},
              {"name": "publication_year", "type": "int32", "facet": true},
              {"name": "average_rating", "type": "float", "facet": true},
              {"name": "image_url", "type": "string", "facet": false},
              {"name": "ratings_count", "type": "int32", "facet": true}
            ],
            "default_sorting_field": "ratings_count"
          }'
```

Now that the collection is set up, we can load the sample dataset.

1. Download the sample dataset:

   ```shell
   curl -O https://dl.typesense.org/datasets/books.jsonl.gz
   ```

2. Unzip the dataset:

   ```shell
   gunzip books.jsonl.gz
   ```

3. Load the dataset in to Typesense:

   ```shell
   curl "http://localhost:8108/collections/books/documents/import" \
         -X POST \
         -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
         --data-binary @books.jsonl
   ```

You should see a bunch of success messages if the data load is successful.

Now you're ready to actually build the application.

## Step 3: Set up your iOS project

Open Xcode and create a new **App** project. Choose **SwiftUI** for the interface and **Swift** as the language.

### Add typesense-swift Dependency

For production iOS applications, it is highly recommended to use the official **`typesense-swift`** client SDK. It abstracts network management, handles response parsing, and automatically implements node failover and retry logic for high availability.

1. In Xcode, select your project in the Project Navigator.
2. Go to the **Package Dependencies** tab.
3. Click the **+** button at the bottom of the list.
4. Enter the package URL in the search bar:
   ```plaintext
   https://github.com/typesense/typesense-swift
   ```
5. Set the Dependency Rule to **Up to Next Major Version** starting from `1.0.0`.
6. Click **Add Package** and select the **Typesense** library target for your application.

:::tip CocoaPods Compatibility
The official `typesense-swift` library is distributed as a Swift Package and does not provide an official CocoaPods `.podspec` file. 

If your iOS project uses CocoaPods, you can easily use both package managers side-by-side: simply add `typesense-swift` via Xcode's Package Dependencies as shown above, while maintaining your other dependencies in your `Podfile`. Xcode handles mixing CocoaPods and Swift Package Manager automatically.
:::


### Configure Info.plist

To allow your iOS app to connect to the Typesense server running locally, you need to enable cleartext traffic (since our local Docker container uses HTTP, not HTTPS).

In your Xcode project, go to your Target's **Info** tab and add an **App Transport Security Settings** dictionary. Inside it, add **Allow Arbitrary Loads** and set it to `YES`.

Alternatively, if you're editing `Info.plist` directly as source code, add this:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <!-- Allow HTTP traffic for local development -->
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

:::tip Note
In a production app, you should always use HTTPS and remove `NSAllowsArbitraryLoads`.
:::

## Project Structure

We'll follow the MVVM (Model-View-ViewModel) pattern natively supported by SwiftUI. Here's how the core files will be organized:

```plaintext
typesense-swift-search/
├── Models.swift
├── TypesenseConfig.swift
├── SearchViewModel.swift
├── BookCardView.swift
└── ContentView.swift
```

## Implementation

### 1. Define the Domain Model

Create `Models.swift`. Since the SDK handles collection-level response parsing and maps result hits generically, we only need to define a simple domain `Book` struct conforming to `Codable`.

```swift
import Foundation

struct Book: Identifiable, Codable {
    let id: String
    let title: String
    let authors: [String]
    let publicationYear: Int
    let imageUrl: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case authors
        case publicationYear = "publication_year"
        case imageUrl = "image_url"
    }
}
```

### 2. Configure Typesense Connection

Create `TypesenseConfig.swift`. This will store your connection parameters.

```swift
import Foundation

struct TypesenseConfig {
    // For Production, use your Typesense Cloud host and port 443 with https
    static let host = "localhost"
    static let port = "8108"
    static let scheme = "http"
    
    // IMPORTANT: In a production iOS app, ALWAYS use a Search-Only API Key, never an Admin Key.
    static let apiKey = "xyz"
    static let collection = "books"
    
    static var baseURL: URL {
        URL(string: "\(scheme)://\(host):\(port)")!
    }
}
```

### 3. Create the Search ViewModel

Create `SearchViewModel.swift`. The ViewModel uses Combine to debounce user input and manages the network requests to Typesense via the `typesense-swift` client.

```swift
import Foundation
import Combine
import Typesense

@MainActor
class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var results: [Book] = []
    @Published var isSearching = false
    
    private let client: Client
    private var searchTask: Task<Void, Never>?
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Initialize the Typesense client
        let node = Node(host: TypesenseConfig.host, port: TypesenseConfig.port, nodeProtocol: TypesenseConfig.scheme)
        let config = Configuration(nodes: [node], apiKey: TypesenseConfig.apiKey)
        self.client = Client(config: config)
        
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] _ in
                self?.triggerSearch()
            }
            .store(in: &cancellables)
    }
    
    func triggerSearch() {
        searchTask?.cancel()
        
        let query = searchText.isEmpty ? "*" : searchText
        
        self.isSearching = true
        
        searchTask = Task {
            do {
                let books = try await self.performSearch(query: query)
                if !Task.isCancelled {
                    self.results = books
                    self.isSearching = false
                }
            } catch {
                if !Task.isCancelled {
                    print("Search error: \(error)")
                    self.results = []
                    self.isSearching = false
                }
            }
        }
    }
    
    private func performSearch(query: String) async throws -> [Book] {
        let searchParameters = SearchParameters(q: query, queryBy: "title,authors")
        let (searchResult, _) = try await client
            .collection(name: TypesenseConfig.collection)
            .documents()
            .search(searchParameters, for: Book.self)
        
        return searchResult?.hits?.compactMap { $0.document } ?? []
    }
}
```

Let's break down what's happening here:

*   **SDK Initialization**: In `init()`, we create a `Node` configuration and initialize the `Client`. In a production app, you can pass multiple fallback nodes to the `Configuration(nodes: [...])` array for automatic redundancy.
*   **Combine Debouncing**: By observing `$searchText` with `.debounce`, we wait 300ms after the user stops typing before making a network call. This prevents spamming the API and saves bandwidth.
*   **Typesense SDK Call**: We perform search by calling `client.collection(name: ...).documents().search(searchParameters, for: Book.self)`. The SDK handles the URL construction, HTTP headers, request execution, and JSON decoding automatically.
*   **Result Extraction**: The SDK returns a strongly typed `SearchResult<Book>` struct. We map and extract the books by querying `searchResult.hits` and mapping each hit's `document` property.

### 4. Create the UI Component for a Book

Create `BookCardView.swift` to render an individual book.

```swift
import SwiftUI

struct BookCardView: View {
    let book: Book
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: URL(string: book.imageUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray
            }
            .frame(height: 200)
            .clipped()
            .cornerRadius(12)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(book.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(2)
                
                Text(book.authors.joined(separator: ", "))
                    .font(.system(size: 14))
                    .foregroundColor(Color(red: 204/255, green: 204/255, blue: 204/255))
                    .lineLimit(1)
                
                Text("\(String(book.publicationYear))")
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 153/255, green: 153/255, blue: 153/255))
            }
            .padding([.horizontal, .bottom], 12)
        }
        .background(Color(red: 51/255, green: 51/255, blue: 51/255))
        .cornerRadius(12)
    }
}
```

### 5. Set up the Main View

Finally, bring everything together in `ContentView.swift`.

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = SearchViewModel()
    
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        ZStack {
            Color(red: 34/255, green: 34/255, blue: 34/255)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 16) {
                    Text("Book Search")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundColor(.white)
                    
                    HStack(spacing: 6) {
                        Text("powered by")
                            .foregroundColor(Color(white: 0.7))
                            .font(.system(size: 14))
                        Text("typesense")
                            .foregroundColor(Color(red: 236/255, green: 72/255, blue: 127/255))
                            .font(.system(size: 14, weight: .semibold))
                        Text("&")
                            .foregroundColor(Color(white: 0.7))
                            .font(.system(size: 14))
                        Image(systemName: "swift")
                            .foregroundColor(.orange)
                            .font(.system(size: 16))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(red: 45/255, green: 45/255, blue: 45/255))
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                }
                .padding(.top, 40)
                .padding(.bottom, 20)
                
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Search books...", text: $viewModel.searchText)
                        .foregroundColor(.white)
                        .accentColor(.white)
                }
                .padding(15)
                .background(Color(red: 68/255, green: 68/255, blue: 68/255))
                .cornerRadius(10)
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 20)
                
                if viewModel.isSearching && viewModel.results.isEmpty {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .padding()
                    Spacer()
                } else if viewModel.results.isEmpty && !viewModel.searchText.isEmpty {
                    Text("No results found")
                        .foregroundColor(.gray)
                        .padding()
                    Spacer()
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(viewModel.results) { book in
                                BookCardView(book: book)
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                }
            }
        }
        .onAppear {
            if viewModel.results.isEmpty && viewModel.searchText.isEmpty {
                viewModel.triggerSearch()
            }
        }
    }
}
```

Let's break down what's happening in this view:

*   **`@StateObject` Binding**: We instantiate the `SearchViewModel` using `@StateObject` to ensure its lifecycle is tied directly to the view. Any changes to `@Published` properties (like `results` or `isSearching`) automatically trigger a UI update.
*   **Grid Layout**: We use `LazyVGrid` with a two-column flexible grid definition to show a responsive, clean grid of books.
*   **State-Based Rendering**: 
    - If `isSearching` is `true` and the results array is empty, a loading spinner (`ProgressView`) is shown.
    - If the search results are empty and the search query is not empty, a "No results found" helper label is displayed.
    - Otherwise, it renders a scrollable grid of `BookCardView` components.
*   **Initial Load (`onAppear`)**: When the view first loads, if both the search text and results are empty, we trigger an initial wildcard search (`*`) to pre-populate the grid with all available books.

## Final Output

Once you run the application in the iOS Simulator, you'll have a fast, typo-tolerant search bar that updates the grid of books as you type.

<div style="text-align: center; margin: 20px 0;">
  <img src="~@images/swift-search-bar/final-output.png" alt="Swift Search Bar Final Output" style="max-width: 300px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
</div>

## Deployment

When transitioning your iOS application from local development to a production environment, it is critical to secure your Typesense cluster and protect your credentials. Here are the essential best practices for deploying your search interface:

### 1. Connect to Typesense Cloud (or Production Cluster)

For local development, your app connected to `localhost` over HTTP. In production, you should point your configuration to your live Typesense cluster, such as [Typesense Cloud](https://cloud.typesense.org) or your self-hosted production servers.

Update your `TypesenseConfig.swift` to use `https`, your production hostname, and port `443`.

:::tip Security Reminder
Remember to remove `NSAllowsArbitraryLoads` (or set it to `NO`) from your `Info.plist` before releasing your app to the App Store to ensure all network traffic is encrypted over HTTPS.
:::

### 2. Use Search-Only (Read-Only) API Keys

Never bundle your Typesense Admin API Key inside a mobile application. iOS IPA binaries can be reverse-engineered or inspected by malicious users.

Instead, generate a **Search-Only API Key** that is restricted specifically to `documents:search` operations on your searchable collections (e.g., `books`). If this key is extracted, it can only be used to perform public search queries, preventing unauthorized data modifications or deletions.

### 3. Hide Secrets in iOS

To avoid hardcoding your Search-Only API key in your Git repository, use Xcode Configuration Settings (`.xcconfig` files) or environment variables. This keeps secrets out of source control while safely compiling them into your app.

### 4. Proxy Requests Through a Backend Server

If your application handles sensitive user data, requires user authentication, or needs strict rate limiting, **do not connect directly from iOS to Typesense**.

Instead, implement an architectural pattern where your iOS app communicates with your own backend server:

```plaintext
[ iOS App ] ---> (HTTPS / JWT Auth) ---> [ Backend API / Auth Layer ] ---> (Admin API Key) ---> [ Typesense Server ]
```

* **Authentication & Authorization**: Your iOS client authenticates with your backend.
* **Request Validation**: The backend receives the search query, validates the user's session, and applies necessary security filters.
* **Concealed Infrastructure**: The backend forwards the request to Typesense using your private Admin API key and returns the results to the mobile client. This ensures your Typesense server URL and API keys remain completely hidden from the public internet.

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-swift-search](https://github.com/typesense/code-samples/tree/master/typesense-swift-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
