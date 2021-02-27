<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7">
        <CodeBlockTabbed>
          <slot name="code"></slot>
        </CodeBlockTabbed>
      </div>
      <div class="col-md-5">
        <slot name="description"></slot>
      </div>
    </div>
  </div>
</template>
