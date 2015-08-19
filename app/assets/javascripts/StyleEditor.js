

(function(win){

  var _getDeep = function(endParent, current){
    var n = 0;
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

  var _getIdx = function(el){
    var n = -1;
    if(el.parentElement){
      var p = el.parentElement;
      var childs = p.childNodes;
      for(var i = 0, len = childs.length; i < len; i++){
        if(childs[i] == el) return i;
      }
    }
    return n;
  };

  var _addRegion = function(el, ops){
    var elJQ = $(el);
    var offset = elJQ.offset();
    var deep = _getDeep(this._parentEl, el);
    var idx = _getIdx(el);
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
    this._canvasContext.strokeStyle = "#ffcc00";
    this._highlightIdx = -1;
    this._parentEl = parentDom;
    this._regions = [];

    this._options = {
      over: function(o, e){},
      click: function(o, e){}
    };

    $.extend( this._options, options || {} );

    var maxZindex = -1;

    $(parentDom).find('*').filter(function(){
      var zIndex = $(this).css("z-index"); 
      var getIt = zIndex != 'auto';
      if(getIt){
        maxZindex = Math.max(parseInt(zIndex), maxZindex);
      }
      return getIt;
    });

    // Add attribute: 'rh' to element, it would be auto added.
    var rhAttrs = $(parentDom).find("[rh]");
    for(var i = 0, len = rhAttrs.length; i < len; i++){
      _addRegion.call(this, rhAttrs[i], this._options);
    }

    $(this._canvas).css({
      position: 'absolute',
      left:0,top:0,
      zIndex: ++maxZindex
    });

    this._zIndex = maxZindex;

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

