/* eslint-disable no-param-reassign */
const migrations = {
  2: (state: any) => {
    state.articles.pendingList = [];
    return state;
  },
};
export default migrations;
