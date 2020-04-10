{
  let view = {
    el: "#addSongContainer",
    init() {
      this.$el = $(this.el);
    },
    template: `   
        <div id="upload-pop-mask"></div>
        <div id="upload-pop" class="upload-pop-wrapper">
            <div class="upload-pop-hd">
                <h3>新增歌曲</h3>
                <span class="pop-close" id="addSongClose">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconclose"></use>
                    </svg>
                </span>
            </div>
        <div class="add-song-container">
        <div id='upload-song-container'>
            <div id="upload-area">
                <p><input class='btn-choose' type="button" id="upload-button" value="选择文件"><span>或者拖拽文件上传</span>
                </p>
                <p>文件大小不能超过40MB</p>
            </div>
        </div>
        <div id='song-info-container'>
        <div class="song-info-area ">
        <form class="song-info-form" id='song-info'>
            <div class="row">
            <label for="songName">歌名</label>
            <input type="text" name="name" value="__name__">
            </div>
            <div class="row">
            <label for="singer">歌手</label>
            <input type="text" name="singer" value="__singer__">
            </div>
            <div class="row">
            <label for="collection">专辑</label>
            <input type="text" name="collection">
            </div>
            <div class="row">
            <label for="collection">外链</label>
            <input type="text" name="url" placeholder="请上传文件" readonly="readonly" value="__link__">
            </div>
            <div>
            <button class='btn-save' type="submit" id>保存</button>
        </form>
    </div>
    </div>
    </div>
    `,
    render(data = {}) {
      let placeholders = ["name","singer", "link"];
      let html = this.template;
      if(data && data['key']){
        data['singer'] =data['key'].split('-')[0].trim()
        data['name'] = data['key'].split('-')[1].split('.')[0].trim()
      }
      
      placeholders.map(string => {
        html = html.replace(`__${string}__`, data[string] || "");
      });
     
      let maskShow = $(this.el).find("#upload-pop-mask").hasClass('active')

      let popShow = $(this.el).find("#upload-pop").hasClass('active')
      $(this.el).html(html);
     
      if(maskShow){
        $(this.el).find("#upload-pop-mask").addClass('active')
      }

      if(popShow){
        $(this.el).find("#upload-pop").addClass('active')
      }
     

    }
  };
  let model = {
      data:{
          name: '', singer: '', url: '', collection: '', id: ''
      },
      create(data){
        var Song = AV.Object.extend("Song");
        var song = new Song();
        song.set("name", data.name);
        song.set("collection", data.collection);
        song.set("singer", data.singer);
        song.set("url", data.url);
        return song.save().then(
            (newSong) => {
              let {id, attributes} = newSong
              Object.assign(this.data,{
                  id,...attributes
              })
              alert("保存成功");
            },
            () => {
              alert("保存失败");
            }
          );

      }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.form = $(this.view.el).find("#song-info");
      this.view.render(this.model.data);
      window.eventHub.on("upload", data => {
        this.reset(data);
      });
      this.bindEvents();
    },
    reset(data) {
      this.view.render(data);
    },

    bindEvents: function() {
      //事件委托,页面之前未渲染,直接找form找不到
      this.view.$el.on("submit", "form", e => {
        e.preventDefault();
        let needs = ['id','name', 'collection', 'singer','url']
        let data = {}
        needs.map((str)=>{
            data[str] = this.view.$el.find(`input[name="${str}"]`).val()
        })
        this.model.create(data)
        .then(()=>{
            this.view.$el.find("#upload-pop-mask").removeClass('active');
            this.view.$el.find("#upload-pop").removeClass('active');
            let str = JSON.stringify(this.model.data)
            let object = JSON.parse(str)
            window.eventHub.emit('create', object)

        });
      });
      this.view.$el.on("click",'#addSongClose',e => {
        this.view.$el.find("#upload-pop-mask").removeClass('active');
        this.view.$el.find("#upload-pop").removeClass('active');
      });
    }
  };

  controller.init(view, model);
}
