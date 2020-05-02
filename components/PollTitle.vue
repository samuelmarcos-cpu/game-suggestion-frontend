<template>
  <div>
    <div v-if="asked || votes" class="d-flex flex-row justify-space-around">
      <div v-if="asked" class="subtitle-2">Asked: {{ asked.toLocaleDateString() }}</div>
      <div v-if="votes" class="subtitle-2">{{ votes }} Votes</div>
    </div>
    <h1 class="text-center display-2 font-weight-black">{{title}}</h1>
    <slot></slot>
    <v-divider class="mt-2 mb-3"></v-divider>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    asked: Date,
    votes: Number
  }
};
</script>
