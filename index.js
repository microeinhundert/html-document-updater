/*
 * Example usage:
 *
 * <body id="test" class="test" data-update-id="body">
 *  <h1 data-test="test" data-update-id="main-heading">Hello World</h1>
 * </body>
 *
 *
 * import HTMLDocumentUpdater from 'html-document-updater';
 *
 * const htmlDocumentUpdater = new HTMLDocumentUpdater({
 *   options: {
 *     strictChecking: false,
 *     attributes: {
 *       updateIdentifier: 'data-update-id'
 *     }
 *   },
 *   htmlDocument: document,
 *   updatedHtmlDocument: HTMLDocument, // Or set/update it afterwards as shown below
 *   updates: {
 *     body: {
 *       attributes: ['id', 'class']
 *     },
 *     mainHeading: {
 *       attributes: ['data-test'],
 *       innerHTML: true
 *     }
 *   }
 * });
 *
 * this.htmlDocumentUpdater.updatedHtmlDocument = HTMLDocument; // Set the updated (remote) HTMLDocument
 * this.htmlDocumentUpdater.update(); // Update the HTMLDocument with content taken from the updated (remote) HTMLDocument
 */
class HTMLDocumentUpdater {
  /**
   * Options
   */
  _options = {
    strictChecking: false,
    attributes: {
      updateIdentifier: 'data-update-id'
    }
  }

  /**
   * DOM Parser
   */
  _domParser = new DOMParser();

  /**
   * The HTMLDocument.
   */
  _htmlDocument = document;

  /**
   * The updated (remote) HTMLDocument.
   */
  _updatedHtmlDocument = null;

  /**
   * Elements in the HTMLDocument.
   */
  _elementsInHtmlDocument = new Map();

  /**
   * Elements in the updated (remote) HTMLDocument.
   */
  _elementsInUpdatedHtmlDocument = new Map();

  /**
   * The update configuration.
   */
  _updates = {};

  /**
   * Getter to get the options.
   * @returns {Object}
   */
  get options() {
    return this._options;
  }

  /**
   * Setter to set the options.
   * @param {Object} options
   * @returns {void}
   */
  set options(options) {
    this._options = options;
  }

  /**
   * Getter to get the HTMLDocument.
   * @returns {HTMLDocument}
   */
  get htmlDocument() {
    return this._htmlDocument;
  }

  /**
   * Setter to set the HTMLDocument.
   * @param {HTMLDocument|string} doc
   * @returns {void}
   */
  set htmlDocument(doc) {
    if (doc instanceof HTMLDocument) {
      this._htmlDocument = doc;
    } else if (typeof doc === 'string') {
      this._htmlDocument = this._domParser.parseFromString(doc, 'text/html');
    } else {
      throw new Error('The HTMLDocument must be of type "string" or "HTMLDocument"!');
    }
  }

  /**
   * Getter to get the updated (remote) HTMLDocument.
   * @returns {HTMLDocument}
   */
  get updatedHtmlDocument() {
    return this._updatedHtmlDocument;
  }

  /**
   * Setter to set the updated (remote) HTMLDocument.
   * @param {HTMLDocument|string} doc
   * @returns {void}
   */
  set updatedHtmlDocument(doc) {
    if (doc instanceof HTMLDocument) {
      this._updatedHtmlDocument = doc;
    } else if (typeof doc === 'string') {
      this._updatedHtmlDocument = this._domParser.parseFromString(doc, 'text/html');
    } else {
      throw new Error('The updated (remote) HTMLDocument must be of type "string" or "HTMLDocument"!');
    }
  }

  /**
   * Getter to get the elements in the HTMLDocument.
   * @returns {Map}
   */
  get elementsInHtmlDocument() {
    return this._elementsInHtmlDocument;
  }

  /**
   * Setter to set the elements in the HTMLDocument.
   * @param {NodeList} elements
   * @returns {void}
   */
  set elementsInHtmlDocument(elements) {
    this._elementsInHtmlDocument.clear();

    elements.forEach((element) => {
      const $updateIdentifier = this.formatUpdateIdentifier(
        element.getAttribute(this.options.attributes.updateIdentifier)
      );

      if ($updateIdentifier) this._elementsInHtmlDocument.set($updateIdentifier, element);
    });
  }

  /**
   * Getter to get the elements in the updated (remote) HTMLDocument.
   * @returns {Map}
   */
  get elementsInUpdatedHtmlDocument() {
    return this._elementsInUpdatedHtmlDocument;
  }

  /**
   * Setter to set the elements in the updated (remote) HTMLDocument.
   * @param {NodeList} elements
   * @returns {void}
   */
  set elementsInUpdatedHtmlDocument(elements) {
    this._elementsInUpdatedHtmlDocument.clear();

    elements.forEach((element) => {
      const $updateIdentifier = this.formatUpdateIdentifier(
        element.getAttribute(this.options.attributes.updateIdentifier)
      );

      if ($updateIdentifier) this._elementsInUpdatedHtmlDocument.set($updateIdentifier, element);
    });
  }

  /**
   * Getter to get the update configuration.
   * @returns {Object}
   */
  get updates() {
    return this._updates;
  }

  /**
   * Setter to set the updates configuration.
   * @param {Object} updates
   * @returns {void}
   */
  set updates(updates) {
    this._updates = updates;
  }

  /**
   * Update an attribute value in the HTMLDocument with the attribute value from the updated (remote) HTMLDocument.
   * @param {HTMLElement} elementInHtmlDocument The element to update in the HTMLDocument.
   * @param {HTMLElement} elementInUpdatedHtmlDocument The same element in the updated (remote) HTMLDocument.
   * @param {array} attributes The array of attributes to update.
   * @param {string} updateIdentifier The update identifier of the element.
   * @returns {void}
   */
  updateAttributes(
    elementInHtmlDocument,
    elementInUpdatedHtmlDocument,
    attributes,
    updateIdentifier
  ) {
    attributes.forEach((attribute) => {
      if (elementInHtmlDocument && elementInUpdatedHtmlDocument) {
        if (elementInUpdatedHtmlDocument.hasAttribute(attribute)) {
          elementInHtmlDocument.setAttribute(attribute, elementInUpdatedHtmlDocument.getAttribute(attribute));
        } else {
          elementInHtmlDocument.removeAttribute(attribute);
        }
      } else if (this.options.strictChecking) {
        throw new Error(`The element with update identifier "${updateIdentifier}" does not exist in both HTMLDocuments!`);
      }
    });
  }

  /**
   * Update innerHTML in the HTMLDocument with inenrHTML from the updated (remote) HTMLDocument.
   * @param {HTMLElement} elementInHtmlDocument The element to update in the HTMLDocument.
   * @param {HTMLElement} elementInUpdatedHtmlDocument The same element in the updated (remote) HTMLDocument.
   * @param {string} updateIdentifier The update identifier of the element.
   * @returns {void}
   */
  updateInnerHtml(
    elementInHtmlDocument,
    elementInUpdatedHtmlDocument,
    updateIdentifier
  ) {
    if (elementInHtmlDocument && elementInUpdatedHtmlDocument) {
      elementInHtmlDocument.innerHTML = elementInUpdatedHtmlDocument.innerHTML; // eslint-disable-line
    } else if (this.options.strictChecking) {
      throw new Error(`The element with update identifier "${updateIdentifier}" does not exist in both HTMLDocuments!`);
    }
  }

  /**
   * Format an update identifier.
   * @param {string} identifier The identifier to format.
   * @returns {string}
   */
  formatUpdateIdentifier(identifier) {
    const $formattedIdentifier = identifier.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    return $formattedIdentifier;
  }

  /**
   * Handle element updates.
   * @returns {void}
   */
  handleUpdates() {
    this.elementsInHtmlDocument.forEach((element, updateIdentifier) => {
      if (updateIdentifier in this.updates) {
        const $elementInHtmlDocument = element;
        const $elementInUpdatedHtmlDocument = this.elementsInUpdatedHtmlDocument.get(updateIdentifier);
        const $elementConfig = this.updates[updateIdentifier];

        // Update attributes
        if ('attributes' in $elementConfig && $elementConfig.attributes.length) {
          this.updateAttributes(
            $elementInHtmlDocument,
            $elementInUpdatedHtmlDocument,
            $elementConfig.attributes,
            updateIdentifier
          );
        }

        // Update innerHTML
        if ('innerHTML' in $elementConfig && $elementConfig.innerHTML) {
          this.updateInnerHtml(
            $elementInHtmlDocument,
            $elementInUpdatedHtmlDocument,
            updateIdentifier
          );
        }
      } else if (this.options.strictChecking) {
        throw new Error(`No update configuration found for element with identifier "${updateIdentifier}"!`);
      }
    });
  }

  /**
   * Collect all elements in the HTMLDocument and updated (remote) HTMLDocument awaiting updates.
   * @returns {void}
   */
  collectElements() {
    const $updateIdentifierAttributeSelector = `[${this.options.attributes.updateIdentifier}]`;

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

  /**
   * Update the HTMLDocument.
   * @returns {void}
   */
  update() {
    this.collectElements();
    this.handleUpdates();
  }

  /**
   * Invoked when a class instance is created.
   * @param {Object} config The configuration object.
   * @param {Object} config.options The options object.
   * @param {HTMLDocument|string} config.htmlDocument The HTMLDocument.
   * @param {HTMLDocument|string} config.updatedHtmlDocument The updated (remote) HTMLDocument.
   * @param {Object} config.updates The updates configuration.
   * @returns {void}
   */
  constructor(config = {}) {
    if ('options' in config) {
      if (typeof config.options === 'object') {
        this.options = Object.assign(this.options, config.options);
      } else {
        throw new Error('No valid "options" object passed to HTMLDocumentUpdater!');
      }
    }

    if ('htmlDocument' in config) {
      if (typeof config.htmlDocument === 'string' || config.htmlDocument instanceof HTMLDocument) {
        this.htmlDocument = config.htmlDocument;
      } else {
        throw new Error('No valid "htmlDocument" passed to HTMLDocumentUpdater! It has to to be either of type "string" or "HTMLDocument.');
      }
    }

    if ('updatedHtmlDocument' in config) {
      if (typeof config.updatedHtmlDocument === 'string' || config.updatedHtmlDocument instanceof HTMLDocument) {
        this.updatedHtmlDocument = config.updatedHtmlDocument;
      } else {
        throw new Error('No valid "updatedHtmlDocument" passed to HTMLDocumentUpdater! It has to to be either of type "string" or "HTMLDocument.');
      }
    }

    if ('updates' in config) {
      if (typeof config.updates === 'object') {
        this.updates = config.updates;
      } else {
        throw new Error('No valid "updates" object passed to HTMLDocumentUpdater!');
      }
    }
  }
}

export default HTMLDocumentUpdater;