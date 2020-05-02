<template>
  <v-card :outlined="outlined" nuxt :to="`/vote/${id}`" class="my-5">
    <v-card-title>{{ question }}</v-card-title>
    <v-card-subtitle>Asked {{ date.toLocaleDateString() }}</v-card-subtitle>
    <v-card-text>
      <div class="d-flex flex-row justify-space-between">
        <div>{{restrictions}} Restrictions</div>
        <div>{{votes}} Votes</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    id: Number,
    question: String,
    date: Date,
    restrictions: Number,
    votes: Number,
    outlined: Boolean
  }
};
</script>
