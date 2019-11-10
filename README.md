# html-document-updater
A small utility to update parts of an HTMLDocument with content from another HTMLDocument, configured with a simple configuration object and data attribute. Useful together with libraries like Barba.js to update elements outside of scope.


## Usage

```js
// Initialize
const htmlDocumentUpdater = new HTMLDocumentUpdater({
  updates: {
    body: {
      attributes: ['id']
    },
    heading: {
      attributes: ['data-test']
    }
  }
});

// Set the HTMLDocument afterwards
const parser = new DOMParser();
htmlDocumentUpdater.htmlDocument = parser.parseFromString('<html></html>', 'text/html');

// Or directly pass the document as string and let the utlity parse it for you
htmlDocumentUpdater.htmlDocument = '<html></html>';

// Or pass the document object to update the DOM (done by default)
htmlDocumentUpdater.htmlDocument = document;

// You can also get the updated HTMLDocument this way if it's not the document object (after calling the update function)
console.log(this.htmlDocumentUpdater.htmlDocument);


// Set the updated (remote) HTMLDocument afterwards
const parser = new DOMParser();
htmlDocumentUpdater.updatedHtmlDocument = parser.parseFromString('<html></html>', 'text/html');

// Or directly pass the document as string and let the utlity parse it for you
htmlDocumentUpdater.updatedHtmlDocument = '<html></html>';


// Update the HTMLDocument with content taken from the updated (remote) HTMLDocument
htmlDocumentUpdater.update();
```

### Markup

```html
<body id="test" class="test" data-update-id="body">
  <h1 data-test="test" data-update-id="main-heading">Hello World</h1>
</body>
```
> The `data-update-id` attribute specifies an unique identifier for the element. This identifier is later used to reference the element in the `updates` configuration.

### Configuration

To update the id attribute on the `<body>` tag and the `data-test` attribute on the `<h1>` tag:

```js
import HTMLDocumentUpdater from 'html-document-updater';

const htmlDocumentUpdater = new HTMLDocumentUpdater({
  updates: {
    body: {
      attributes: ['id']
    },
    mainHeading: {
      attributes: ['data-test']
    }
  }
});
```

To update the `id` and `class` attributes on the `<body>` tag and the innerHTML of the `<h1>` element:

```js
import HTMLDocumentUpdater from 'html-document-updater';

const htmlDocumentUpdater = new HTMLDocumentUpdater({
  updates: {
    body: {
      attributes: ['id', 'class']
    },
    mainHeading: {
      innerHTML: true
    }
  }
});
```

### Constructor Options

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| options.strictChecking | Boolean | false | Strictly check if elements exist in both HTMLDocuments and if a configuration exists for an update identifier. Throw error if that's not the case. |
| options.attributes.updateIdentifier | String | 'data-update-id' | Data attribute used for the update identifier of an element. |
| htmlDocument | HTMLDocument or String | document | The HTMLDocument. This is the HTMLDocument that gets updated. |
| updatedHtmlDocument | HTMLDocument or String | null | The updated HTMLDocument. This is the HTMLDocument the updates for the above one are taken from. |
| updates | Object | {} | The object to configure the updates to be done. See the examples above for possible options. |