# Another Page

This is another page

## Demo Tabs

<Tabs :tabs="['Ruby', 'Python', 'JavaScript']">
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

  <template v-slot:JavaScript>

```js
// Just JS
```

  </template>
</Tabs>
