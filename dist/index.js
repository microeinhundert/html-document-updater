"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLDocumentUpdater = function () {
  _createClass(HTMLDocumentUpdater, [{
    key: "updateAttributes",
    value: function updateAttributes(elementInHtmlDocument, elementInUpdatedHtmlDocument, attributes, updateIdentifier) {
      var _this = this;

      attributes.forEach(function (attribute) {
        if (elementInHtmlDocument && elementInUpdatedHtmlDocument) {
          if (elementInUpdatedHtmlDocument.hasAttribute(attribute)) {
            elementInHtmlDocument.setAttribute(attribute, elementInUpdatedHtmlDocument.getAttribute(attribute));
          } else {
            elementInHtmlDocument.removeAttribute(attribute);
          }
        } else if (_this.options.strictChecking) {
          throw new Error("The element with update identifier \"".concat(updateIdentifier, "\" does not exist in both HTMLDocuments!"));
        }
      });
    }
  }, {
    key: "updateInnerHtml",
    value: function updateInnerHtml(elementInHtmlDocument, elementInUpdatedHtmlDocument, updateIdentifier) {
      if (elementInHtmlDocument && elementInUpdatedHtmlDocument) {
        elementInHtmlDocument.innerHTML = elementInUpdatedHtmlDocument.innerHTML;
      } else if (this.options.strictChecking) {
        throw new Error("The element with update identifier \"".concat(updateIdentifier, "\" does not exist in both HTMLDocuments!"));
      }
    }
  }, {
    key: "updateOuterHtml",
    value: function updateOuterHtml(elementInHtmlDocument, elementInUpdatedHtmlDocument, updateIdentifier) {
      if (elementInHtmlDocument && elementInUpdatedHtmlDocument) {
        elementInHtmlDocument.outerHTML = elementInUpdatedHtmlDocument.outerHTML;
      } else if (this.options.strictChecking) {
        throw new Error("The element with update identifier \"".concat(updateIdentifier, "\" does not exist in both HTMLDocuments!"));
      }
    }
  }, {
    key: "formatUpdateIdentifier",
    value: function formatUpdateIdentifier(identifier) {
      var $formattedIdentifier = identifier.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      return $formattedIdentifier;
    }
  }, {
    key: "handleUpdates",
    value: function handleUpdates() {
      var _this2 = this;

      this.elementsInHtmlDocument.forEach(function (element, updateIdentifier) {
        if (updateIdentifier in _this2.updates) {
          var $elementInHtmlDocument = element;

          var $elementInUpdatedHtmlDocument = _this2.elementsInUpdatedHtmlDocument.get(updateIdentifier);

          var $elementConfig = _this2.updates[updateIdentifier];

          if ('attributes' in $elementConfig && $elementConfig.attributes.length) {
            _this2.updateAttributes($elementInHtmlDocument, $elementInUpdatedHtmlDocument, $elementConfig.attributes, updateIdentifier);
          }

          if ('outerHTML' in $elementConfig && $elementConfig.outerHTML === true) {
            _this2.updateOuterHtml($elementInHtmlDocument, $elementInUpdatedHtmlDocument, updateIdentifier);
          } else if ('innerHTML' in $elementConfig && $elementConfig.innerHTML === true) {
            _this2.updateInnerHtml($elementInHtmlDocument, $elementInUpdatedHtmlDocument, updateIdentifier);
          }
        } else if (_this2.options.strictChecking) {
          throw new Error("No update configuration found for element with identifier \"".concat(updateIdentifier, "\"!"));
        }
      });
    }
  }, {
    key: "collectElements",
    value: function collectElements() {
      var $updateIdentifierAttributeSelector = "[".concat(this.options.attributes.updateIdentifier, "]");

      if (this.htmlDocument instanceof HTMLDocument) {
        this.elementsInHtmlDocument = this.htmlDocument.querySelectorAll($updateIdentifierAttributeSelector);
      } else {
        throw new Error('You have to set "htmlDocument" first before updating!');
      }

      if (this.updatedHtmlDocument instanceof HTMLDocument) {
        this.elementsInUpdatedHtmlDocument = this.updatedHtmlDocument.querySelectorAll($updateIdentifierAttributeSelector);
      } else {
        throw new Error('You have to set "updatedHtmlDocument" first before updating!');
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.collectElements();
      this.handleUpdates();
    }
  }, {
    key: "options",
    get: function get() {
      return this._options;
    },
    set: function set(options) {
      this._options = options;
    }
  }, {
    key: "htmlDocument",
    get: function get() {
      return this._htmlDocument;
    },
    set: function set(doc) {
      if (doc instanceof HTMLDocument) {
        this._htmlDocument = doc;
      } else if (typeof doc === 'string') {
        this._htmlDocument = this._domParser.parseFromString(doc, 'text/html');
      } else {
        throw new Error('The HTMLDocument must be of type "string" or "HTMLDocument"!');
      }
    }
  }, {
    key: "updatedHtmlDocument",
    get: function get() {
      return this._updatedHtmlDocument;
    },
    set: function set(doc) {
      if (doc instanceof HTMLDocument) {
        this._updatedHtmlDocument = doc;
      } else if (typeof doc === 'string') {
        this._updatedHtmlDocument = this._domParser.parseFromString(doc, 'text/html');
      } else {
        throw new Error('The updated (remote) HTMLDocument must be of type "string" or "HTMLDocument"!');
      }
    }
  }, {
    key: "elementsInHtmlDocument",
    get: function get() {
      return this._elementsInHtmlDocument;
    },
    set: function set(elements) {
      var _this3 = this;

      this._elementsInHtmlDocument.clear();

      elements.forEach(function (element) {
        var $updateIdentifier = _this3.formatUpdateIdentifier(element.getAttribute(_this3.options.attributes.updateIdentifier));

        if ($updateIdentifier) _this3._elementsInHtmlDocument.set($updateIdentifier, element);
      });
    }
  }, {
    key: "elementsInUpdatedHtmlDocument",
    get: function get() {
      return this._elementsInUpdatedHtmlDocument;
    },
    set: function set(elements) {
      var _this4 = this;

      this._elementsInUpdatedHtmlDocument.clear();

      elements.forEach(function (element) {
        var $updateIdentifier = _this4.formatUpdateIdentifier(element.getAttribute(_this4.options.attributes.updateIdentifier));

        if ($updateIdentifier) _this4._elementsInUpdatedHtmlDocument.set($updateIdentifier, element);
      });
    }
  }, {
    key: "updates",
    get: function get() {
      return this._updates;
    },
    set: function set(updates) {
      this._updates = updates;
    }
  }]);

  function HTMLDocumentUpdater() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HTMLDocumentUpdater);

    _defineProperty(this, "_options", {
      strictChecking: false,
      attributes: {
        updateIdentifier: 'data-update-id'
      }
    });

    _defineProperty(this, "_domParser", new DOMParser());

    _defineProperty(this, "_htmlDocument", document);

    _defineProperty(this, "_updatedHtmlDocument", null);

    _defineProperty(this, "_elementsInHtmlDocument", new Map());

    _defineProperty(this, "_elementsInUpdatedHtmlDocument", new Map());

    _defineProperty(this, "_updates", {});

    if ('options' in config) {
      if (_typeof(config.options) === 'object') {
        this.options = _objectSpread({}, this.options, {}, config.options);
      } else {
        throw new Error('No valid "options" object passed to HTMLDocumentUpdater!');
      }
    }

    if ('htmlDocument' in config) {
      if (typeof config.htmlDocument === 'string' || config.htmlDocument instanceof HTMLDocument) {
        this.htmlDocument = config.htmlDocument;
      } else {
        throw new Error('No valid "htmlDocument" passed to HTMLDocumentUpdater! It has to be either of type "string" or "HTMLDocument".');
      }
    }

    if ('updatedHtmlDocument' in config) {
      if (typeof config.updatedHtmlDocument === 'string' || config.updatedHtmlDocument instanceof HTMLDocument) {
        this.updatedHtmlDocument = config.updatedHtmlDocument;
      } else {
        throw new Error('No valid "updatedHtmlDocument" passed to HTMLDocumentUpdater! It has to be either of type "string" or "HTMLDocument".');
      }
    }

    if ('updates' in config) {
      if (_typeof(config.updates) === 'object') {
        this.updates = config.updates;
      } else {
        throw new Error('No valid "updates" object passed to HTMLDocumentUpdater!');
      }
    }
  }

  return HTMLDocumentUpdater;
}();

var _default = HTMLDocumentUpdater;
exports["default"] = _default;