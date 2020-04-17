{
  let view = {
    el: "#song-info-container",
    init() {
      this.$el = $(this.el);
    },
    template: `   
    <div class="song-info-area ">
    <form class="song-info-form" id='song-info'>
        <div class="row song-id">
        <input type="text" name="id" value="__id__">
       </div>
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
        <input type="text" name="collection" value="__collection__">
        </div>
        <div class="row">
        <label for="collection">外链</label>
        <input type="text" name="url" placeholder="请上传文件" readonly="readonly" value="__url__">
        </div>
        <div>
        <button class='btn-save' type="submit" id>保存</button>
    </form>
</div>
    `,
    // 新增修改时的渲染
    render(data) {
      //只能改变部分，上传区不能改因为七牛加了一些代码
      let songInfoHtml = this.template;
      let placeholders = ["id", "name", "singer", "url", "collection"];
      if (data && data["key"]) {
        data["singer"] = data["key"].split("-")[0].trim();
        data["name"] = data["key"]
          .split("-")[1]
          .split(".")[0]
          .trim();
      }
      placeholders.map(string => {
        songInfoHtml = songInfoHtml.replace(
          `__${string}__`,
          data[string] || ""
        );
      });
      $(this.el).html(songInfoHtml);
      // 修改
      if (data.id && data.id.length !== 0) {
        $(".upload-pop-hd")
          .find("h3")
          .text("修改歌曲");
      }
    },
    active(selector) {
      $(selector).addClass("active");
    },
    deactive(selector) {
      $(selector).removeClass("active");
    }
  };
  let model = {
    data: {
      name: "",
      singer: "",
      url: "",
      collection: "",
      id: ""
    },
    create(data) {
      var Song = AV.Object.extend("Song");
      var song = new Song();
      song.set("name", data.name);
      song.set("collection", data.collection);
      song.set("singer", data.singer);
      song.set("url", data.url);
      return song.save().then(
        newSong => {
          let data = { name: "", singer: "", url: "", collection: "", id: "" };
          let { id, attributes } = newSong;
          Object.assign(data, {
            id,
            ...attributes
          });
          alert("保存成功");
          return data;
        },
        () => {
          alert("保存失败");
        }
      );
    },
    // 修改保存
    edit(data) {
      var song = AV.Object.createWithoutData("Song", data.id);
      song.set("name", data.name);
      song.set("collection", data.collection);
      song.set("url", data.url);
      song.set("singer", data.singer);
      return song.save().then(
        (newSong) => {
          let data = { name: "", singer: "", url: "", collection: "", id: "" };
          let { id, attributes } = newSong;
          Object.assign(data, {
            id,
            ...attributes
          });
          alert("保存成功");
          console.log(data);
          return data;
        },
        () => {
          alert("保存失败");
        }
      );
    },
    reset(){
      this.data ={name: "",
      singer: "",
      url: "",
      collection: "",
      id: ""
    }
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.form = $(this.view.el).find("#song-info");
      this.view.render(this.model.data);
      this.bindEvents();
      this.bindEventHub();
    },
    bindEventHub() {
      window.eventHub.on("upload", data => {
        if (data && data["key"]) {
          data["singer"] = data["key"].split("-")[0].trim();
          data["name"] = data["key"]
            .split("-")[1]
            .split(".")[0]
            .trim();
        }
        Object.assign(this.model.data,data)
        this.view.render(this.model.data);
      });
      window.eventHub.on("edit", data => {
        this.model.data = data
        this.view.render(this.model.data)
        this.view.active("#upload-pop-mask");
        this.view.active(".upload-pop-wrapper");
      });
      window.eventHub.on("add", data => {
        this.view.render(this.model.data);
        this.view.active("#upload-pop-mask");
        this.view.active(".upload-pop-wrapper");
      });
    },
    reset(data) {
      this.view.render(data);
    },

    bindEvents: function() {
      //事件委托,页面之前未渲染,直接找form找不到
      this.view.$el.on("submit", "form", e => {
        e.preventDefault();
        let needs = ["id", "name", "collection", "singer", "url"];
        let data = {};
        needs.map(str => {
          data[str] = this.view.$el.find(`input[name="${str}"]`).val();
        });
        //修改
        if (data.id && data.id.length !== 0) {
          this.model.edit(data).then((data) => {
            let str = JSON.stringify(data);
            let object = JSON.parse(str);
            window.eventHub.emit("edit", object);
            this.view.deactive("#upload-pop-mask");
            this.view.deactive("#upload-pop");
            this.model.reset()
          });
        } else {
          //新增
          this.model.create(data).then(song => {
            let str = JSON.stringify(song);
            let object = JSON.parse(str);
            window.eventHub.emit("create", object);
            this.view.deactive("#upload-pop-mask");
            this.view.deactive("#upload-pop");
            this.model.reset()
          });
        }
      });
      $('#upload-pop').on("click", "#addSongClose", e => {
        this.model.reset()
        this.view.deactive("#upload-pop-mask");
        this.view.deactive("#upload-pop");
      });
    }
  };

  controller.init(view, model);
}
