Wetcd = Ember.Application.create();

Wetcd.Router.map(function() {
  this.resource('keys', { path: '*key' });
});

Wetcd.Key = Ember.Object.extend({
  editing: false,
  key_path: '',

  save: function(new_value) {
    if (this.value != new_value) {
      $.post("/v1/" + this.key_path, {value: new_value});
      this.set('value', new_value);
    }
  }
});

Wetcd.Etcd = Ember.Object.extend({});
Wetcd.Etcd.reopenClass({
  keys: function(key) {
    var path = '';
    if (key != '') { path = key.replace( new RegExp("^\/+"), ''); }

    var list = Em.A();

    $.get("/v1/" + path, function(response) {
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
      this.content.save(this.get('value'));
      this.set('editing', false);
    }
  }
});

Wetcd.EditValueView = Ember.TextField.extend({
  didInsertElement: function () {
    this.$().focus();
  }
});

Ember.Handlebars.helper('edit-value', Wetcd.EditValueView);