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
        xhr = new win.XMLHttpRequest();
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
          if (typeof xml_doc !== 'object') {
            return;
          }
          return config.callback(xml_doc);
        };
        xdr.ontimeout = xdr.onerror = xdr.onabort = function () {
          xdr.ontimeout = win.Function.prototype;
          xdr.onerror = win.Function.prototype;
          xdr.onabort = win.Function.prototype;
          xdr.onload = win.Function.prototype;
          win.console.warn('XDR failed');
          return void 0;
        };
        win.setTimeout(xdr.send(), 0);
        break;

      case (use_cors === 'no-cors' || 'withCredentials' in xhr && use_cors === 'cors'):
        xhr.open('GET', config.url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            xml_doc = parser.parseFromString(xhr.responseText, 'text/xml');
            if (typeof xml_doc !== 'object') {
              return;
            }
            return config.callback(xml_doc);
          }
        };
        xhr.ontimeout = xhr.onerror = xhr.onabort = function () {
          xhr.ontimeout = win.Function.prototype;
          xhr.onerror = win.Function.prototype;
          xhr.onabort = win.Function.prototype;
          xhr.onreadystatechange = function () {};
          win.console.warn('XHR failed. Status code: ' + xhr.status + '; readyState: ' + xhr.readyState);
          return void 0;
        };
        win.setTimeout(xhr.send(), 0);
        break;

      default:
        win.console.warn('You\'re either testing a bizarre edge case, or somehow you\'ve broken XHR/XDR');
        return void 0;
    }
  }

  function alertLog () {
    var i = 0, args = [];
    for ( ; i < arguments.length; ++i) {
      args[i] = arguments[i];
    }
    args = args.length > 1 ? args.join(';') : args[0];
    return win.alert(args);
  }

})(window, window.document);
