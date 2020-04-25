{
  let view = {
    el:'#recom-page',
    template: `
    <h2 class="remd-title">推荐歌单</h2>
    <div class="remd-pl-content">
      <ul class="pl-ul" id="playlist-content">
      </ul>
    </div>
    <h2 class="remd-title">最新歌曲</h2>
    <div class="remd-songs">
      <ul class="remdsg-ul" id="songs-content">
      </ul>
    </div>
    <footer class="index-ft">
      <div class="tf-wrapper">
        <div class="logo"></div>
        <div class="open-app">打开APP，发现更多好音乐 ></div>
      </div>
    </footer>
    `,
    render(data) {
      $(this.el).html(this.template);
      let { songs,playlists } = data;
      let playListLi = playlists.map(playlist => {
        let itemList = `
        <li class="pl-li" link="#" data-id=${playlist.id}>
        <div class="remd-img">
          <img class='pl-img' src=${playlist.cover} alt="封面">
          <div class='pl-listen'>
          <svg class="icon icon-listen" aria-hidden="true">
             <use xlink:href="#iconlisten"></use>
          </svg>
          <span>${playlist.times}</span>
        </div>
        </div>
        <p class="remd-txt">${playlist.title}</p>
      </li>
        `;
        return itemList;
      });
      let $el = $(this.el);
      $el.find("#playlist-content").empty();
      playListLi.map(domli => {
        $el.find("#playlist-content").append(domli);
      });

      let songsLiList = songs.map(song => {
        let itemList = `<li class="remdsg-li" data-id=${song.url}>
        <div class="sg-item">
          <div class="font-thide sg-title">${song.name}</div>
          <div class=" font-thide sg-info">
            <svg class="icon " aria-hidden="true">
              <use xlink:href="#iconsq"></use>
            </svg>
            ${song.singer}-${song.collection}
          </div>
        </div>
        <a href="./song.html?id=${song.id}" class="sg-play">
          <svg class="icon icon-play" aria-hidden="true">
            <use xlink:href="#iconplay"></use>
          </svg>
        </a>
      </li>`;
        return itemList;
      });

      $el.find("#psongs-content").empty();
      songsLiList.map(domli => {
        $el.find("#songs-content").append(domli);
      });

    },
    init(){
      this.$el = $(this.el)
    },
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }
  }
  let model = {
    data: {
      songs: [],
      playlists:[]
    },
    fetchRecdSgs: function() {
      var query = new AV.Query("Song");
      query.limit(12)
      return query.find().then(songs => {
        this.data.songs = songs.map(song => {
          return { id: song.id, ...song.attributes };
        });
        return songs;
      });
    },
    fetchRecdPls: function() {
      var query = new AV.Query("Rcmd_playlist");
      query.limit(6)
      return query.find().then(playlist => {
        console.log(playlist)
        this.data.playlists = playlist.map(play => {
          return { id: play.id, ...play.attributes };
        });
        return playlist;
      });
    },

  }
  let controller={
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.getRecdData()
      this.bindEventHub()
    },
    getRecdData(){
      return this.model.fetchRecdSgs().then(() => {
        this.model.fetchRecdPls().then(()=>{
          console.log('get model data:')
          console.log(this.model.data)
          this.view.render(this.model.data);
        })
       
      });
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'recom-page'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })

    }
  }
  controller.init(view, model)
}