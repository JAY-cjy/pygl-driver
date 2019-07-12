var vm = new Vue({
    el: '#billList',
    data: {
        // 订单数据
        billDdetails: '',
        // 是否有新订单
        billText: '',
    },

    mounted() {
        // 获取订单列表
        this.getBillList();

        // ajax 轮询
        var oDay = new Date();
        var year = oDay.getFullYear();
        var month = (oDay.getMonth() + 1) < 10 ? "0" + (oDay.getMonth() + 1) : (oDay.getMonth() + 1);
        var day = oDay.getDate() < 10 ? "0" + oDay.getDate() : oDay.getDate();
        var hours = oDay.getHours() < 10 ? "0" + oDay.getHours() : oDay.getHours();
        var minutes = oDay.getMinutes() < 10 ? "0" + oDay.getMinutes() : oDay.getMinutes();
        var seconds = oDay.getSeconds() < 10 ? "0" + oDay.getSeconds() : oDay.getSeconds();
        var refreshTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        console.log(refreshTime);
        var that = this;

        var inter = window.setInterval(function () {
            $.ajax({
                type: "POST", //方法类型
                dataType: "json", //预期服务器返回的数据类型
                url: "http://192.168.0.152:8080/pyerp/busOrder/newOrderEnquiry.action", //url
                data: {
                    "refreshTime": refreshTime
                },
                success: function (res) {
                    console.log(res);

                    that.billText = '有新订单，请下拉刷新';

                    if (res.status == 1) {
                        alert(res.msg);
                        that.billText = res.msg
                    } else if (res.status == 500) {
                        alert(res.msg);
                        that.billText = res.msg
                    }

                }
            });
        }, 5000);

        // 下拉刷新订单数据
        var _sroll = document.querySelector('#billList');
        var outscroll = document.querySelector('main');
        var _star = 0;
        //获取手指最初的位置,添加一个触摸开始的监听事件
        _sroll.addEventListener('touchstart', function (event) {
            //获取手指数组中的第一个（可以用targetTouches）
            var _touch = event.touches[0];
            //获取滑动时手指的y坐标+
            _star = _touch.pageY;
        }, false);

        //获取滑动的距离，添加一个触摸滑动的监听事件
        _sroll.addEventListener('touchmove', function (event) {
            //获取手指数组中的第一个（可以用targetTouches）
            var _touch = event.touches[0];
            outscroll.style.top = outscroll.offsetTop + _touch.pageY - _star + 'px';
            //获取滑动后手指的y坐标
            _star = _touch.pageY;
            //获取下拉元素的top值
            var top = outscroll.offsetTop;
            //如果大于40就刷新
            if (top > 27) {
                that.billText = '放开刷新';
            }

        }, false);

        //添加屏幕触摸接触结束的事件
        _sroll.addEventListener('touchend', function (event) {
            //初始化手指触摸的y坐标
            _star = 0;
            //获取下拉元素的top值
            var top = outscroll.offsetTop;
            console.log(top)
            //如果大于40就刷新
            if (top > 27) {
                //循环慢慢的收缩
                var time = setInterval(function () {
                    outscroll.style.top = outscroll.offsetTop - 2 + 'px';
                    //如果top等于原始值，停止收缩
                    // 因为文本需要消失（20px）
                    if (outscroll.offsetTop <= -20) {
                        clearInterval(time);
                        that.billText = '';
                        outscroll.style.top = 0 + 'px';
                        //刷新订单数据
                        that.getBillList();
                    }
                }, 1);

            }
        }, false);
    },

    methods: {
        // 获取订单列表
        getBillList() {
            var that = this;
            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busOrder/battleForOrder.action",
                data: {},
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)
                    that.billDdetails = res.msg;
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },

        // 点击抢单
        robBill(e) {
            console.log(e)

            var that = this;
            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busOrder/grabSingle.action",
                data: {
                    id: e,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },
    },
})