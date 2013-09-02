Wetcd = Ember.Application.create();

Wetcd.Router.map(function() {
  this.resource('keys');
  this.resource('key', { path: '/keys/*key' });
});

Wetcd.Etcd = Ember.Object.extend({});
Wetcd.Etcd.reopenClass({
  keys: function(key) {
    var path = '';
    if (key != '') { path = key.replace( new RegExp("^\/+"), ''); }

    var list = Em.A();

    $.get("http://192.168.10.10/v1/keys/" + path, function(response) {
      var data = $.parseJSON(response);
      if (Ember.isArray(data)) {
        data.forEach(function (k) {
          list.pushObject(k);
        });
      } else {
        list.pushObject(data);
      }
    });
    return list;
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

Wetcd.KeyRoute = Ember.Route.extend({
  model: function(params) {
    console.log(params.key);
    return Wetcd.Etcd.keys(params.key);
  },

  renderTemplate: function() {
    this.render('keys');
  }
});