;(function (win, doc) {

  if (typeof win === 'undefined' || typeof doc === 'undefined') {
    return void 0;
  }

  if (typeof win.console === 'undefined') {
    win.console = {
      "log": alertLog,
      "error": alertLog
    };
  }

  win.XMLquery = XMLquery;

  function XMLquery (config) {

    var parser, xml_doc, use_cors, xhr, xdr;

    switch (true) {

      case !('DOMParser' in win):
        win.console.error('Your browser does not support DOMParser');
        return void 0;

      case !('XMLHttpRequest' in win):
        win.console.error('Your browser does not support basic AJAX');
        return void 0;

      case (typeof config !== 'object'):
        win.console.error('You have not supplied configuration settings');
        return void 0;

      case (typeof config.url !== 'string'):
        win.console.error('You have not supplied a URL');
        return void 0;

      case (typeof config.callback !== 'function'):
        win.console.error('You have not specified a callback function');
        return void 0;

      case !(config.url):
        win.console.error('Your URL should be a non-empty string');
        return void 0;

      case !(config.url.match(/^(?:https?):\/\//)):
        win.console.error('Please supply a HTTP protocol');
        return void 0;

      default:
        parser = new win.DOMParser();
        use_cors = win.location.host !== config.url.match(/^(?:https?):\/\/(?:[^@:\/]*@)?([^:\/]+)/)[1] ? 'cors' : 'no-cors';
    }

    switch (true) {

      case ('fetch' in win):
        win.fetch(config.url, {
          "mode": use_cors
        }).then(function (resp) {
          if (resp.ok) {
            return resp.text().then(function (xml) {
              xml_doc = parser.parseFromString(xml, 'text/xml');
              if (typeof xml_doc !== 'object') return;
              return config.callback(xml_doc);

            }).catch(function (e) {
              win.console.warn('Failed to process response; error: ' + e);
              return void 0;

            });
          }
        }).catch(function (e) {
          win.console.warn('Failed to fetch; error: ' + e);
          return void 0;

        });
        break;

      case ('XDomainRequest' in win && use_cors === 'cors'):
        xdr = new win.XDomainRequest();
        xdr.open('GET', config.url, true);

        xdr.onload = function () {
          xml_doc = parser.parseFromString(xdr.responseText, 'text/xml');
          if (typeof xml_doc !== 'object') return;
          return config.callback(xml_doc);
        };

        xdr.ontimeout = xdr.onerror = xdr.onabort = function () {
          xdr.ontimeout = function () {};
          xdr.onerror = function () {};
          xdr.onabort = function () {};
          xdr.onload = function () {};
          win.console.warn('XDR failed');
          return void 0;
        };

        win.setTimeout(xdr.send(), 0);
        break;

      default:
        xhr = new win.XMLHttpRequest();
        xhr.open('GET', config.url, true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            xml_doc = parser.parseFromString(xhr.responseText, 'text/xml');
            if (typeof xml_doc !== 'object') return;
            return config.callback(xml_doc);
          }
        };

        xhr.ontimeout = xhr.onerror = xhr.onabort = function () {
          xhr.ontimeout = function () {};
          xhr.onerror = function () {};
          xhr.onabort = function () {};
          xhr.onreadystatechange = function () {};
          win.console.warn('XHR failed. Status code: ' + xhr.status + '; readyState: ' + xhr.readyState);
          return void 0;
        };

        win.setTimeout(xhr.send(), 0);
    }
  }

  function alertLog () {
    var i = 0;
    for ( ; i < arguments.length; ++i) {
      alert(arguments[i]);
    }
  }

})(window, window.document);
