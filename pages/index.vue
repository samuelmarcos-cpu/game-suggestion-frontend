<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <h1 class="text-center">Game Suggestion</h1>
        <v-form ref="form" v-model="valid" class="my-5">
          <v-text-field
            placeholder="Type your question here"
            clearable
            v-model="question"
            :rules="questionRules"
            rounded
            filled
            dense
          ></v-text-field>
          <v-autocomplete
            placeholder="Enter a game option"
            no-data-text="Games not found"
            v-model="gamesSelected"
            :items="games"
            :loading="isLoadingSearch"
            :search-input.sync="search"
            :rules="optionsRules"
            item-value="id"
            item-text="name"
            hide-selected
            multiple
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar tile size="35">
                <img :src="item.image | gameImageValidation | gameImageCoverSmall" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.year"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <template v-slot:selection></template>
          </v-autocomplete>
          <div class="d-flex flex-row flex-wrap align-center justify-center">
            <div v-for="game of gamesFilter" :key="game.id" class="mx-2 my-2">
              <game-card :game="game" @click="remove(game)" max-width="120px">
                <v-container fluid fill-height class="pa-0 justify-center">
                  <v-icon class="d-flex align-self-end">close</v-icon>
                </v-container>
              </game-card>
            </div>
          </div>
          <v-btn
            rounded
            block
            class="mt-5"
            :disabled="!valid"
            @click="createPoll"
            :loading="isLoadingCreate"
          >Create Poll</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import { SearchGames } from "@/graphql/query.graphql";
import { CreatePoll } from "@/graphql/mutation.graphql";

export default {
  components: { GameCard },
  data() {
    return {
      newSearch: "",
      valid: true,
      question: "",
      search: null,
      games: [],
      gamesSelected: null,
      isLoadingSearch: false,
      isLoadingCreate: false,

      questionRules: [
        v => !!v || "Question is required",
        v =>
          (v && v.trim().length >= 10) ||
          "Question must be bigger than 10 character"
      ],

      optionsRules: [
        v => !!v || "Options is required",
        v => (v && v.length >= 2) || "Must have at least 2 options",
        v => (v && v.length <= 20) || "No more than 20 games"
      ]
    };
  },
  computed: {
    gamesFilter() {
      if (this.gamesSelected) {
        return this.gamesSelected.map(gameId => {
          const game = this.games.filter(game => game.id === gameId)[0];
          const index = this.games.indexOf(game);
          return this.games[index];
        });
      }
      return [];
    }
  },
  methods: {
    remove(game) {
      if (this.gamesSelected) {
        const indexSelected = this.gamesSelected.indexOf(game.id);
        this.gamesSelected.splice(indexSelected, 1);
      }
      const index = this.games.indexOf(game);
      this.games.splice(index, 1);
    },
    async createPoll() {
      this.isLoadingCreate = true;
      const result = await this.$apollo.mutate({
        mutation: CreatePoll,
        variables: {
          question: this.question,
          games: this.gamesSelected
        }
      });
      if (result.data) {
        this.$router.push({
          path: `poll/${result.data.CreatePoll.id.toString()}`
        });
      }
      this.isLoadingCreate = false;
    }
  },
  watch: {
    async search(q) {
      this.isLoadingSearch = true;
      if (!q) {
        if (this.isLoadingSearch) {
          this.isLoadingSearch = false;
        }
        return;
      }
      this.newSearch = q;
      const request = await new Promise(resolve =>
        setTimeout(() => {
          if (q !== this.newSearch) {
            resolve(false);
          }
          resolve(true);
        }, 500)
      );
      if (!request) {
        return;
      }
      const result = await this.$apollo.query({
        query: SearchGames,
        variables: {
          q
        }
      });
      if (q !== this.newSearch) {
        return;
      }
      const games = result.data.SearchGames.map(game => {
        if (game.year) {
          game.year = new Date(game.year * 1000).getFullYear();
        }
        return game;
      });
      this.games = [...games, ...this.gamesFilter];
      this.isLoadingSearch = false;
    }
  }
};
</script>
