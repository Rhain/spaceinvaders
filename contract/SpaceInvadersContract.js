var SpaceInvader = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.name = obj.name;
    this.address = obj.address;
    this.score = obj.score;
    this.level = obj.level;
    this.date = obj.date;
  } else {
    this.name = "";
    this.address = "";
    this.score = "";
    this.level = "";
    this.date = "";
  }
};

SpaceInvader.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var SpaceInvadersContract = function () {
  LocalContractStorage.defineMapProperty(this, "nameToAddress");
  LocalContractStorage.defineMapProperty(this, "addressToName");
  LocalContractStorage.defineProperty(this, "ranks");
  LocalContractStorage.defineMapProperty(this, "invaders", {
    parse: function (text) {
      return new SpaceInvader(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

SpaceInvadersContract.prototype = {

  init: function () {
    this.ranks = [];
  },

  setUsername: function (name) {
    var result = {};
    name = name.trim();
    if (name === "") {
      result.code = 1;
      result.msg = "Empty username!";
      return result;
    }
    if (name.length > 64) {
      result.code = 1;
      result.msg = "username exceed limit length!";
      return result;
    }
    var from = Blockchain.transaction.from;
    var address = this.nameToAddress.get(name);
    if (address) {
      result.code = 1;
      result.msg = "username has been taken,change another username!";
      return result;
    } else {
      var cname = this.addressToName.get(from);
      if(cname){
        result.code = 1;
        result.msg = "username can not set again!";
        return result;
      }
      this.nameToAddress.set(name, from);
      this.addressToName.set(from, name);
      result.code = 0;
      return result;
    }

  },
  changeUsername: function (newName) {
    var result = {};
    newName = newName.trim();
    if (newName === "") {
      result.code = 1;
      result.msg = "Empty new username!";
      return result;
    }
    if (newName.length > 64) {
      result.code = 1;
      result.msg = "new username exceed limit length!";
      return result;
    }
    var from = Blockchain.transaction.from;
    var address = this.nameToAddress.get(newName);
    if (address) {
      result.code = 1;
      result.msg = "new username has been taken,change another username!";
      return result;
    } else {
      var lastName = this.addressToName.get(from);
      this.nameToAddress.put(lastName, "");
      this.addressToName.put(from, "");
      this.nameToAddress.put(newName, from);
      this.addressToName.put(from, newName);

      result.code = 0;
      return result;
    }
  },
  getUsername: function () {
    var from = Blockchain.transaction.from;
    return this.addressToName.get(from);
  },

  score: function (score, level, date) {
    var result = {};
    var ranks = this.ranks;
    if (ranks.length > 0) {
      var lastRank = ranks[ranks.length - 1];
      if (score <= lastRank.score) {
        result.code = 1;
        result.msg = "score is to low!";
        return result;
      }
    }
    var from = Blockchain.transaction.from;
    var username = this.addressToName.get(from);
    if (!username) {
      username = "匿名用户";
    }
    var invader = this.invaders.get(from);
    if (invader) {
      invader.name = username;
      if (score > invader.score) {
        invader.score = score;
        invader.level = level;
        invader.date = date;
      }
      this.invaders.put(from, invader);
    } else {
      var spaceInvader = new SpaceInvader();
      spaceInvader.name = username;
      spaceInvader.address = from;
      spaceInvader.score = score;
      spaceInvader.level = level;
      spaceInvader.date = date;
      this.invaders.put(from, spaceInvader);
      invader = spaceInvader;
    }

    var alreadyInRank = false;
    for (var i = 0; i < this.ranks.length; i++) {
      if (this.ranks[i] && this.ranks[i].address == from) {
        alreadyInRank = true;
        this.ranks[i] = invader;
        break;
      }
    }

    if (alreadyInRank) {
      this.ranks.sort(this.compare);
    } else {
      if (this.ranks.length < 3) {
        this.ranks.push(invader);
      } else {
        this.ranks.pop();
        this.ranks.push(invader);
      }
      this.ranks.sort(this.compare);
    }

    result.code = 0;
    return result;
  },

  getRank: function () {
    for (var i = 0; i < this.ranks.length; i++) {
      var rank = this.ranks[i];
      var address = rank.address;
      var username = this.addressToName.get(address);
      if (username) {
        rank.name = username;
      }
    }
    return this.ranks;
  },

  compare: function compare(a, b) {
    var scoreA = a.score;
    var scoreB = b.score;

    var comparison = 0;
    if (scoreA > scoreB) {
      comparison = -1;
    } else if (scoreA < scoreB) {
      comparison = 1;
    }
    return comparison;
  },

};

module.exports = SpaceInvadersContract;
