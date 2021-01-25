const migrations = {
  2: (state) => {
    state.articles.pendingList = [];
    return state;
  },
};
export default migrations;
