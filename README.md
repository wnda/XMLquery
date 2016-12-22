# XMLquery
retrieve an XML document from URL and execute callback on XML DOM. The need for CORS is detected by c

# Usage
`XMLquery` is exposed to the window object as a global method, accepting a mandatory configuration object with two mandatory properties: `url` and `callback`. Given the purpose of this library, it's kind of easy to tell why they are mandatory.

    <script src="/js/xmlquery.js"></script>
    <script>
      window.XMLquery({
        "url": "http://www.YOUR-AMAZING-WEBSITE/XML-RESOURCE.xml",
        "callback": function(){
                      // do stuff
                    }
      });
    </script>

# Browser support
IE9+. IE8 will be fine if you polyfill window.DOMParser (as a minimum, you need XMLHttpRequest, or XDomainRequest for CORS).

### Why no IE7/IE8 support out of the box?
As you can see, this library requires `window.DOMParser`. `DOMParser` was introduced in IE9, where both `window.XMLHttpRequest` and `window.XDomainRequest` were also available, and thus there is not much point including support for `window.ActiveXObject('Microsoft.XMLHTTP')`, `window.ActiveXObject('Msxml2.XMLHTTP')`, or any other crap like that. If you're going to the trouble of polyfilling DOMParser, you may as well throw in an XHR2/fetch polyfill as well.
