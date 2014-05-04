
describeComponent('component/hello', function () {
  "use strict";

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent('<div><h1></h1></div>');
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  it('should set content of h1 tag to hello', function() {
    expect($('h1')).toHaveText('Hello!');
  });

});
