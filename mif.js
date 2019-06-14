const _ = require('partial-js')

const mif = function() {
  var predi = _.pipe(arguments)
  return function() {
    var store = [[predi, _.pipe(arguments)]]
    return _.extend(If, {
      else_if: elseIf,
      elseIf: elseIf,
      else: function() {
        return store.push([_.constant(true), _.pipe(arguments)]) && If
      },
    })

    function elseIf() {
      var predi = _.pipe.apply(this, arguments)
      return function() {
        return store.push([predi, _.pipe(arguments)]) && If
      }
    }

    function If() {
      var args = arguments
      return _.go.call(this, store, store => {
        for (const s of store) {
          const res = s[0].apply(this, args)
          if (res) return s[1](res)
        }
      })
    }
  }
}

module.exports = mif
