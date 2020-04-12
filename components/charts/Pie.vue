<template>
  <div>
    <GChart type="PieChart" :data="chart.chartData" :options="chart.chartOptions" />
  </div>
</template>

<script>
export default {
  props: {
    games: {
      type: Array,
      required: true
    },
    totalVotes: {
      type: Number,
      required: true
    }
  },
  computed: {
    chart() {
      const data = [];
      const colors = [];
      let selectedVotes = 0;

      this.games.forEach(game => {
        const gameVotes = game.votes.length;
        selectedVotes += gameVotes;
        data.push([game.name, gameVotes]);
        colors.push(game.color);
      });

      const othersVotes = this.totalVotes - selectedVotes;
      if (othersVotes > 0) {
        data.push(["Others", othersVotes]);
        colors.push("#eeeeee");
      }

      return {
        chartData: [["Game", "Votes"], ...data],
        chartOptions: {
          legend: { position: "none" },
          chartArea: {
            left: 0,
            top: 10,
            width: "100%",
            height: "90%",
            backgroundColor: {
              fillOpacity: 0
            }
          },
          backgroundColor: {
            fillOpacity: 0
          }
        }
      };
    }
  }
};
</script>
