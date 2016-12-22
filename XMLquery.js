;(function (win, doc) {

  if (typeof win === 'undefined' || typeof doc === 'undefined') return void 0;

  win.XMLquery = XMLquery;

  function XMLquery (config) {
    var parser, xml_doc, use_cors, xhr, xdr;

    switch (true) {
      case !('DOMParser' in win):
      case !('XMLHttpRequest' in win):
      case (typeof config !== 'object'):
      case (typeof config.url !== 'string'):
      case (typeof config.callback !== 'function'):
      case !(config.url):
      case !(config.url.match(/^(?:https?):\/\//)):
        return void 0;
      default:
        parser = new win.DOMParser();
        xhr = new win.XMLHttpRequest();
        use_cors = typeof config.cors !== 'undefined' && config.cors === true ?
          'cors' : win.location.host !== config.url.match(/^(?:https?):\/\/(?:[^@:\/]*@)?([^:\/]+)/)[1] ?
            'cors' : 'no-cors';
    }

    switch (true) {
      case ('fetch' in win):
        win.fetch(config.url, {
          "mode": use_cors
        }).then(function (resp) {
          if (resp.ok) {
            return resp.text().then(function (xml) {
              xml_doc = parser.parseFromString(xml, 'text/xml');
              if (typeof xml_doc !== 'object') return void 0;
              return config.callback(xml_doc);
            }).catch(function (e) {
              return void 0;
            });
          }
        }).catch(function (e) {
          return void 0;
        });
        break;

      case ('XDomainRequest' in win && use_cors === 'cors'):
        xdr = new win.XDomainRequest();
        xdr.open('GET', config.url, true);
        xdr.onload = function () {
          xml_doc = parser.parseFromString(xdr.responseText, 'text/xml');
          if (typeof xml_doc !== 'object') return void 0;
          return config.callback(xml_doc);
        };
        xdr.ontimeout = xdr.onerror = xdr.onabort = function () {
          xdr.ontimeout = win.Function.prototype;
          xdr.onerror = win.Function.prototype;
          xdr.onabort = win.Function.prototype;
          xdr.onload = win.Function.prototype;
          return void 0;
        };
        win.setTimeout(xdr.send(), 0);
        break;

      case (use_cors === 'no-cors' || 'withCredentials' in xhr && use_cors === 'cors'):
        xhr.open('GET', config.url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            xml_doc = parser.parseFromString(xhr.responseText, 'text/xml');
            if (typeof xml_doc !== 'object') return void 0;
            return config.callback(xml_doc);
          }
        };
        xhr.ontimeout = xhr.onerror = xhr.onabort = function () {
          xhr.ontimeout = win.Function.prototype;
          xhr.onerror = win.Function.prototype;
          xhr.onabort = win.Function.prototype;
          xhr.onreadystatechange = win.Function.prototype;
          return void 0;
        };
        win.setTimeout(xhr.send(), 0);
        break;

      default:
        return void 0;
    }
  }

})(window, window.document);
