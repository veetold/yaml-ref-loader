const transform = require('@cloudflare/json-schema-transform');
const resolve = require('path').resolve;

module.exports = function(source) {
  this.cacheable && this.cacheable();
  let callback = this.async();

  let dereferencer = new transform.AutoExtensionDereferencer(
    'file://' + resolve(this.resourcePath),
    source
  );

  dereferencer
    .dereference()
    .then(handleResolveSuccess.bind(this))
    .catch(callback);

  function handleResolveSuccess(schema) {
    this.value = [schema];
    dereferencer.getDependencies().forEach(d => {
      this.addDependency(d.localPath);
    });
    callback(null, `module.exports = ${JSON.stringify(schema, null, 2)};`);
  }
};
