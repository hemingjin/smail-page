Vue.config.devtools = true;
Vue.config.debug = true;
Vue.prototype.$http = axios;
Vue.component("input-component", {
  template: "#inputComponent",
  props: {
    source: {
      type: Array,
      default: []
    },
    placeholder: {
        type: String,
    }
  },
  data() {
    return {
      isfocus: false,
      text: "",
      tagArray: [],
      offsetTop: '',      //搜索框的偏移
      offsetLeft: '',
      showSearch: false,  //是否展示搜索
      searchList: [],  //实时搜索结果展示
    };
  },
  created() {
    this.initSource(this.source);
  },
  mounted() {
      
  },
  methods: {
    //初始化数据
    initSource(data) {
      data.forEach(item => {
        this.tagArray.push({
          name: item.name,
          isSelected: false
        });
      });
    },
    //添加
    addEmail(text) {
      if (text) {
        if (!this.isEmail(text)) {
          this.source.push({ name: text });
          this.tagArray.push({ name: text, isError: true, isSelected: false });
        } else {
          this.source.push({ name: text });
          this.tagArray.push({ name: text, isError: false, isSelected: false });
        }
      }
      this.text = "";
      this.showSearch = false;
    },
    //选中
    selectTag(index) {
      this.tagArray[index].isSelected = !this.tagArray[index].isSelected;
      this.selectAndDelte();
    },
    //选中后删除
    selectAndDelte() {
      var self = this;
      document.addEventListener("keydown", function(event) {
        if (event.keyCode == 46 || event.keyCode == 8) {
          self.tagArray.filter((item, index) => {
            if (item.isSelected) {
              self.deleteTag(index);
            }
          });
        }
      });
    },
    //删除
    deleteTag(index) {
      if (index >= 0 && !this.text) {
        this.tagArray.splice(index, 1);
        this.source.splice(index, 1);
      }
    },
    //获得焦点
    focus() {
      if (this.tagArray.length > 0) {
        this.tagArray.filter(item => {
          item.isSelected = false;
        });
      }
      this.isfocus = true;
    },
    //失去焦点
    blur() {
      console.log('触发失焦事件')
      if (this.text) {
        this.addEmail(this.text);
      }
    
      this.isfocus = false;
    },
    //设置搜索框的偏移
    setSearchOffset() {
        var inputBounds = this.$refs.inputTag.getBoundingClientRect();
        this.offsetTop = inputBounds.height + inputBounds.top + 'px';
        this.offsetLeft = inputBounds.left + 'px';
    },
    //input onchange事件
    inputChange(text) {
        console.log('搜索关键词:', text)
        this.setSearchOffset();
        this.$http.get('data/email.json').then( (res) => {
            this.searchList = res.data.data;
            for(var i = 0; i < res.data.length; i++){

            }
        }).catch( (err) => {
            console.log(err);
        });
    },
    //邮箱格式验证
    isEmail(str) {
      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      return reg.test(str);
    },
  },
  watch: {
        text() {
            if(this.text !== ''){
                this.showSearch = true;
                this.inputChange(this.text);
            }else{
                this.showSearch = false;
            }
        }
    }
});

var app = new Vue({
  el: "#inputSection",
  data() {
    return {
        placeholder1: "请输入收件人邮箱地址",
        placeholder2: "请输入抄送邮箱地址",
        placeholder3: "请输入密送邮箱地址",
      source: [
            
        ]
    };
  }
});
