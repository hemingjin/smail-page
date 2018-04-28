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
      type: String
    }
  },
  data() {
    return {
      isfocus: false,
      text: "",
      tagArray: [],
      searchStyle: {
        //搜索框的偏移
        top: "",
        left: "",
        width: ""
      },
      showSearch: false, //是否展示搜索
      searchList: [], //实时搜索结果展示
      activeIndex: -1,
      selectedResult: ""
    };
  },
  created() {
    this.initSource(this.source);
  },
  mounted() {
    var self = this;
    document.addEventListener("click", function(e) {
      if (e.target !== self.$refs.inputTag) {
        self.showSearch = false;
        self.activeIndex = -1;
      }
    });
  },
  methods: {
    //初始化数据
    initSource(data) {
      data.forEach(item => {
        if (!this.isEmail(item.email)) {
          this.tagArray.push({
            email: item.email,
            isError: true,
            isSelected: false
          });
        } else {
          this.tagArray.push({
            email: item.email,
            isError: false,
            isSelected: false
          });
        }
      });
    },
    //添加
    addEmail(text) {
      //this.setScroll();
      if (text) {
        this.source.push({ email: text });
      }
      this.$refs.inputTag.value = "";
      this.text = "";
      this.showSearch = false;
    },
    // 搜索框，空格键选中添加
    spaceAddEmail() {
      if (this.activeIndex != -1) {
        this.addEmail(this.selectedResult);
        this.activeIndex = -1;
      } else {
        this.addEmail(this.text);
      }
    },
    // 搜索框，回车键选中添加
    enterAddEmail() {
      if (this.activeIndex != -1) {
        this.addEmail(this.selectedResult);
        this.activeIndex = -1;
      } else {
        this.addEmail(this.text);
      }
    },
    //搜索框，点击选中添加
    clickAddEmail(email) {
      this.$refs.inputTag.focus();
      this.addEmail(email);
    },
    //监听搜索列表hover
    handleHover(index) {
      this.activeIndex = index;
      this.selectedResult = this.searchList[this.activeIndex].email;
    },
    //设置滚动条滚到最下方
    setScroll() {
      var inputWrap = this.$refs.inputTagWrap;
      console.log(
        inputWrap.offsetHeight,
        inputWrap.scrollTop,
        inputWrap.scrollHeight
      );
      inputWrap.scrollTop = inputWrap.scrollHeight;
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
    //双击编辑
    doubleSelect(email, index) {
      console.log(email)
      this.deleteTag(index);
      this.text = email;
    },
    //删除
    deleteTag(index) {
      if (index >= 0 && !this.text) {
        this.source.splice(index, 1);
      }
    },
    //上下键选择
    upAndDownSelect(e) {
      if (this.showSearch) {
        if (e.keyCode == 40 || e.keyCode == 39) {
          console.log("down");
          //down
          this.activeIndex++;
          if (this.activeIndex > this.searchList.length - 1) {
            this.activeIndex = 0;
          }
        } else if (e.keyCode == 38 || e.keyCode == 37) {
          //up
          this.activeIndex--;
          if (this.activeIndex < 0) {
            this.activeIndex = this.searchList.length - 1;
          }
        }
      }
      if (this.activeIndex != -1) {
        this.selectedResult = this.searchList[this.activeIndex].email;
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
      // this.text = "";
      this.activeIndex = -1;
      this.isfocus = false;
    },
    //设置搜索框的偏移
    setSearchOffset() {
      var inputBounds = this.$refs.inputTag.getBoundingClientRect();
      this.searchStyle.top = inputBounds.height + inputBounds.top + "px";
      //this.offsetLeft = inputBounds.left + "px";
      this.searchStyle.left = 75 + 10 + "px";
      this.searchStyle.width = this.$refs.inputTagWrap.offsetWidth + "px";
    },
    //input内容变化触发事件
    inputChange(text) {
      this.setSearchOffset();
      var reg = new RegExp(text, "i");
      this.searchList = [];
      this.$http
        .get("views/data/email.json")
        .then(res => {
          res.data.data.filter(item => {
            if (item.email.match(reg) || item.name.match(reg)) {
              this.searchList.push(item);
              //添加关键词字段， 用来高亮显示
              this.searchList.forEach( item => {
                item.query = text;

                item.nameStr = item.name.replace(text, '<b>' + text + '</b>');
                item.emailStr = item.email.replace(text, '<b>' + text + '</b>');
              })
            }
          });
          
          if (this.searchList.length > 0) {
            this.showSearch = true;
            this.activeIndex = 0;
            this.selectedResult = this.searchList[this.activeIndex].email;
          } else {
            this.activeIndex = -1;
            this.showSearch = false;
            //this.addEmail(text);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //展示搜索结果
    showSearchResult() {},
    //邮箱格式验证
    isEmail(str) {
      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      return reg.test(str);
    }
  },
  watch: {
    text() {
      if (this.text !== "") {
        this.inputChange(this.text);
      } else {
        this.showSearch = false;
      }
    },
    source() {
      this.tagArray = [];
      this.initSource(this.source);
      if (this.source.length > 0) {
        this.placeholder = "";
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
      source: [],
      reciverData: [],
      copyData: [],
      secrityData: []
    };
  },
  methods: {
    addReciverData() {
      this.reciverData.push(
        { email: "xxxxx@qq.com" },
        { email: "1293004876@aa.com" }
      );
    },
    addCopyData() {},
    addSecrityData() {}
  }
});
