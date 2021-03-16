<template>
  <div class="container">
    <div class="row d-flex justify-content-between">
      <div class="col-sm-7">
        <slot name="code"></slot>
      </div>
      <div class="col-sm-5 order-first order-sm-last">
        <div class="ml-sm-3 mb-3 mb-sm-0">
          <slot name="description"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
