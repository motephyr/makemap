

(function(win){

    var _getDepth = function(current, endParent){
        var n = 0;
        endParent = endParent || document.body;
        while(endParent != current){
            if(!current){
                n = -1; 
                break;
            }else{
                current = current.parentElement;
                n++;
            }
        }
        return n;
    };

    var _getIdx = function(element){
        var n = -1;
        var p;
        if(p = element.parentElement){
            var childs = p.childNodes;
            for(var i = 0, len = childs.length; i < len; i++){
                if(childs[i] == element) return i;
            }
        }
        return n;
    };

    var _getMaxZindex = function(dom){
        dom = dom || document.body;
        var maxZindex = -1;
        $(dom).find('*').each(function(){
            var zIndex = $(this).css("z-index"); 
            var getIt = zIndex != 'auto';
            if(getIt){
                maxZindex = Math.max(parseInt(zIndex), maxZindex);
            }
            return getIt;
        });
        return maxZindex;
    };

    var _elementReg = new RegExp("object HTML[^\s]+Element", "g");
    var _isDom = function(dom, tagName){
      return dom && _elementReg.test(Object.prototype.toString.call(dom)) && 
        (tagName ? (dom.tagName.toUpperCase() == tagName.toUpperCase()) : true);
    };

    win.getElementDepth = _getDepth;
    win.getElementIndexOfParent = _getIdx;
    win.getElementMaxZindex = _getMaxZindex;
    win.isDom = _isDom;

})(window);

(function(win){

  var _addRegion = function(el, ops){
    var elJQ = $(el);
    var offset = elJQ.offset();
    var deep = getElementDepth(el, this._parentEl);
    var idx = getElementIndexOfParent(el);
    this._regions.push({
      x: offset.left,
      y: offset.top,
      z: elJQ.css("z-index"),
      w: elJQ.outerWidth(),
      h: elJQ.outerHeight(),
      deepFromRoot: deep,
      idxInParent: idx,
      over: ops.over,
      click: ops.click,
      element: el
    });
  };

  var RegionHighlighter = function(parentDom, options){
    this._canvas = document.createElement("canvas");
    this._w = this._canvas.width = $(parentDom).outerWidth(true);
    this._h = this._canvas.height = $(parentDom).outerHeight(true);
    this._canvasContext = this._canvas.getContext("2d");
    this._canvasContext.lineWidth = 5;
    this._canvasContext.strokeStyle = "#33ee22";
    this._highlightIdx = -1;
    this._parentEl = parentDom;
    this._regions = [];

    this._options = {
      over: function(o, e){},
      click: function(o, e){}
    };

    $.extend( this._options, options || {} );

    // var maxZindex = -1;

    // $(parentDom).find('*').filter(function(){
    //   var zIndex = $(this).css("z-index"); 
    //   var getIt = zIndex != 'auto';
    //   if(getIt){
    //     maxZindex = Math.max(parseInt(zIndex), maxZindex);
    //   }
    //   return getIt;
    // });

    this._zIndex = getElementMaxZindex(parentDom);



    // Add attribute: 'rh' to element, it would be auto added.
    var rhAttrs = $(parentDom).find(this._options.querySelector || "[rh]");
    for(var i = 0, len = rhAttrs.length; i < len; i++){
      _addRegion.call(this, rhAttrs[i], this._options);
    }

    $(this._canvas).css({
      position: 'absolute',
      left:0, top: 0,
      zIndex: ++this._zIndex
    });


    $(this._canvas).mousemove((function(scope){
      var rs = scope._regions;
      return function(e){
        // _highlightIdx
        // this._regions
        //console.log("canvas move");
        var found = false;
        for(var i = 0, len = rs.length; i < len; i++) {
          if (e.pageX > rs[i].x && e.pageX < rs[i].x + rs[i].w &&
            e.pageY > rs[i].y && e.pageY < rs[i].y + rs[i].h){
            // find the highlight region
            found = true;
            if(scope._highlightIdx != i){
              // hightlight region changed
              scope._canvasContext.clearRect(0, 0, scope._w, scope._h);

              scope._canvasContext.beginPath();
              scope._canvasContext.rect(rs[i].x, rs[i].y, rs[i].w, rs[i].h);
              scope._canvasContext.stroke();

              scope._highlightIdx = i;
            }
            setTimeout((function(o, event){
              return function(){
                o.over.call(o.element, o, event);
              };
            })(rs[i], e), 0);
            break;
          }                        
        }
        if(!found){
          // cancel the hightlight style
          scope._highlightIdx = -1;
          scope._canvasContext.clearRect(0, 0, scope._w, scope._h);
        }
      }
    })(this));  

    $(this._canvas).click((function(scope){
      return function(e){
        if(~scope._highlightIdx){
          var hoverRegion = scope._regions[scope._highlightIdx];
          //hoverRegion.click.call(hoverRegion.element, hoverRegion, e);
          setTimeout((function(o, event){
            return function(){
              o.click.call(o.element, o, event);
            };
          })(hoverRegion, e), 0);
        }
      }
    })(this));  

    document.body.appendChild(this._canvas);
  };

  RegionHighlighter.prototype.addRegion = function(queryString, options){
    
    var op = $.extend( {}, this._options, options || {} );
    
    var foundEls = $(this._parentEl).find(queryString);

    for(var i = 0, len = foundEls.length; i < len; i++){
      _addRegion.call(this, foundEls[i], op);
    }

    this._regions.sort(function(a, b){
      var az = parseInt(a.z);
      var bz = parseInt(b.z);
      az = isNaN(az)? 0 : az;
      bz = isNaN(bz)? 0 : bz;
      if(a.deepFromRoot != b.deepFromRoot){
        return b.deepFromRoot - a.deepFromRoot;
      }else if(az != bz){
        return bz - az;  
      }else{
        return b.idxInParent - a.idxInParent;
      }
    });
  };

  RegionHighlighter.prototype.onover = function(fn){
    var self = this;
    self._options.over = (typeof fn == 'function')? fn : self._options.over;
    for(var i = 0, len = self._regions.length; i < len; i++){
      self._regions[i].over = self._options.over;
    }
  };

  RegionHighlighter.prototype.onclick = function(fn){
    var self = this;
    self._options.click = (typeof fn == 'function')? fn : self._options.click;
    for(var i = 0, len = self._regions.length; i < len; i++){
      self._regions[i].click = self._options.click;
    }
  };

  win.RegionHighlighter = RegionHighlighter;
  
})(window);

(function(win){

    // var _eventHandler = function(){};
    
    // var _onChange = function(){};

    var _getColorFix = function(n){
      return Math.round(Math.max(Math.min(n, 255), 0));
    };

    var _onMouseDown = function(scope, referDom, changedDom, relateName){
      return function(e){
        var w = $(referDom).width();
        var x = Math.max(Math.min(e.offsetX, w), 0);
        var percent = x / w;
        var v = percent * 255;
        $(changedDom).css("width", (percent * 100) + "%").attr('aria-valuenow', v);
        scope['_isHold' + relateName] = true;
        scope[relateName] = Math.round(v);
        scope._changeHandler(scope.getColor());
      };
    };

    var _onMouseMove = function(scope, referDom, changedDom, relateName){
      return function(e){
        if(scope['_isHold' + relateName]){
          var w = $(referDom).width();
          var x = Math.max(Math.min(e.offsetX, w), 0);
          var percent = x / w;
          var v = percent * 255;
          $(changedDom).css("width", (percent * 100) + "%").attr('aria-valuenow', v);
          scope[relateName] = Math.round(v);
          scope._changeHandler(scope.getColor());
        }
      };
    };

    var _onMouseUp = function(scope, relateName){
      return function(e){
        scope['_isHold' + relateName] = false;
      };
    };

    var ColorEditor = function(opts){
        var self = this;
        self._events = {};
        self._isHold = false;
        // self._el = document.createElement('div');
        self._r = 255;
        self._g = 255;
        self._b = 255;

        var redElText = '<div class="color-editor-box"><div class="color-editor-body" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255" style="background:red;"></div></div>';
        var greenElText = '<div class="color-editor-box"><div class="color-editor-body" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255" style="background:green;"></div></div>';
        var blueElText = '<div class="color-editor-box"><div class="color-editor-body" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255" style="background:blue;"></div></div>';

        // renderTo
        self._options = $.extend({
            //width: 300, height: 30
            height: '100%'
        }, opts || {});

        self._el = $(self._options.renderTo || document.createElement('div'))[0];

        $(self._el).append(redElText, greenElText, blueElText);
        $(self._el).css({
            width: self._options.width,
            height: self._options.height
        });

        self._changeHandler = self._options.changeHandler || function(){};

        var childs = self._el.childNodes;
        self.redEl = childs[0];
        self.greenEl = childs[1];
        self.blueEl = childs[2];

        // if(self._options.renderTo){
        //     $(self._options.renderTo).append(self._el);
        // }
        self.initValues();
        self.hookEvents();
    };

    ColorEditor.prototype._sync = function(){
      var self = this;
      $(self.redEl.childNodes[0]).css("width", (self._r / 255 * 100) + "%").attr('aria-valuenow', self._r);
      $(self.blueEl.childNodes[0]).css("width", (self._g / 255 * 100) + "%").attr('aria-valuenow', self._g);
      $(self.greenEl.childNodes[0]).css("width", (self._b / 255 * 100) + "%").attr('aria-valuenow', self._b);
    };

    ColorEditor.prototype.initValues = function(){
      var self = this;
      self._values = {};
      Object.defineProperty(self._values, "background-color", {
        get:function(){
          return "rgba("+ [self._r, self._g, self._b, 1].join(',') + ")";
        },
        set:function(v){
          var hexReg = new RegExp("#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})");
          var rgbaReg = new RegExp("(rgb|rgba)\\((.*)\\)");
          // var t0 = "#ea4";
          // var t1 = "#ea4188";
          // var t2 = "rgb(123,123,123)";
          // var t3 = "rgba(123,123,123,0.4)";
          if(hexReg.test(v)){
            var matches = v.match(hexReg);
            var hexColor = matches[1];
            if(hexColor.length == 3){
              hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
            }
            self._r = parseInt(hexColor.substr(0, 2), 16);
            self._g = parseInt(hexColor.substr(2, 2), 16);
            self._b = parseInt(hexColor.substr(4, 2), 16);
          }else if(rgbaReg.test(v)){
            var matches = v.match(rgbaReg);
            var type = matches[1];  // rgb rbga
            var colors = matches[2].split(',').map(function(val){return val.trim();});
            self._r = parseInt(colors[0]);
            self._g = parseInt(colors[1]);
            self._b = parseInt(colors[2]);
          }
          $($(self.redEl).children(".color-editor-body"))
            .css("width", (self._r / 255 * 100) + "%")
            .attr('aria-valuenow', self._r);
          $($(self.greenEl).children(".color-editor-body"))
            .css("width", (self._g / 255 * 100) + "%")
            .attr('aria-valuenow', self._g);
          $($(self.blueEl).children(".color-editor-body"))
            .css("width", (self._b / 255 * 100) + "%")
            .attr('aria-valuenow', self._b);
        }
      });
      // this._values['background-color'];
    };

    ColorEditor.prototype.hookEvents = function(){
      var self = this,
        r = self.redEl, rbody = $(r).children(".color-editor-body"),
        g = self.greenEl, gbody = $(g).children(".color-editor-body"),
        b = self.blueEl, bbody = $(b).children(".color-editor-body");

      // red
      r.addEventListener('mousedown', _onMouseDown(self, r, rbody, '_r'));
      r.addEventListener('mousemove', _onMouseMove(self, r, rbody, '_r'));
      r.addEventListener('mouseup', _onMouseUp(self, '_r'));

      // green
      g.addEventListener('mousedown', _onMouseDown(self, g, gbody, '_g'));
      g.addEventListener('mousemove', _onMouseMove(self, g, gbody, '_g'));
      g.addEventListener('mouseup', _onMouseUp(self, '_g'));

      // blue
      b.addEventListener('mousedown', _onMouseDown(self, b, bbody, '_b'));
      b.addEventListener('mousemove', _onMouseMove(self, b, bbody, '_b'));
      b.addEventListener('mouseup', _onMouseUp(self, '_b'));

      // prevent up in other region
      document.body.addEventListener('mouseup', _onMouseUp(self, '_r'));
      document.body.addEventListener('mouseup', _onMouseUp(self, '_g'));
      document.body.addEventListener('mouseup', _onMouseUp(self, '_b'));
    };

    ColorEditor.prototype.onchange = function(fn){
      if(typeof fn == 'function'){
        this._changeHandler = fn;
      }
    };

    ColorEditor.prototype.setColor = function(r, g, b){
      r = _getColorFix(r);
      g = _getColorFix(g);
      b = _getColorFix(b);

      this._r = r;
      this._g = g;
      this._b = b;
      
      this._sync();
      this._changeHandler(this.getColor());
    };

    ColorEditor.prototype.getColor = function(cssColorPrefix){
      // var r = this._r.toString(16);
      // var g = this._g.toString(16);
      // var b = this._b.toString(16);
      // r = r.length < 2 ? "0" + r : r;
      // g = g.length < 2 ? "0" + g : g;
      // b = b.length < 2 ? "0" + b : b;
      // var res = [r,g,b].join('');
      // if(cssColorPrefix) res = '#' + res;
      // console.log(res);
      // return res;
      return "rgba("+ [this._r,this._g,this._b,1].join(',') + ")";
    };

    ColorEditor.prototype.getValue = function(){
      return this._values['background-color'];
      // return this.getColor(true);
    };

    ColorEditor.prototype.setValue = function(k, v){
      this._values[k] = v;
      // if(k == 'background-repeat'){
      // }
    };

    ColorEditor.prototype.syncValueByElement = function(dom){
      var names = ColorEditor.acceptStyleNames;
      var styles = dom.style;
      for(var i in names){
        this.setValue(names[i], styles[names[i]]);
      }
    };

    ColorEditor.acceptStyleNames = ["background-color"];

    win.ColorEditor = ColorEditor;

})(window);



(function(win){

  var _defaults = {
    // width: 'inherit',
    height: '100%',
    uploadText: 'Upload',
    removeText: 'Remove',
    repeatText: 'Repeat',
    noRepeatText: 'No-Repeat',
    inputElement: null,
    inputName: '_im_upload',
    renderTo: null,
    filenameGenFn: function(name){return name;},
    uploadComplete: function(){},
    removeComplete: function(){},
    uploadParams: {},
    removeParams: {},
    url: {}   // create, remove
  };

  var ImageEditor = function(options){
    var self = this;
    self._options = $.extend({}, _defaults, options || {});

    var uploadBtn = '<div class="image-editor-upload"><div class="ie-upload-text">' + self._options.uploadText + '</div></div>';
    var repeatBtn = '<div class="image-editor-repeat"><div class="ie-repeat-text">' + self._options.repeatText + '</div></div>';

    self._el = $(self._options.renderTo || document.createElement('div'))[0];

    $(self._el).append(uploadBtn, repeatBtn);
    $(self._el).css({
        width: self._options.width,
        height: self._options.height
    });

    self._fileEl = self._options.inputElement;

    if(!isDom(self._fileEl, 'input')){
      $(self._el).append('<input style="display:none;" type="file" name="' + self._options.inputName + '"/>');
      self._fileEl = self._el.childNodes[self._el.childNodes.length - 1];
    }

    self._fileEl.setAttribute("accept","image/*");

    self._changeHandler = self._options.changeHandler || function(){};

    var childs = self._el.childNodes;
    self.uploadEl = childs[0];
    self.repeatEl = childs[1];

    self.initValues();
    self.hookEvents();

  };

  ImageEditor.prototype.initValues = function(){
    var self = this;
    self._isRepeat = true;
    self._values = {};
    Object.defineProperty(self._values, "background-repeat", {
      get:function(){ return this._br || 'initial'; },
      set:function(v){
        if(v == 'no-repeat'){
          $(self.repeatEl.childNodes[0]).html(self._options.noRepeatText);
          self._isRepeat = false;
        }else{
          v = 'initial';
          $(self.repeatEl.childNodes[0]).html(self._options.repeatText);
          self._isRepeat = true;
        }
        this._br = v;
      }
    });
    Object.defineProperty(self._values, "background-image", {
      get: function(){ return this._bi || ""; },
      set: function(v){
        var rg = RegExp("url\\((.*)\\)");
        if(v && rg.test(v)){
          var item = v.match(rg)[1];
          this._bi = v;
          self._imageSource = item;
          $(self.uploadEl.childNodes[0]).html(self._options.removeText);
        }else{
          this._bi = '';
          self._imageSource = null;
          $(self.uploadEl.childNodes[0]).html(self._options.uploadText);
        }
      }
    });
    Object.defineProperty(self._values, "background-size", {
      get: function(){ return this._bs || '100% auto'; },
      set: function(v){
        this._bs = v;
      }
    });
  };

  // when uploaded and refresh?
  // delete upload?

  ImageEditor.prototype.hookEvents = function(){
    var self = this;
    self._fileEl.addEventListener('change', (function(scope){
      return function(e){
        var el = e.target;
        if(el.files.length){
          // create
          var f = new FormData();
          var fileBlob = el.files[0];
          var params = scope._options.uploadParams;
          f.append(scope._options.inputName || el.name, fileBlob, 
            scope._options.filenameGenFn.call(scope, fileBlob.name) );
          for(var k in params){
            f.append(k, params[k]); 
          }
          f.append("_im_action", "create");
          // f.append("authenticity_token", $('[name=csrf-token]').attr('content'));
          // f.append("img_url", '');

          // for uploading
          $(scope._el).css('cursor', 'wait');
          $(scope.uploadEl).css('opacity', 0.3);
          $(scope.repeatEl).css('opacity', 0.3);

          $.ajax({
            type: "POST",
            url: scope._options.url.create,
            cache: false,
            contentType: false,
            processData: false,
            data: f,
            success: function(o){
              // self._isUploading = false;
              // alert(JSON.stringify(o));
              //scope._imageSource = ;
              if(o.success){
                scope._options.uploadComplete.call(scope, o);
                if(o['_im_res_url']){
                  //$(scope.uploadEl).addClass('');  
                  scope._values["background-image"] = "url(" + o['_im_res_url'] + ")";
                }
                $(scope._el).css('cursor', '');
                $(scope.uploadEl).css('opacity', 1);
                $(scope.repeatEl).css('opacity', 1);
                scope._changeHandler(scope._imageSource);
              }
            }
            // ,
            // error:function(o, title, content){
            //   console.error(title + ": " + content + "\n Details: " + o.responseText);
            // }
          });
        }
      };
    })(this));

    var uploadTextNode = self.uploadEl.childNodes[0];
    var repeatTextNode = self.repeatEl.childNodes[0];
    uploadTextNode.addEventListener('click', (function(scope){
      return function(e){
        if(scope._imageSource){
          // remove
          // var f = new FormData();
          // var params = scope._options.removeParams;
          // for(var k in params){
          //   f.append(k, params[k]); 
          // }
          // f.append("_im_action", "remove");
          // f.append("_im_source", scope.getSource());

          // // for doing
          // $(scope._el).css('cursor', 'wait');
          // $(scope.uploadEl).css('opacity', 0.3);
          // $(scope.repeatEl).css('opacity', 0.3);

          // $.ajax({
          //   type: "POST",
          //   url: scope._options.url.remove,
          //   cache: false,
          //   contentType: false,
          //   processData: false,
          //   data: f,
          //   success: function(o){
          //     // self._isUploading = false;
          //     // alert(JSON.stringify(o));
          //     // scope._imageSource = "";
          //     if(o.success){
          //       scope._values["background-image"] = "";
          //       scope._options.removeComplete.call(scope, o);
          //       // $(scope.uploadEl.childNodes[0]).html(scope._options.uploadText);
          //       $(scope._el).css('cursor', '');
          //       $(scope.uploadEl).css('opacity', 1);
          //       $(scope.repeatEl).css('opacity', 1);
          //       scope._changeHandler();
          //     }
          //   }



          //   // ,
          //   // error:function(o, title, content){
          //   //   console.error(title + ": " + content + "\n Details: " + o.responseText);
          //   // }
          // });

          scope._values["background-image"] = "";
          // scope._options.removeComplete.call(scope, o);
          // $(scope.uploadEl.childNodes[0]).html(scope._options.uploadText);
          scope._changeHandler();
        }else{
          // create
          scope._fileEl.click();
        }
      };
    })(self));

    repeatTextNode.addEventListener('click', (function(scope){
      return function(e){
        if(scope._isRepeat){
          scope._values["background-repeat"] = "no-repeat";
        }else{
          scope._values["background-repeat"] = "initial";
        }
        scope._changeHandler();
      };
    })(self));

  };

  ImageEditor.prototype.onchange = function(fn){
    if(typeof fn == 'function'){
      this._changeHandler = fn;
    }
  };

  ImageEditor.prototype.getSource = function(){
    return this._imageSource;
  };

  ImageEditor.prototype.getValue = function(name){
    var s = this.getSource();
    var v = "";
    if(s){
      v = this._values[name];
      if(!v){
        v = [this._values['background-image'],this._values['background-repeat']].join(' ');
      }
    }
    return v;
  };

  ImageEditor.prototype.setValue = function(k, v){
    this._values[k] = v;
    // if(k == 'background-repeat'){
    // }
  };

  ImageEditor.prototype.syncValueByElement = function(dom){
    var names = ImageEditor.acceptStyleNames;
    var styles = dom.style;
    for(var i in names){
      this.setValue(names[i], styles[names[i]]);
    }
  };

  ImageEditor.acceptStyleNames = ["background-repeat","background-size","background-image"];

  win.ImageEditor = ImageEditor;
})(window);

(function(win){

    // var _editorId = 0;
    // var _getEditorId = function(dom){
    //     var id = dom.id;
    //     if(!id){
    //         id = "se-gen-" + ++_editorId;
    //         dom.id = id;
    //     }
    //     return id;
    // };

    var _validStyleNames = {
      'background-color': { showName: 'Background Color', mapClass: ColorEditor,
        mapStyleNames: ColorEditor.acceptStyleNames },
      'background-image': { showName: 'Background Image', mapClass: ImageEditor,
        mapStyleNames: ImageEditor.acceptStyleNames, innerOptionKey:'imageUploadOptions'}
    };

    var _checkHasValid = function(attrs){
      for(var i = 0, len = attrs.length; i < len; i++){
        if(_validStyleNames[attrs[i]]) return true;
      }
      return false;
    };

    var _getEditorAttrs = function(dom){
        var attrs = $(dom).attr("se-attr"), attrsInArray;
        if(attrs && (attrsInArray = attrs.split(' ')) && _checkHasValid(attrsInArray)){
            return attrsInArray;
        }
        return false;
    };

    var _generateEditor = function(attrs, target, options){
        var attrsLen = attrs.length;
        // if(attrsLen){
        // }
        var resEl = document.createElement('div');
        // $(resEl).css({
        //     // display: 'none',
        //     // width:'100%',
        //     // height:'100%'
        // });
        var editorsList = [];
        for(var i = 0; i < attrsLen; i++){
          var name = attrs[i];
          if(_validStyleNames[name]){
            var showName = _validStyleNames[name].showName;
            var mapClass = _validStyleNames[name].mapClass;
            var mapStyleNames = _validStyleNames[name].mapStyleNames;
            var mapPropertyKey = _validStyleNames[name].innerOptionKey;
            var elStr = '<div class="style-editor-item">' +
              '<div class="style-editor-label">' + (showName || name) +
              '</div><div class="style-editor-body"></div></div>';
            $(resEl).append(elStr);

            var currentItemEl = $(resEl).children().last();
            var editorContainer = $(currentItemEl).children().eq(1);
            var innerOptions = $.extend({}, {
                renderTo: editorContainer,
                changeHandler: (function(el, cssProperties){
                  return function(){
                    for(var idx = 0, len = cssProperties.length; idx < len; idx++){
                      var k = cssProperties[idx];
                      $(el).css(k, this.getValue(k));
                    }
                  };
                })(target, mapStyleNames)
            });
            var properties = options[mapPropertyKey];
            for(var k in properties){
              innerOptions[k] = properties[k];
            }
            editorsList.push(new mapClass(innerOptions));
          }
        }
        return {
          el: resEl,
          editors: editorsList,
          syncBy: function(referDom){
            var es = this.editors;
            for(var i = 0, len = es.length; i < len; i++){
              es[i].syncValueByElement(referDom);
            }
          }
        };
    };

    var _resizeHandler = function(el, w, h){
      $(el).width(w * 0.4).height(h * 0.4);
      //width: 40%;
      //height: 30%;
    };

    // se-id = 
    // se-attr = 
    var StyleEditor = function(options){
        var self = this;
        
        self._zIndex = getElementMaxZindex();
        self._zIndex++;

        self._isAnimating = false;

        self._editElements = [];

        self._editMap = {};

        // this._canvas = document.createElement("canvas");
        // document.body.appendChild(this._canvas);

        self._options = {
          activeOnClick: true
        };

        options = $.extend(self._options, options || {});

        self._el = options.renderTo? options.renderTo : document.createElement("div");
        $(self._el).addClass("style-editor-main");

        var seAttrs = $(document.body).find("[se-id]").filter("[se-attr]");
        var seLen = seAttrs.length;
        if(seLen){
            // renders
            self._dotEl = document.createElement("div");
            self._transEl = document.createElement("div");
            self._panelEl = document.createElement("div");
            $(self._dotEl).addClass("style-editor-dot");
            $(self._transEl).addClass("style-editor-trans");
            $(self._panelEl).addClass("style-editor-panel");

            $(self._panelEl).append('<div class="se-panel-head"></div><div class="se-panel-body"></div>');
            if(options.activeOnClick){
              // $(self._panelEl).append('<div class="se-panel-button"></div>');
            }
            if(typeof options.submitClick == 'function'){
              $(self._panelEl).append('<div class="se-panel-button"><div class="se-panel-button-body noselect">'+
                  options.submitText || 'Submit' + '</div></div>'); 
              self._submitEl = $(self._panelEl).find(".se-panel-button-body").eq(0);
              $(self._submitEl).click(function(e){
                options.submitClick.call(self, e, self._submitEl);
              });
            }

            self._panelHeadEl = $(self._panelEl).children().eq(0);

            var _movingHandler = (function(scope, t){
              return function(e){
                //console.log("editor move");
                if(scope._isMoving){
                  var mx = e.pageX - scope._curXY.x;
                  var my = e.pageY - scope._curXY.y;
                  var p = $(t).offset();
                  $(t).offset({
                    left: mx,
                    top: my
                  });    
                }
              };
            })(self._panelHeadEl[0], self._panelEl);

            var _upHandler = (function(scope){
              return function(e){
                scope._isMoving = false;
                scope._curXY = null;  
                $(document.body).off('mousemove', _movingHandler);
                $(document.body).off('mouseup', _upHandler);
              };
            })(self._panelHeadEl[0]);

            self._panelHeadEl.on('mousedown',function(e){
              this._isMoving = true;
              this._curXY = { x:e.offsetX, y: e.offsetY };
              $(document.body).on('mousemove', _movingHandler);
              $(document.body).on('mouseup', _upHandler);
            });

            self._panelBodyEl = $(self._panelEl).children().eq(1);

            for(var i = 0; i < seLen; i++){
                var el = seAttrs[i];
                var id = $(el).attr("se-id"); 
                var attrs = _getEditorAttrs(el);
                if(!attrs) continue;
                var editor = _generateEditor(attrs, el, options);
                self._editElements.push({
                    id: id,
                    attrs: attrs,
                    targetEl: el,
                    editor: editor
                });
                self._editMap[id] = editor;

                $(editor.el).attr("se-map-id", id);
                $(self._panelBodyEl).append(editor.el);
            }
            if(self._editElements.length > 0){
              $(self._el).append(self._dotEl, self._transEl, self._panelEl);
              $(window).on('resize', (function(scope, fn){
                return function(){
                  fn(scope, $(window).width(), $(window).height());
                };
              })(self._panelEl, _resizeHandler));
            }
        }

        $(self._el).css({
            zIndex: self._zIndex
        });
        $("body").append(self._el);
        self._autoSync();
    };

    StyleEditor.prototype._autoSync = function(){
      var self = this;
      for(var i = 0, len = self._editElements.length; i < len; i++){
        var item = self._editElements[i];
        item.editor.syncBy(item.targetEl);
      }
    };

    StyleEditor.prototype.add = function(element){

    };

    StyleEditor.prototype.hide = function(){
        // if(!this._isAnimating){
        //     this._isAnimating = true;
        // }
        $(this._panelEl).hide();
    };

    StyleEditor.prototype.show = function(){
        // if(!this._isAnimating){
        //     this._isAnimating = true;
        // }
        $(this._panelEl).show();
        _resizeHandler(this._panelEl, $(window).width(), $(window).height());
    };

    StyleEditor.prototype.setActive = function(id){
      if(typeof id == 'string'){
        var head = this._panelEl.firstChild;
        $(this._panelEl).find("[se-map-id]").each(function(idx, el){
          if($(el).attr("se-map-id") == id){
            $(head).text(id);
            $(el).show();
          }
          else $(el).hide();
        });
      }else if(typeof id == "number" && this._editElements.length){
        this.setActive(this._editElements[id].id);
      }
    };

    StyleEditor.prototype.getStyle = function(id){

    };

    // [
    //   {
    //     id: xxx,
    //     def: 
    //   }
    // ]

    StyleEditor.prototype.getAllStyle = function(){
      var self = this;
      var eds = self._editElements;
      var res = [];
      for(var i = 0, len = eds.length; i < len; i++){
        // res.push(eds[i].editor.)
      }
    };

    // StyleEditor.prototype.syncAllBy = function(element){
    //   element = element || document.body;
    //   $(element).find("[se-id]").each(function(){
    //     var id = $(this).attr("se-id");

    //   });
    // };

    win.StyleEditor = StyleEditor;
})(window);



