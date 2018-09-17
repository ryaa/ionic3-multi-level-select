"use strict";

module.exports = {
  extends: "stylelint-config-recommended",
  rules: {
    "selector-type-no-unknown": [ true,
      {
        ignoreTypes: ["/^(ryaa-|ion-)/"]
      }
    ],
    "at-rule-no-unknown": [ true,
      {
        ignoreAtRules: ["include", "mixin"]
      }
    ]
  }
}
