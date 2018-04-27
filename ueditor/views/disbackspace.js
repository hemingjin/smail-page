//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpace(e) {
  var ev = e || window.event; //获取event对象
  var obj = ev.target || ev.srcElement; //获取事件源
  var t = obj.type || obj.getAttribute("type"); //获取事件源类型
  var vReadOnly = obj.readOnly;
  var vDisabled = obj.disabled;
  vReadOnly = vReadOnly == undefined ? false : vReadOnly;
  vDisabled = vDisabled == undefined ? true : vDisabled;
  var flag1 =
    ev.keyCode == 8 &&
    (t == "password" || t == "text" || t == "textarea") &&
    (vReadOnly == true || vDisabled == true);
  var flag2 =
    ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
  if (flag2 || flag1) return false;
}
document.onkeypress = forbidBackSpace;
document.onkeydown = forbidBackSpace;
