const getScore = (collection, item) => {
  let score = 0;
  if (collection === "requetes") {
    score +=
      (item.refs &&
        Math.min(10, item.refs.filter(r => r.url && r.relevance).length)) ||
      0;
    score +=
      (item.variants && Math.min(20, item.variants.split("\n").length)) || 0;
    if (item.theme) {
      score += 50;
    } else {
      score -= 80;
    }
  }
  if (collection === "glossaire") {
    score += item.definition ? Math.min(50, item.definition.length * 5) : 0;
    score +=
      (item.refs && Math.min(50, item.refs.filter(r => r.url).length * 10)) ||
      0;
    score +=
      (item.variants && Math.min(30, item.variants.split("\n").length * 10)) ||
      0;
    score +=
      (item.abbrs && Math.min(20, item.abbrs.split("\n").length * 10)) || 0;
  }
  if (collection === "ccns") {
    score +=
      (item.groups &&
        item.groups.filter &&
        item.groups.filter(group => group.selection.length).length * 8) ||
      0;
  }
  if (collection === "themes") {
    score +=
      (item.refs && Math.min(10, item.refs.filter(r => r.url).length) * 10) ||
      0;
    score += item.intro ? 20 : 0;
  }
  return Math.min(100, Math.max(0, score));
};

export default getScore;
