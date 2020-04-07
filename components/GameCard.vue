<template>
  <v-tooltip top open-delay="500">
    <template v-slot:activator="{ on }">
      <v-card
        v-on="on"
        :disabled="disabled"
        :max-width="maxWidth"
        :max-height="maxHeight"
        @click="click"
        hover
      >
        <v-img :src="game.image | gameImageValidation | gameImageCoverBig">
          <slot></slot>
        </v-img>
      </v-card>
    </template>
    <span>{{game.name}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxWidth: String,
    maxHeight: String
  },
  methods: {
    click(e) {
      this.$emit("click", e);
    }
  }
};
</script>
