// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ddpmatcher.js.
import { name as packageName } from "meteor/kristjanhall:ddpmatcher";

// Write your tests here!
// Here is an example.
Tinytest.add('ddpmatcher - example', function (test) {
  test.equal(packageName, "ddpmatcher");
});
