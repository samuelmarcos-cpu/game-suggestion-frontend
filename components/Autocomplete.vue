<template>
  <div>
    <v-text-field
      clearable
      filled
      dense
      v-model="text"
      :placeholder="placeholder"
      :loading="loading"
      :disabled="disabled"
    ></v-text-field>
    <div class="d-flex flex-row flex-wrap align-center justify-center px-5 pb-5">
      <div v-for="(item, index) in itens" :key="item.key">
        <slot v-bind="{ item, toggle: factoryToggle(index) }"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchInterval: {
      type: Number,
      default: 1000
    },
    search: Function,
    value: Array,
    placeholder: String,
    disabled: Boolean
  },
  data() {
    return {
      text: "",
      newText: "",
      loading: false,
      itens: []
    };
  },
  methods: {
    factoryToggle(index) {
      return () => {
        const item = this.itens[index];
        item.active = !item.active;
      };
    }
  },
  watch: {
    async text(t) {
      this.newText = t;
      if (t.trim() == "") {
        this.loading = false;
        return;
      }
      const request = await new Promise(resolve =>
        setTimeout(() => {
          if (t !== this.newText) {
            resolve(false);
          }
          resolve(true);
        }, this.searchInterval)
      );
      if (request === false) return;
      this.loading = true;
      let itens = await this.search(t);

      let selected = this.itens.filter(item => item.active);

      itens = itens.map(item => {
        let active = false;

        const selectedItem = selected.filter(sel => sel.key === item.key);
        if (selectedItem.length > 0) {
          active = true;
          selected = selected.filter(sel => sel.key !== item.key);
        }

        return {
          ...item,
          active
        };
      });

      itens.push(...selected);

      if (t !== this.newText) {
        return;
      }
      this.itens = itens;
      this.loading = false;
    },
    itens: {
      deep: true,
      handler(itens) {
        const selected = itens.filter(item => item.active);
        this.$emit("input", selected);
      }
    },
    value: {
      deep: true,
      handler(value) {
        this.itens.forEach(item => {
          const selectedItem = value.filter(vl => vl.key === item.key);
          if (selectedItem.length <= 0) {
            item.active = false;
          } else {
            item.active = true;
          }
        });
      }
    }
  }
};
</script>
