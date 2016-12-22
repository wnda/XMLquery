;(function (win, doc) {

  win.getXMLDoc = getXMLDoc;

  function getXMLDoc (config) {
    var xhr;
    var xml_doc;
    var parser;
    var url;
    var callback;

    switch (true) {
      case !('DOMParser' in win):
      case !('XMLHttpRequest' in win):
      case (typeof config !== 'object'):
      case (typeof config.url !== 'string'):
      case (typeof config.callback !== 'function'):
      case (config.url.length < 1):
        return;
    }

    parser = new win.DOMParser();

    if ('fetch' in win) {

      win.fetch(config.url, {
        'mode': !!config.cors ? 'cors' : 'no-cors'
      }).then(function (resp) {

        if (resp.ok) {
          return resp.text().then(function (xml) {

            xml_doc = parser.parseFromString(xml, 'text/xml');
            if (typeof xml_doc !== 'object') return;
            return config.callback(xml_doc);

          }).catch(function (e) {
            console.warn('Failed to process response; error: ' + e);
          });
        }

      }).catch(function (e) {
        console.warn('Failed to fetch; error: ' + e);
      });

    } else {

      xhr = new win.XMLHttpRequest();
      xhr.open('GET', config.url, true);

      if ('responseType' in xhr) xhr.responseType = 'text';

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {

          xml_doc = parser.parseFromString(xhr.responseText, 'text/xml');
          if (typeof xml_doc !== 'object') return;
          return config.callback(xml_doc);

        }
      };

      xhr.ontimeout = xhr.onerror = xhr.onabort = function () {
        xhr.onreadystatechange = function () {};
        xhr.ontimeout = function () {};
        xhr.onerror = function () {};
        xhr.onabort = function () {};
        console.warn('XHR failed. Status code: ' + xhr.status + '; readyState: ' + xhr.readyState);
      };

      win.setTimeout(
        xhr.send(null),
      0);
    }

  }

})(window, window.document);
