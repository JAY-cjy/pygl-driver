var vm = new Vue({
    el: '#journeyDetails',
    data: {
        date: '',
        details: '',
        carType: 'package',
        package: [],
        join: [],
        present: [],
    },
    mounted() {
        var url = location.search;
        var date = url.split('=')[1];
        this.date = date;
        console.log(url, this.date)

        this.getDetails('day', date)
    },
    methods: {
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
                    console.log(res)
                    that.details = res;

                    for (let index = 0; index < that.details.length; index++) {
                        if (that.details[index].baotype == '0') {
                            that.package.push(that.details[index]);
                        } else if (that.details[index].baotype == '2') {
                            that.join.push(that.details[index]);
                        } else {
                            that.present.push(that.details[index]);
                        }
                    }
                    console.log(that.package, that.join, that.present)

                    // 判断第一个行程类型
                    if (that.details[0].baotype == '0') {
                        value = 'package';
                    } else if (that.details[0].baotype == '1') {
                        value = 'present';
                    } else {
                        value = 'join';
                    }
                    that.carType = value;
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },
        // 改变日期显示类型
        changeCarType: function (e) {
            // console.log(e.target.dataset.datetype)
            var carType = e.target.dataset.datetype;
            this.carType = carType;
        },
    },

})

console.log(vm.date)