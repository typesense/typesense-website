<template>
  <div class="container">
    <div class="row d-flex justify-content-between">
      <div class="col-sm-7">
        <slot name="code"></slot>
      </div>
      <div class="col-sm-5">
        <div class="ml-3">
          <slot name="description"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
