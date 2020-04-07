<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout column align-center justify-center>
      <p class="text-center display-2 font-weight-black">{{question}}</p>
      <div class="d-flex flex-row justify-space-around">
        <v-flex xs12 sm12 md10>
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
import GameCard from "@/components/GameCard.vue";
import gql from "graphql-tag";

export default {
  components: { GameCard },
  data() {
    return {
      isLoadingQuery: false,
      question: "",
      games: []
    };
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
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  async created() {
    this.isLoadingQuery = true;
    const id = parseInt(this.$route.params.id);
    try {
      const result = await this.$apollo.query({
        query: gql`
          query($id: Int!) {
            Poll(poll: $id) {
              question
              options {
                id
                game {
                  id
                  name
                  image
                  year
                }
              }
            }
          }
        `,
        variables: {
          id
        }
      });
      const poll = result.data.Poll;
      this.question = poll.question;
      this.games = poll.options.map(option => {
        return {
          ...option.game,
          option: option.id,
          vote: false
        };
      });
    } catch (e) {
      this.question = "Something Unexpected Happened";
    }
    this.isLoadingQuery = false;
  },
  methods: {
    async vote(game) {
      game.vote = true;
      const id = this.$route.params.id;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($option: Int!) {
            Vote(option: $option) {
              id
            }
          }
        `,
        variables: {
          option: game.option
        }
      });
      if (result.data) {
        console.log(result.data.Vote.id);
        this.$router.push({
          path: `result/${id.toString()}`
        });
      }
      game.vote = false;
    }
  }
};
</script>
