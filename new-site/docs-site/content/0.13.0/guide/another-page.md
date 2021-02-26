# Another Page

This is another page

## Demo Tabs

<Tabs :tabs="['Ruby', 'Python', 'Javascript']">
  <template v-slot:Ruby>

```ruby
require 'typesense'
```

  </template>

  <template v-slot:Python>

```python
import typesense
```

  </template>

  <template v-slot:Javascript>

```js
// Just JS
```

  </template>
</Tabs>
