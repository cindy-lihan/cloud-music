{
  let view = {
    el: "#songsContainer",
    template: `
    <div class="tabs">
    <div class="search">
        <input type="text" id="keywords" placeholder="搜索歌名" /><span id="js_search"
            class="btn-search">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconsearch-32"></use>
            </svg>
        </span>
    </div>
    <div class="upload">
        <input class='btn-upload' type="button" id="addSong" value="新增歌曲">
    </div>
     </div>
     <div class="flex-list">
        <div class="flex-list-header">
        <div class="flex-row">
            <div class="flex-cell">歌名</div>
            <div class="flex-cell">歌手</div>
            <div class="flex-cell">专辑</div>
            <div class="flex-cell">链接</div>
            <div class="flex-cell">操作</div>
        </div>
    </div>
    <div id='flex-items'>
    </div>
    </div>
    </div>
    `,
    render(data) {
      $(this.el).html(this.template);
      let { songs } = data;
      let divList = songs.map(song => {
        let itemList = `<div class="flex-list-item">
            <div class="flex-row content">
                <div class="flex-cell name" title=${song.name}>${song.name}</div>
                <div class="flex-cell singer" title=${song.singer}>${song.singer}</div>
                <div class="flex-cell collection" title=${song.collection}>${song.collection}</div>
                <div class="flex-cell url" title=${song.url}>${song.url}</div>
                <div class="flex-cell operating">
                    <a  data-song-id=${song.id} href="javascript:void(0);" class="cell-edit" id="editSong">修改</a>
                    <a href="javascript:void(0);" class="cell-delete">删除</a>
                </div>
            </div>`;
        return itemList;
      });
      let $el = $(this.el);
      $el.find("#flex-items").empty();
      divList.map(domDiv => {
        $el.find("#flex-items").append(domDiv);
      });
    }
  };
  let model = {
    data: {
      songs: []
    },
    fetch: function() {
      var query = new AV.Query("Song");
      return query.find().then(songs => {
        this.data.songs = songs.map(song => {
          return { id: song.id, ...song.attributes };
        });
        return songs;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.getAllSongs();
      this.bindEventHub();
      this.bindEvents();
    },
    getAllSongs: function() {
      return this.model.fetch().then(() => {
        this.view.render(this.model.data);
      });
    },
    bindEvents: function() {
      $(this.view.el).on("click", "#addSong", e => {
        window.eventHub.emit('add')
      });
      $(this.view.el).on("click", "#editSong", e => {
        let songId = e.currentTarget.getAttribute("data-song-id");
        let songs = this.model.data.songs
        let data
        for(let i = 0; i<songs.length;i++){
            if(songs[i].id === songId){
                data = songs[i]
                break  
            }
        }
        window.eventHub.emit("edit", JSON.parse(JSON.stringify(data)));
      });
    },
    bindEventHub: function() {
      window.eventHub.on("create", data => {
        this.model.data.songs.push(data);
        this.view.render(this.model.data);
      });
      window.eventHub.on("edit", data => {
        let songId = data.id
        let songs = this.model.data.songs
        for(let i = 0; i<songs.length;i++){
            if(songs[i].id === songId){
                songs[i] = data
                break  
            }
        }
        //部分更新
        this.view.render(this.model.data);
      });
    }
  };
  controller.init(view, model);
}
