<template>
  <div>
    <GChart type="LineChart" :data="chart.chartData" :options="chart.chartOptions" />
  </div>
</template>

<script>
export default {
  props: {
    games: {
      type: Array,
      required: true
    },
    precision: {
      type: Number,
      default: 10
    }
  },
  computed: {
    chart() {
      const allVotes = [];

      let allVotesEquals = true;
      let initialVotes = null;
      let gameNames = ["Year"];

      const gameVotes = this.games.map(game => {
        gameNames.push(game.name);

        return game.votes.map(vote => {
          allVotes.push(vote.date);

          if (initialVotes === null) {
            initialVotes = vote.date;
          }

          if (initialVotes != vote.date) {
            allVotesEquals = false;
          }

          return {
            ...vote,
            distance: []
          };
        });
      });

      if (allVotes.length <= 1 || allVotesEquals) {
        allVotes.push(new Date().getTime());
      }

      allVotes.sort((a, b) => a - b);
      const firstVote = allVotes[0];
      const lastVote = allVotes[allVotes.length - 1];
      const step = ((lastVote - firstVote) * (100 / this.precision)) / 100;

      let index = 0;
      const points = [];
      for (let date = firstVote; date < lastVote; date += step) {
        points.push(new Date(date));
        gameVotes.forEach(votes => {
          votes.forEach(vote => {
            vote.distance.push({
              value: Math.abs(vote.date - date),
              point: index
            });
          });
        });
        index++;
      }

      gameVotes.forEach(votes => {
        votes.forEach(vote => {
          let point = vote.distance.sort((a, b) => a.value - b.value);
          vote.point = point[0].point;
        });
      });

      const data = points.map((date, x) => {
        const line = Array(gameVotes.length).fill(0);
        gameVotes.forEach((votes, y) => {
          votes.forEach(vote => {
            if (vote.point == x) {
              line[y]++;
            }
          });
        });
        return [date, ...line];
      });

      data.unshift(gameNames.length === 1 ? [] : gameNames);

      return {
        chartData: data,
        chartOptions: {
          legend: { position: "none" },
          chartArea: {
            left: "5%",
            top: "5%",
            width: "100%",
            height: "85%",
            backgroundColor: {
              fillOpacity: 0
            }
          },
          backgroundColor: {
            fillOpacity: 0
          },
          vAxis: {
            minorGridlines: {
              color: "transparent"
            }
          },
          hAxis: {
            gridlines: {
              color: "transparent"
            }
          }
        }
      };
    }
  }
};
</script>
