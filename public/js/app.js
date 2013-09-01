Wetcd = Ember.Application.create();

Wetcd.Router.map(function() {
  this.route('keys');
});

Wetcd.Etcd = Ember.Object.extend({});
Wetcd.Etcd.reopenClass({
  keys: function(key) {
    var path = '';
    if (key != '') { path = key; }

    var keys = Em.A();

    $.get("http://192.168.10.10/v1/keys/" + path, function(response) {
      $.parseJSON(response).forEach(function (k) {
        keys.pushObject(k);
      });
    });
    return keys;
  }
});


Wetcd.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('keys');
  }
});

Wetcd.KeysRoute = Ember.Route.extend({
  model: function(params) {
    return Wetcd.Etcd.keys('');
  }
});