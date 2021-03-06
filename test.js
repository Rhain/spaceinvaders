var records = [
    { name: 'Rap', address: 'Migos', score: 2, level: 1},
    { name: 'Pop', address: 'Coldplay', score: 4, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 10, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 11, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 14, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 17, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 143, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 154, level: 1},
    { name: 'Rock', address: 'Breaking Benjamins', score: 121, level: 1},
];

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    var scoreA = a.score;
    var scoreB = b.score;

    var comparison = 0;
    if (scoreA > scoreB) {
        comparison = -1;
    } else if (scoreA < scoreB) {
        comparison = 1;
    }
    return comparison;
}

records.sort(compare);

console.log(records);
console.log('-----------------------');
records.pop();
console.log(records);
console.log('-----------------------');
records.push({ name: 'Rock', address: 'Breaking Benjamins', score: 153, level: 1});
records.sort(compare);
console.log(records);

n1vN5bYZ2hgHBMVfFoD5XE8refzkSNT9Myp

n1qhR9USU7wkTCPHmGLfEBVm2uPb35D6fBp

1d2a420b45a70e42a7e89899a0069402bd52f377d61b1f703d7d36a9a7ca9d66
