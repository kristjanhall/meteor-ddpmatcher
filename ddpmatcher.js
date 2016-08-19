DDPMatcher = class DDPMatcherClass {
  constructor() {

    this._queue = {
      outstanding: {},
      reused: {},
      resolved: [],
      orphans: {},
    };

    this._hooks = {};
    const self = this;

    this._arrifyQueue = function(queue) {
      let _arr = [];
      for (let id in queue) {
        const item = queue[id];
        _arr = _arr.concat(item);
      }
      return _arr;
    }

    this.feed = function(obj) {
      if (!obj.id) return false;

      const id = obj.id;
      const queue = self._queue;

      if (obj.msg === "method") {
        if (id in queue.outstanding) {
          // damnit, DDP is reusing id's
          queue.reused[id] = (queue.reused[id]) ?
            queue.reused[id].concat(obj) :
            [obj];
          throwEvent('reused', obj);

        } else {
          queue.outstanding[id] = obj;
          throwEvent('waiting', obj);
        }
      }

      if (obj.msg === "result") {
        if (obj.id in queue.outstanding) {
          const outstanding = queue.outstanding[id];

          queue.resolved.push(id);

          delete queue.outstanding[id];
          throwEvent('resolved', id)

        } else {
          queue.orphans[id] = (queue.orphans[id]) ?
            queue.orphans[id].concat(obj) :
            [obj];
          throwEvent('orphan', obj);
        }
      }

      function throwEvent(event, data) {
        if (event in self._hooks) {
          self._hooks[event].forEach(callback => {
            callback({event, data});
          });
        }
      }
    }

    this.hook = function({event, callback}) {
      callback = callback.bind(self);
      self._hooks[event] = (self._hooks[event]) ?
        self._hooks[event].concat(callback) :
        [callback];
      return self;
    }

    this.orphans = function(arr) {
      if (!arr) {
        return this._queue.orphans;
      } else {
        return this._arrifyQueue(this._queue.orphans);
      }
    }

    this.outstanding = function(arr) {
      if (!arr) {
        return this._queue.outstanding;
      } else {
        return this._arrifyQueue(this._queue.outstanding);
      }
    }

    this.resolved = function() {
      return this._queue.resolved;
    }

    this.reused = function(arr) {
      if (!arr) {
        return this._queue.reused;
      } else {
        return this._arrifyQueue(this._queue.reused);
      }
    }
  }
}
