<template>
  <v-container fluid fill-height>
    <v-layout column align-center justify-center>
      <p class="text-center display-2 font-weight-black">{{question}}</p>
      <div class="d-flex flex-row justify-space-around">
        <v-flex xs12 sm10 md8>
          <div class="d-flex flex-row flex-wrap align-center justify-center">
            <div v-for="game of games" :key="game.id" class="mx-4 my-4">
              <game-card
                :game="game"
                :disabled="disabledGames"
                max-width="120px"
                @click="vote(game)"
              >
                <v-container fluid fill-height class="pa-0 justify-center">
                  <v-progress-circular v-if="game.vote" indeterminate color="white" />
                </v-container>
              </game-card>
            </div>
          </div>
        </v-flex>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import Card from "@/components/Card.vue";
import { PollVote } from "@/graphql/query.graphql";
import { Vote } from "@/graphql/mutation.graphql";

export default {
  components: { Card },
  validate: context => /^\d+$/.test(context.params.id),
  async asyncData(context) {
    const id = parseInt(context.params.id);
    try {
      const result = await context.app.apolloProvider.defaultClient.query({
        query: PollVote,
        variables: {
          id
        }
      });
      const poll = result.data.Poll;
      const games = poll.options.map(option => {
        return {
          ...option.game,
          option: option.id,
          vote: false
        };
      });
      return {
        question: poll.question,
        games
      };
    } catch (e) {
      return {
        question: "Something Unexpected Happened",
        games: []
      };
    }
  },
  computed: {
    disabledGames() {
      for (const game of this.games) {
        if (game.vote) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    async vote(game) {
      game.vote = true;
      const id = this.$route.params.id;
      const result = await this.$apollo.mutate({
        mutation: Vote,
        variables: {
          option: game.option
        }
      });
      this.$router.push({
        path: `/result/${id.toString()}`
      });
      game.vote = false;
    }
  }
};
</script>
