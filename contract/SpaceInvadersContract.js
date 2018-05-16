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
    LocalContractStorage.defineMapProperty(this, "invadersMap");
    LocalContractStorage.defineMapProperty(this, "invaders", {
        parse: function (text) {
            return new SpaceInvader(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

SpaceInvadersContract.prototype = {

    init: function () {
        this.size = 0;
    },

    changeUsername: function (newName) {
        var result = {};
        newName = newName.trim();
        if (newName === "") {
            throw new Error("Empty new username!");
        }
        if (newName.length > 64) {
            throw new Error("new username exceed limit length!");
        }
        var from = Blockchain.transaction.from;
        var address = this.nameToAddress.get(newName);
        if (address) {
            throw new Error("new username has been taken,change another username!");
        } else {
            var lastName = this.addressToName.get(from);
            if(lastName){
                delete this.nameToAddress[lastName];
                delete this.addressToName[from];
                this.nameToAddress.set(newName, from);
                this.addressToName.set(from, newName);
                var invader = this.invaders.get(from);
                invader.name = newName;
                this.invaders.put(from, invader);

            }else {

                var inva = this.invaders.get(from);
                if(inva){
                    inva.name = newName;
                    this.invaders.put(from, inva);
                }else {
                    var spaceInvader = new SpaceInvader();
                    spaceInvader.name = newName;
                    spaceInvader.address = from;
                    spaceInvader.score = 0;
                    spaceInvader.level = 0;
                    spaceInvader.date = "";

                    this.nameToAddress.set(newName, from);
                    this.addressToName.set(from, newName);
                    var index = this.size;
                    this.invadersMap.set(index, from);
                    this.invaders.put(from, spaceInvader);
                    this.size += 1;
                }
            }

            result.code = 0;
            return result;
        }
    },
    getUsername: function () {
        var from = Blockchain.transaction.from;
        return this.addressToName.get(from);
    },

    score: function (score, level, date) {

        score = score.trim();
        level = level.trim();
        date = date.trim();

        if (score === "" || level === "") {
            throw new Error("Empty score or level");
        }

        score = parseInt(score);
        level = parseInt(level);

        var from = Blockchain.transaction.from;
        var username = this.addressToName.get(from);
        if (!username) {
            username = "匿名用户";
        }
        var invader = this.invaders.get(from);
        if (invader) {
            // update invader
            if(score > invader.score){
                invader.name = username;
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
            var index = this.size;
            this.invadersMap.set(index, from);
            this.invaders.put(from, spaceInvader);
            this.size += 1;
        }
    },

    get: function () {
        var from = Blockchain.transaction.from;
        return this.invaders.get(from);
    },

    len: function () {
        return this.size;
    },

    query: function (limit, offset) {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (offset > this.size) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.size) {
            number = this.size;
        }
        var result = [];
        for (var i = offset; i < number; i++) {
            var key = this.invadersMap.get(i);
            var object = this.invaders.get(key);
            result.push(object);
        }
        var obj = {};
        obj.invaders = result;
        obj.size = this.size;
        return obj;
    }

};

module.exports = SpaceInvadersContract;
