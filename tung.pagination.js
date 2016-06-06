/**
 * Created by Tung on 6/6/2016.
 */
!(function(window){
    function TungPagination(id, options){
        var _this = this;
        var defaults = {
            _type: "simple",
            pageSum: 1,
            curPage: 1,
            baseUrl: "",
            showWidth: 5
        };
        _this.options = $.extend(false, defaults, options);
        _this.ele = $(id);
        _this.curPage = +_this.options.curPage;
        _this.pageSum = +_this.options.pageSum;
        _this.baseUrl = _this.options.baseUrl;
        if ("function" == typeof _this.options.toPage)
            TungPagination.prototype.toPage = _this.options.toPage;

        _this._create(_this.options._type);
        _this.ele.on("click","span",function(e){
            var $this = $(this);
            var toPage = $this.attr('data-page');
            if (toPage && !$this.hasClass("disable")) {
                _this.clear();
                _this.curPage = +toPage;
                _this._create(_this.options._type);
                _this.toPage(toPage, _this.baseUrl);
            }
        });
        return _this;
    }

    TungPagination.prototype = {
        /* 根据_type生成html标签 */
        _create:function(_type) {
            _type = _type ? _type : "simple";
            switch(_type) {
                case "simple":this.genSimple(this.ele);break;
                case "normal":this.genNormal(this.ele);break;
                case "full":this.genFull(this.ele);break;
                default:this.genSimple(this.ele);
            }

        },
        toPage:function(toPage, baseUrl ) {
            alert("toPage:"+toPage+"\nbaseUrl:"+baseUrl);
        },
        genSimple: function(el) {
            (this.curPage > 1) && el.prepend($("<span>").html("上一页").attr("data-page",this.curPage-1));
            el.append($("<span>"+this.curPage + " / " + this.pageSum+"</span>"));
            (this.curPage != this.pageSum) && el.append($("<span>").html("下一页").attr("data-page",this.curPage+1));
            el.addClass("pagination s_pagination");
        },
        genNormal: function(el) {
            var _side_width = Math.floor(this.options.showWidth/2);  //当前页左右两边最多显示页码的个数

            var isLeftOmit,isRightOmit;
            isLeftOmit = this.curPage>_side_width+2 ? true: false;  //当前页码左边是否有省略号
            isRightOmit = this.curPage+_side_width+1 < this.pageSum ? true: false; //当前页码右边是否有省略号

            /************ generate HTML *************/
            /* left */
            $('<span class="prevPage">上一页</span>').attr("data-page",this.curPage-1).appendTo(el);
            if(this.curPage != 1)
                $('<span class="pageNum">1</span>').attr("data-page",1).appendTo(el);
            else
                el.find(".prevPage").addClass("disable");

            if (isLeftOmit) {
                $('<span>...</span>').appendTo(el);
                for (var i = _side_width; i > 0; i--) {
                    $('<span class="pageNum">'+(this.curPage-i)+'</span>').attr("data-page",this.curPage-i).appendTo(el);
                }
            } else {
                for (var i = _side_width; i > 0; i--) {
                    if(this.curPage-i <= 1) continue;
                    $('<span class="pageNum">'+(this.curPage-i)+'</span>').attr("data-page",this.curPage-i).appendTo(el);
                }
            }

            /* current */
            $('<span class="current">'+this.curPage+'</span>').appendTo(el);


            /* right */
            if (isRightOmit) {
                for (var i = 1; i <= _side_width; i++) {
                    $('<span class="pageNum">'+(this.curPage+i)+'</span>').attr("data-page",+this.curPage+i).appendTo(el);
                }
                $('<span>...</span>').appendTo(el);
                $('<span class="pageNum">'+this.pageSum+'</span>').attr("data-page",this.pageSum).appendTo(el);
            } else {
                for (var i = 1; i <= _side_width+1; i++) {
                    if(this.curPage+i > this.pageSum) break;
                    $('<span class="pageNum">'+(this.curPage+i)+'</span>').attr("data-page",this.curPage+i).appendTo(el);
                }
            }
            $('<span class="nextPage">下一页</span>').attr("data-page",this.curPage+1).appendTo(el);
            if(this.curPage == this.pageSum)
                el.find('.nextPage').addClass('disable');

            el.addClass("pagination n_pagination");
        },
        genFull: function(el)  {
            var _side_width = Math.floor(this.options.showWidth/2);  //当前页左右两边最多显示页码的个数

            var isLeftOmit,isRightOmit;
            isLeftOmit = this.curPage>_side_width+1 ? true: false;  //当前页码左边是否有省略/ 不是从1开始
            isRightOmit = this.curPage+_side_width+1 < this.pageSum ? true: false; //当前页码右边是否有省略

            var leftMax = this.options.showWidth > this.pageSum?1:this.pageSum-this.options.showWidth+1;

            /* prev part */
            $('<span class="firstPage">首页</span>').attr("data-page",1).appendTo(el);
            $('<span class="prevPage">上一页</span>').attr("data-page",this.curPage-1).appendTo(el);
            if(this.curPage == 1) {
                el.find(".firstPage").addClass("disable");
                el.find(".prevPage").addClass("disable");
            }

            /* num part */
            //获取真实显示区长度，总页码小于showWidth的时候，长度修正为总页码数。
            var len = this.pageSum>this.options.showWidth?this.options.showWidth:this.pageSum;
            //预计左边起始页码
            var _left = this.curPage - Math.floor((len-1)/2);
            //预计右边结束页码
            var _right = this.curPage + Math.floor(len/2);
            //计算偏移值，如果左边起始页码小于1，则需要偏移。
            var interval = _left<1?1-_left:0;
            //如果左边不需要偏移，才检查右边是否需要偏移。
            if(!interval) interval=this.pageSum<_right?this.pageSum-_right:0;

            //取得真实的起始页码和结束页码
            _left += interval;
            _right += interval;

            for(var i = 0; i<len; i++){
                var pageNum = _left+i;
                if(pageNum == this.curPage)
                    $('<span class="current">').html(pageNum).appendTo(el);
                else
                    $('<span class="pageNum">').html(pageNum).attr("data-page",pageNum).appendTo(el);
            }

            /* next part */
            $('<span class="nextPage">下一页</span>').attr("data-page",this.curPage+1).appendTo(el);
            $('<span class="lastPage">末页</span>').attr("data-page",this.pageSum).appendTo(el);
            $('<input type="text" name="jumpPage"/>').val(this.curPage).appendTo(el);
            var _this = this;
            $('<span>GO</span>').appendTo(el).on("click",function(){
                var $this = $(this);
                var toNum = el.find("input[name=jumpPage]").val();
                if (isNaN(toNum)) {
                    el.find("input[name=jumpPage]").val(_this.curPage);
                    return false;
                }
                if(toNum < 1) toNum = 1;
                if(toNum > _this.pageSum) toNum = _this.pageSum;
                console.log(toNum);
                if(toNum != _this.curPage) {
                    _this.clear();

                    _this.curPage = +toNum;
                    _this._create(_this.options._type);
                    _this.toPage(toNum, _this.baseUrl);
                }
            });
            if(this.curPage == this.pageSum){
                el.find(".lastPage").addClass("disable");
                el.find('.nextPage').addClass('disable');
            }

            el.addClass("pagination f_pagination");
        },
        clear: function() {
            this.ele.empty();
        }
    };

    window.TungPagination = TungPagination;
}(window));
