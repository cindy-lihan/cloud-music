{
  let view = {
    el: "#upload-song-container",
    find: function(selector) {
      return $(this.el).find(selector)[0];
    }
  };
  let model = {};
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.initQiniu();
    },
    initQiniu() {
      //引入Plupload 、qiniu.js后
      var uploader = Qiniu.uploader({
        runtimes: "html5,flash,html4", //上传模式,依次退化
        browse_button: this.view.find('#upload-button'), //上传选择的点选按钮，**必需**
        uptoken_url: "http://localhost:19110/uptoken", //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        domain: "q7soun4xa.bkt.clouddn.com", //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
        unique_names: false,
        container: this.view.find('#upload-container'), //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: "20mb", //最大文件体积限制
        dragdrop: true, //开启可拖曳上传
        drop_element:  this.view.find('#upload-area'), //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: "4mb", //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          BeforeUpload: function(up, file) {
            // 每个文件上传前,处理相关的事情
          },
          UploadProgress: function(up, file) {
            // 每个文件上传时,处理相关的事情
          },
          FileUploaded: function(up, file, info) {
            var domain = up.getOption("domain");
            var res = JSON.parse(info.response);
            var sourceLink = "http://" + domain + "/" + encodeURIComponent(res.key);
            window.eventHub.emit('upload',{
              url: sourceLink,
              key: res.key
            })
          },
          Error: function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          UploadComplete: function() {
            //队列文件处理完毕后,处理相关的事情
          },
          Key: function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            var key = file.name;
            // do something with key here
            return key;
          }
        }
      });
    }
  };
  controller.init(view, model);
}
