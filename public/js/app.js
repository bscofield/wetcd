Wetcd = Ember.Application.create();

Wetcd.Router.map(function() {
  this.resource('keys', { path: '*key' });
});

Wetcd.Key = Ember.Object.extend({
  editing: false,
  key_path: ''
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
          k['key_path'] = 'keys'+k['key'];
          list.pushObject(Wetcd.Key.create(k));
        });
      } else {
        data['key_path'] = 'keys'+data['key'];
        list.pushObject(Wetcd.Key.create(data));
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

Wetcd.KeyController = Ember.ObjectController.extend({
  actions: {
    edit: function() {
      this.set('editing', true);
    },
    save: function() {
      this.set('editing', false);
    }
  }
});