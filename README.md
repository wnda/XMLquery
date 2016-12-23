# XMLquery
Retrieve an XML document from a URL and execute a callback function on parsed XML document. 
Whether CORS should be enabled is detected by comparing the URL to `window.location.host`, but the API provides the option to force `cors`/`no-cors`.

# Usage
`XMLquery` is exposed to the `window` object as a global method, accepting a mandatory configuration object with two mandatory properties: `url` and `callback`. Given the purpose of this library, it's kind of easy to tell why they are mandatory.

    <!-- Include script -->
    <script src="/js/XMLquery.js"></script>
    
    <!-- Make the call with config object -->
    <script>
      window.XMLquery({
        "url": "http://www.YOUR-AMAZING-WEBSITE/XML-RESOURCE.xml",
        "cors": false,
        "callback": function(){
                      // do stuff
                    }
      });
    </script>
    
You can also store your config object in a variable and pass it in, like so:

    <!-- Include script -->
    <script src="/js/XMLquery.js"></script>
    
    <!-- Make the call with config object -->
    <script>
      var config = {
        "url": "http://www.YOUR-AMAZING-WEBSITE/XML-RESOURCE.xml",
        "cors": false,
        "callback": function(){
                      // do stuff
                    }
      };
      
      window.XMLquery(config);
    </script>

`config.cors` is not mandatory; set it to true to force `CORS` for your AJAX request.

Currently this library is designed to work only in-browser, i.e. not Web Workers or Node.js.

# Browser support
IE9+. IE8 will be fine if you polyfill `window.DOMParser` (as a minimum, you need `window.XMLHttpRequest`, or `window.XDomainRequest` for CORS in IE8/9).

### Why no IE7/IE8 support out of the box?
As you can see, this library requires `window.DOMParser`. `DOMParser` was introduced in IE9, where both `window.XMLHttpRequest` and `window.XDomainRequest` were also available, and thus there is not much point including support for `window.ActiveXObject('Microsoft.XMLHTTP')`, `window.ActiveXObject('Msxml2.XMLHTTP')`, or any other crap like that. If you're going to the trouble of polyfilling `window.DOMParser`, you may as well throw in an `window.XMLHttpRequest` or `window.fetch` polyfill as well.
