<template>
  <v-tooltip top open-delay="500">
    <template v-slot:activator="{ on }">
      <v-card
        hover
        v-on="on"
        :ripple="ripple"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :disabled="disabled"
        @click="click"
      >
        <!-- <v-img :src="item.image | itemImageValidation | itemImageCoverBig"> -->
        <v-img :src="image">
          <slot></slot>
        </v-img>
      </v-card>
    </template>
    <span>{{name}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    name: String,
    image: String,
    ripple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
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
