

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
        console.log("canvas move");
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
        self.hookEvents();
    };

    ColorEditor.prototype._sync = function(){
      var self = this;
      $(self.redEl.childNodes[0]).css("width", (self._r / 255 * 100) + "%").attr('aria-valuenow', self._r);
      $(self.blueEl.childNodes[0]).css("width", (self._g / 255 * 100) + "%").attr('aria-valuenow', self._g);
      $(self.greenEl.childNodes[0]).css("width", (self._b / 255 * 100) + "%").attr('aria-valuenow', self._b);
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
      return this.getColor(true);
    };

    win.ColorEditor = ColorEditor;

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
      'background-color': { showName: 'Background Color', mapClass: 'ColorEditor' }
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

    var _generateEditor = function(attrs, target){
        var attrsLen = attrs.length;
        // if(attrsLen){
        // }
        var resEl = document.createElement('div');
        // $(resEl).css({
        //     // display: 'none',
        //     // width:'100%',
        //     // height:'100%'
        // });

        for(var i = 0; i < attrsLen; i++){
          var name = attrs[i];
          if(_validStyleNames[name]){
            var showName = _validStyleNames[name].showName;
            var mapClass = _validStyleNames[name].mapClass;
            var elStr = '<div class="style-editor-item">' +
              '<div class="style-editor-label">' + (showName || name) +
              '</div><div class="style-editor-body"></div></div>';
            $(resEl).append(elStr);

            var currentItemEl = $(resEl).children().last();
            var editorContainer = $(currentItemEl).children().eq(1);
            var ed = new win[mapClass]({
                renderTo: editorContainer,
                changeHandler: (function(el, cssProperty){
                  return function(hex){
                    $(el).css(cssProperty, this.getValue());
                  };
                })(target, name)
            });
          }
        }
        return {
          el: resEl
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
                console.log("editor move");
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
                var editor = _generateEditor(attrs, el);
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

    win.StyleEditor = StyleEditor;
})(window);



