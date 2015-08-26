

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

    win.getElementDepth = _getDepth;
    win.getElementIndexOfParent = _getIdx;
    win.getElementMaxZindex = _getMaxZindex;

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
    var rhAttrs = $(parentDom).find("[rh]");
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

    var ColorEditor = function(opts){
        this._events = {};
        this._el = document.createElement('div');

        var redEl = '<div class="color-editor-box"><div class="color-editor-red" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255"></div></div>';
        var greenEl = '<div class="color-editor-box"><div class="color-editor-green" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255"></div></div>';
        var blueEl = '<div class="color-editor-box"><div class="color-editor-blue" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="255"></div></div>';

        // renderTo
        this._options = $.extend({
            width: 300, height: 50
        }, opts || {});

        $(this._el).append(redEl, greenEl, blueEl);
        $(this._el).css({
            width: this._options.width,
            height: this._options.height
        });

        if(this._options.renderTo){
            $(renderTo).append(this._el);
        }
        
    };

    ColorEditor.prototype.on = function(eventName, fn){
        if(typeof fn == 'function'){
            this._events[eventName] = fn;
        }
    };

    win.ColorEditor = ColorEditor;

})(window);

(function(win){

    var _editorId = 0;
    var _getEditorId = function(dom){
        var id = dom.id;
        if(!id){
            id = "se-gen-" + ++_editorId;
            dom.id = id;
        }
        return id;
    };

    var _getEditorAttrs = function(dom){
        var attrs = $(dom).attr("se-attr");
        if(attrs){
            return attrs.split(' ');
        }
        return [];
    };

    var _generateEditor = function(attrs){
        var attrsLen = attrs.length;
        // if(attrsLen){
        // }
        var resEl = document.createElement('div');
        $(resEl).css({
            display: 'none',
            width:'100%',
            height:'100%'
        });
        var ce = new ColorEditor(resEl);
        return resEl;
    };

    // se-id = 
    // se-attr = 
    var StyleEditor = function(options){
        options = options || {};
        var self = this;
        self._url = options.url || "";
        self._zIndex = getElementMaxZindex();
        self._zIndex++;

        self._isAnimating = false;

        self._editElements = [];

        self._editMap = {};

        // this._canvas = document.createElement("canvas");
        // document.body.appendChild(this._canvas);

        this._options = {
          activeOnClick: true
        };

        $.extend(this._options, options);

        self._el = document.createElement("div");
        $(self._el).addClass("style-editor-main");

        var seAttrs = $(document.body).find("[se-attr]");
        var seLen = seAttrs.length;
        if(seLen){
            // renders
            self._dotEl = document.createElement("div");
            self._transEl = document.createElement("div");
            self._panelEl = document.createElement("div");
            $(self._dotEl).addClass("style-editor-dot");
            $(self._transEl).addClass("style-editor-trans");
            $(self._panelEl).addClass("style-editor-panel");

            for(var i = 0; i < seLen; i++){
                var el = seAttrs[i];
                var id = _getEditorId(el); 
                var attrs = _getEditorAttrs(el);
                var editEl = _generateEditor(attrs);
                self._editElements.push({
                    id: id,
                    attrs: attrs,
                    targetEl: el,
                    editEl: editEl
                });
                self._editMap[id] = editEl;

                $(self._panelEl).append(editEl);
            }
            $(self._el).append(self._dotEl, self._transEl, self._panelEl);
        }

        $(self._el).css({
            zIndex: self._zIndex
        });
        $("body").append(self._el);

    };

    StyleEditor.prototype.add = function(element){

    };

    StyleEditor.prototype.hide = function(){
        if(!this._isAnimating){
            this._isAnimating = true;
        }
    };

    StyleEditor.prototype.show = function(){
        if(!this._isAnimating){
            this._isAnimating = true;
        }
    };

    StyleEditor.prototype.setActive = function(id){

    };

    win.StyleEditor = StyleEditor;
})(window);



