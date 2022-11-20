<template>
  <div style="padding: 10px; font-size: 14px; max-width: 600px;margin: 0px auto">
     <img :src="require('@/assets/spa-logo.png')" height="auto" width="100%" />
    <slot />
  </div>
</template>
<script>
export default {
  name: 'ReceiptLayout',
};
</script>
