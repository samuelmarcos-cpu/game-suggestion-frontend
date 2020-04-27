<template>
  <div class="d-flex flex-row flex-wrap align-center justify-center">
    <div
      v-for="game of games.sort((a, b) => a.votes.length - b.votes.length).reverse()"
      :key="game.id"
      class="mx-4 my-2"
    >
      <card
        :name="game.name"
        :image="game.image | imageValidation | imageCoverBig"
        :max-width="widthCards + 'px'"
        :ripple="false"
        @click="game.selected = !game.selected"
      >
        <template v-if="totalVotes > 0">
          <v-container fluid fill-height class="pa-0 align-end">
            <div :style="style(game)" class="d-flex flex-row justify-space-between">
              <div class="mx-1">{{game.votes.length}}</div>
              <div class="mx-1">{{calcPerc(game)}}%</div>
            </div>
          </v-container>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import Card from "@/components/Card.vue";

export default {
  components: { Card },
  props: {
    games: {
      type: Array,
      required: true
    },
    totalVotes: {
      type: Number,
      required: true
    },
    widthCards: {
      type: Number,
      default: 120
    }
  },
  data() {
    return {
      defaultStyle: {
        background:
          "linear-gradient(0deg, rgba(255,255,255,0) 50%, rgba(0,0,0,0.5) 75%)",
        opacity: 0.8,
        width: "100%",
        height: "0%"
      }
    };
  },
  methods: {
    calcPerc(game) {
      const perc = (game.votes.length * 100) / this.totalVotes;
      return perc.toFixed(2);
    },
    style(game) {
      return {
        ...this.defaultStyle,
        background: game.selected
          ? "linear-gradient(0deg, rgba(255,255,255,0) 50%, rgba(25,118,210,0.5) 75%)"
          : this.defaultStyle.background,
        height: 100 - this.calcPerc(game) + "%"
      };
    }
  }
};
</script>
