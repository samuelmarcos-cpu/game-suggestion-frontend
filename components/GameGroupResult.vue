<template>
  <div class="d-flex flex-row flex-wrap align-center justify-center">
    <div
      v-for="game of games.sort((a, b) => a.votes.length - b.votes.length).reverse()"
      :key="game.id"
      class="mx-4 my-4"
    >
      <game-card
        :game="game"
        :max-width="widthCards + 'px'"
        :ripple="false"
        @click="game.selected = !game.selected"
      >
        <template v-if="totalVotes > 0">
          <v-icon
            v-if="game.selected"
            :style="{position: 'absolute', right: '40%', bottom: '0%'}"
          >done</v-icon>
          <v-container fluid fill-height class="pa-0 align-end">
            <div :style="style(game)" class="d-flex flex-row justify-space-between">
              <div class="mx-1">{{game.votes.length}}</div>
              <div class="mx-1">{{calcPerc(game)}}%</div>
            </div>
          </v-container>
        </template>
      </game-card>
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
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.5) 100%)",
        opacity: 0.8,
        width: "100%",
        height: "0%"
      }
    };
  },
  methods: {
    calcPerc(game) {
      return (game.votes.length * 100) / this.totalVotes;
    },
    style(game) {
      return {
        ...this.defaultStyle,
        height: 100 - this.calcPerc(game) + "%"
      };
    }
  }
};
</script>
