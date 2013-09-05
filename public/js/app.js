Wetcd = Ember.Application.create({});

Wetcd.Router.map(function() {
  this.resource('keys', { path: '*key' });
});

Wetcd.Key = Ember.Object.extend({
  deleted: false,
  editing: false,
  key_path: '',

  save: function(new_value) {
    $.post("/v1/" + this.key_path, {value: new_value});
  },
  delete: function() {
    if (!this.get('deleted')) {
      $.ajax({
        type: "DELETE",
        url: "/v1/" + this.key_path
      });
      this.set('value', '<em>deleted</em>');
    }
  }
});

Wetcd.Etcd = Ember.Object.extend({});
Wetcd.Etcd.reopenClass({
  createKey: function(new_key, new_value) {
    $.post("/v1/keys" + new_key, {value: new_value});
  },
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
  newKey: '',
  newValue: '',

  model: function(params) {
    return Wetcd.Etcd.keys(params.key);
  },
  actions: {
    createKey: function() {
      newKey = this.controller.get('newKey');
      if (newKey[0] != '/') {
        newKey = '/'+newKey;
      }
      Wetcd.Etcd.createKey(newKey, this.controller.get('newValue'));

      parent = findParent(newKey);
      this.controller.set('model', Wetcd.Etcd.keys(parent));

      $('#add-key').collapse('hide');
    }
  }
});

Wetcd.KeyController = Ember.ObjectController.extend({
  actions: {
    edit: function() {
      if (!this.get('deleted')) {
        this.set('editing', true);
      }
    },
    cancel: function() {
      this.set('editing', false);
    },
    update: function() {
      console.log(this.get('value'));
      this.content.save(this.get('value'));
      this.set('editing', false);
    },
    delete: function() {
      parent = findParent(this.content.key);
      this.content.delete();
      this.set('editing', false);
      this.set('deleted', true);
      this.parentController.set('content', Wetcd.Etcd.keys(parent));
    }
  }
});

Wetcd.EditValueView = Ember.TextField.extend({
  didInsertElement: function () {
    this.$().focus();
  }
});

Ember.Handlebars.helper('edit-value', Wetcd.EditValueView);

var findParent = function (str) {
  pieces = str.split('/');
  pieces.pop();
  pieces.unshift('keys')
  return pieces.join('/')
}