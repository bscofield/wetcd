Wetcd = Ember.Application.create();

Wetcd.Router.map(function() {
  this.resource('keys', { path: '*key' });
});

Wetcd.Etcd = Ember.Object.extend({});
Wetcd.Etcd.reopenClass({
  keys: function(key) {
    var path = '';
    if (key != '') { path = key.replace( new RegExp("^\/+"), ''); }

    var list = Em.A();

    $.get("http://192.168.10.10/v1/" + path, function(response) {
      var data = $.parseJSON(response);
      if (Ember.isArray(data)) {
        data.forEach(function (k) {
          k['key_path'] = 'keys'+k['key']
          list.pushObject(k);
        });
      } else {
        data['key_path'] = 'keys'+data['key']
        list.pushObject(data);
      }
    });
    return list;
  }
});


Wetcd.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('keys', 'keys');
  }
});

Wetcd.KeysRoute = Ember.Route.extend({
  model: function(params) {
    return Wetcd.Etcd.keys(params.key);
  }
});