<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8>
        <h1 class="text-center">GAME SUGGESTION</h1>
        <v-form ref="form" v-model="valid" class="my-5">
          <v-text-field
            clearable
            rounded
            filled
            dense
            placeholder="Type your question here"
            v-model="question"
            :rules="questionRules"
            :disabled="isLoadingCreate"
          ></v-text-field>
          <v-card>
            <v-card-title class="text-center justify-center py-3">RESTRICTIONS</v-card-title>
            <div class="d-flex flex-row flex-wrap align-center justify-center mx-1 my-0">
              <v-chip
                close
                v-for="restriction in selectedRestrictions"
                :key="restriction.key"
                :disabled="isLoadingCreate"
                @click:close="restriction.active = false"
                class="ma-1"
              >{{restriction.name}}</v-chip>
            </div>
            <v-tabs v-model="tab" :grow="true">
              <v-tab key="platforms">Platforms</v-tab>
              <v-tab key="genres">Genres</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item key="platforms">
                <autocomplete v-model="selectedPlatforms" :search="searchPlatforms">
                  <template v-slot="{ item, toggle }">
                    <div class="ma-1">
                      <card
                        max-width="90px"
                        max-height="90px"
                        :name="item.name"
                        :image="item.image | imageValidation"
                        :disabled="isLoadingCreate"
                        @click="toggle"
                      >
                        <transition name="slide">
                          <div v-if="item.active" class="text-center caption primary">ACTIVE</div>
                        </transition>
                      </card>
                    </div>
                  </template>
                </autocomplete>
              </v-tab-item>

              <v-tab-item key="genres">
                <div class="d-flex flex-row flex-wrap align-center justify-center mx-1 mt-3 mb-2">
                  <v-btn
                    v-for="genre in genres"
                    :key="genre.id"
                    :disabled="isLoadingCreate"
                    @click="select(genre)"
                    :class="[genre.active ? 'primary' : '', 'ma-1']"
                  >{{genre.name}}</v-btn>
                </div>
                <div class="pa-1"></div>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
          <v-btn
            rounded
            block
            @click="createPoll"
            :loading="isLoadingCreate"
            :disabled="!valid"
            class="mt-5"
          >Create Poll</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Autocomplete from "@/components/Autocomplete.vue";
import Card from "@/components/Card.vue";

import { SearchPlatforms, Genres } from "@/graphql/query.graphql";
import { CreatePoll } from "@/graphql/mutation.graphql";

export default {
  components: {
    Autocomplete,
    Card
  },
  async asyncData(context) {
    const result = await context.app.apolloProvider.defaultClient.query({
      query: Genres
    });

    const genres = result.data.Genres.map(genre => {
      genre.active = false;
      return genre;
    });

    return {
      genres
    };
  },
  data() {
    return {
      valid: true,
      question: "",
      tab: null,
      selectedPlatforms: [],
      isLoadingCreate: false,

      questionRules: [
        v => !!v || "Question is required",
        v =>
          (v && v.trim().length >= 10) ||
          "Question must be bigger than 10 character"
      ]
    };
  },
  computed: {
    selectedGenres() {
      return this.genres.filter(genre => genre.active);
    },
    selectedRestrictions() {
      return [...this.selectedPlatforms, ...this.selectedGenres];
    }
  },
  methods: {
    async searchPlatforms(q) {
      const result = await this.$apollo.query({
        query: SearchPlatforms,
        variables: { q }
      });
      return result.data.SearchPlatforms.map(platform => {
        return {
          key: platform.id,
          ...platform
        };
      });
    },
    select(restriction) {
      restriction.active = !restriction.active;
    },
    async createPoll() {
      function mapId(restriction) {
        return restriction.id;
      }
      const data = {
        question: this.question,
        platforms: this.selectedPlatforms.map(mapId),
        genres: this.selectedGenres.map(mapId)
      };
      this.isLoadingCreate = true;
      const result = await this.$apollo.mutate({
        mutation: CreatePoll,
        variables: { data }
      });
      const id = result.data.CreatePoll.id;
      this.$router.push({
        path: `/vote/${id.toString()}`
      });
      this.isLoadingCreate = false;
    }
  }
};
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.slide-enter-active {
  animation: slide-in 1s ease;
}

.slide-leave-active {
  animation: slide-out 1s ease;
}
</style>
