var vm = new Vue({
    el: '#journey',
    data: {
        details: '',
        details2: '',
        nowDate: '',
        value1: '',
        showDate: 'day',
        weekArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        mark: {},
        temp: 'true',
    },

    mounted() {
        //获取当前时间
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        this.nowDate = nowDate;



        // 获取天行程
        this.getDetails('day', this.nowDate);
        // 以月份获取数据再渲染日历
        this.getDetails2('month', this.nowDate);

    },

    methods: {
        // 初始化日历插件
        initDeta: function () {
            var that = this;
            // that.getDetails2('month', value);

            //执行一个laydate实例 自定义重要日
            var date = laydate.render({
                elem: '#date',
                calendar: true, // 农历
                showBottom: false, // 底部控件
                mark: {
                    // '2017-8-15': '', //如果为空字符，则默认显示数字+徽章
                },
                done: function (value, date) {
                    console.log(this.mark, value, date);
                    that.getDetails('day', value);
                    that.showDate = 'day';
                    // if (date.year === 2017 && date.month === 8 && date.date === 15) { //点击2017年8月15日，弹出提示语
                    //     alert('这一天是：中国人民抗日战争胜利72周年');
                    // }
                },
                change: function (value, endDate) {
                    // 判断是切换到上个月还是下个月
                    // date.config.mark["2019-7-1"] = '接机';
                    // console.log(date.config.mark);
                    that.temp = true;
                    that.layDate = value;
                    that.getDetails('month', value);

                },
            });

            // 获取上下两个月的行程
            console.log(that.nowDate);
            if (that.temp) {
                if (that.layDate) {
                    var month = that.layDate.substring(5, 7);
                } else {
                    var month = that.nowDate.substring(5, 7);
                }
                let lastDate = parseInt(month) - 1 + '';
                let nextDate = parseInt(month) + 1 + '';
                console.log(lastDate, nextDate);
                console.log(lastDate.substring(0, 1))
                if (lastDate.substring(0, 1) != '0') {
                    lastDate = that.nowDate.substring(0, 4) + '-0' + lastDate + '-' + '01';
                } else {
                    lastDate = that.nowDate.substring(0, 4) + '-' + lastDate + '-' + '01';
                }

                if (nextDate.substring(0, 1) != '0') {
                    nextDate = that.nowDate.substring(0, 4) + '-0' + nextDate + '-' + '01';
                } else {
                    nextDate = that.nowDate.substring(0, 4) + '-' + nextDate + '-' + '01';
                }
                console.log(lastDate, nextDate);
                that.getDetails2('month', lastDate);
                that.getDetails2('month', nextDate);
                that.temp = false;
            }

            console.log(that.mark)
            date.config.mark = that.mark;
            console.log(date.config.mark)
            console.log('重绘layui')

            // if(){

            // }

        },
        // 获取页面初始数据
        getDetails: function (str, date) {
            var that = this;
            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busOrder/querySpecifiedData.action",
                data: {
                    currentDay: date,
                    conditions: str,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log('details:', res)
                    that.details = res;

                    // 月的情况下，执行layui
                    if (str == 'month') {
                        // 获取行程转layui的mark数据
                        let date2 = '';
                        let value = '';
                        let mark = {};
                        for (let index = 0; index < that.details.length; index++) {
                            let month = that.details[index].date.substring(5, 7);
                            let day = that.details[index].date.substring(8);

                            if (month.substring(0, 1) == '0') {
                                month = month[1]
                            }

                            if (day.substring(0, 1) == '0') {
                                day = day[1]
                            }

                            date2 = that.details[index].date.substring(0, 4) + '-' + month + '-' + day;
                            console.log(date2)

                            if (that.details[index].baotype == '0') {
                                value = '包车';
                            } else if (that.details[index].baotype == '1') {
                                value = '送机';
                            } else {
                                value = '接机';
                            }

                            // 判断包车，送机等情况是否同时存在
                            if (that.mark[date2] != value && that.mark[date2]) {
                                console.log(that.mark[date2], value)
                                if (that.mark[date2].substring(0, 2) != value && that.mark[date2].length < 2) {
                                    that.mark[date2] = that.mark[date2] + ' ' + value;
                                } else if(that.mark[date2].substring(0, 2) != value && that.mark[date2].substring(3, 5) != value && that.mark[date2].length < 5)  {
                                    that.mark[date2] = that.mark[date2] + ' ' + value;
                                }
                                console.log(that.mark[date2])
                                console.log((that.mark[date2].substring(0, 2) != value), (that.mark[date2].substring(3, 5) != value))
                            } else {
                                that.mark[date2] = value;
                            }

                        }
                        // that.mark = mark;
                        console.log(mark)

                        that.initDeta();
                    }
                    that.showDate = str;
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },
        // 获取layui初始数据
        getDetails2: function (str, date) {
            var that = this;
            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busOrder/querySpecifiedData.action",
                data: {
                    currentDay: date,
                    conditions: str,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)
                    that.details2 = res;

                    // 月的情况下，执行layui
                    if (str == 'month') {
                        // 获取行程转layui的mark数据
                        let details = that.details2;
                        let date2 = '';
                        let value = '';
                        // let mark = {};
                        for (let index = 0; index < details.length; index++) {
                            let month = details[index].date.substring(5, 7);
                            let day = details[index].date.substring(8);

                            if (month.substring(0, 1) == '0') {
                                month = month[1]
                            }

                            if (day.substring(0, 1) == '0') {
                                day = day[1]
                            }

                            date2 = details[index].date.substring(0, 4) + '-' + month + '-' + day;
                            // console.log(date2)

                            if (details[index].baotype == '0') {
                                value = '包车';
                            } else if (details[index].baotype == '1') {
                                value = '送机';
                            } else {
                                value = '接机';
                            }

                            // 判断包车，送机等情况是否同时存在
                            if (that.mark[date2] != value && that.mark[date2]) {
                                console.log(that.mark[date2], value)
                                if (that.mark[date2].substring(0, 2) != value && that.mark[date2].length < 2) {
                                    that.mark[date2] = that.mark[date2] + ' ' + value;
                                } else if(that.mark[date2].substring(0, 2) != value && that.mark[date2].substring(3, 5) != value && that.mark[date2].length < 5)  {
                                    that.mark[date2] = that.mark[date2] + ' ' + value;
                                }
                                console.log(that.mark[date2])
                                console.log((that.mark[date2].substring(0, 2) != value), (that.mark[date2].substring(3, 5) != value))
                            } else {
                                that.mark[date2] = value;
                            }
                        }
                        // that.mark = mark;
                        console.log(that.mark)

                        that.initDeta();
                    }
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },
        // 改变日期显示类型
        changeDateType: function (e) {
            // console.log(e.target.dataset.datetype)
            var showDate = e.target.dataset.datetype;
            // this.showDate = showDate;
            this.getDetails(showDate, this.nowDate);
        },
        // 重新挂载日历
        again: function (e) {

        },
        // 页面跳转
        goToDetails: function (e) {
            console.log(e)
            window.location.href = "../journeyDetails/index.html?date=" + e;
        },
    },
})

// $(document).ready(function () {
// })
$(function () {})