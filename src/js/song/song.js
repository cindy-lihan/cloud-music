{
  let view ={
    el: '#app',
    init(){
      this.$el = $(this.el)
    },
  render(data) {
    let song = data.song
    let lyricTimes = this.setLyricView(song)


    this.$el.find('.song-bg').css('background-image',`url(${song.background}`)
    this.$el.find('img.cover').attr('src',song.cover)
    
    if(this.$el.find('audio.play-audio').attr('src') !== song.url){
      let audio = this.$el.find('audio#play-audio').attr('src',song.url).get(0)
      // 由于audio的事件不冒泡，所以需要元素创建后添加事件
      audio.addEventListener('ended',(e)=>{
        this.active('#play-btn')
        $(this.el).find('.song-img').removeClass('playing')
       })
       audio.addEventListener('timeupdate',()=>{
        this.showLyric(audio.currentTime,lyricTimes)
      })
    }
  },
  setLyricView(song){
    let {lyric} = song
    let lyricTime = []
    let songInfo = {}
    let array = lyric.split('\n').map((string)=>{
      let p = document.createElement('p')
      // [00:00:00]歌词xxxx 正则
      let lyticRegex = /\[([\d:.]+)\](.+)/
      // [ti:解脱]
      let infoRegex = /\[([a-zA-Z]+):(.+)\]/
      let lyricMatches = string.match(lyticRegex)
      let infoMatches = string.match(infoRegex)
      if(infoMatches){
          let key =infoMatches[1]
          let val = infoMatches[2]
          songInfo[key]= val
      }
      if(lyricMatches){
        p.textContent = lyricMatches[2]
        let time = lyricMatches[1]
        let parts = time.split(':')
        let minutes = parts[0]
        let seconds = parts[1]
        let newTime = parseInt(minutes,10)* 60 + parseFloat(seconds,10)
        lyricTime.push(newTime)
        this.$el.find('.lyric-line').append(p)
      } 
    })
    if(songInfo.ti && songInfo.ar){
    this.$el.find('.lyric-content>.song-name').text(songInfo.ti+'-'+songInfo.ar)
    }
    return lyricTime
  },
  showLyric(time,data){
    let lyricTime = data
    let allP = this.$el.find('.lyric-scroll>.lyric-line>p')
    for(let i = 0;i<lyricTime.length;i++){
      let currentTime = lyricTime[i]
      let nextTime =lyricTime[i+1]
      if(currentTime<=time && time<nextTime){
        let height = -32*i
        this.$el.find('.lyric-line').css('transform','translateY('+height+'px)');
        allP.eq(i).css('color','rgb(255,255,255)')
        break
      }
    }
  },
  play(){
    let audio = $(this.el).find('#play-audio')[0]
    audio.play()
  },
  pause(){
    let audio = $(this.el).find('#play-audio')[0]
    audio.pause()
  },
  active(selector){
    $(this.el).find(selector).addClass('active')
  },
  inactive(selector){
    $(this.el).find(selector).removeClass('active')
  }
  

  }
  let model = {
    data:{
      song:{
      id:'',
      name:'', 
      url:'', 
      background:'',
      cover:'',
      lyric:'',
      singer:''
      }
    },
    fetch(id){
      const query = new AV.Query('Song');
      return query.get(id).then((song) => {      
        this.data.song = { id: song.id, ...song.attributes}
        return { id: song.id, ...song.attributes};
      });
    },
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.id = this.getSongId()
      this.getSongInfo(this.id)
      this.bindEvents()
    },
    getSongInfo(id){
      return this.model.fetch(id)
      .then(()=>{
        this.view.render(this.model.data)
      }) 
    },
    getSongId(){
      let search = window.location.search
      // ?id=1&name=2
      if(search.indexOf('?') !== -1){
        search = search.substring(1)
      }
      // filter是剔除&&所产生的空内容
       let arr = search.split('&').filter((v=>v))
       let id = ''
       for(let i=0; i<arr.length; i++){
         let kv = arr[i].split('=')
         let key = kv[0]
         let val = kv[1]
         if(key === 'id'){
           id = val
           break
         }
       }
       return id
    },
    bindEvents(){
      $(this.view.el).on('click','#play-btn',(e)=>{
        this.view.play()
        this.view.inactive('#play-btn')
        $(this.view.el).find('.song-clickarea').css('z-index','10')
        $(this.view.el).find('.song-img').addClass('playing')
      })
      $(this.view.el).on('click','.song-clickarea',(e)=>{
        this.view.pause()
        this.view.active('#play-btn')
        $(this.view.el).find('.song-clickarea').css('z-index','5')
        $(this.view.el).find('.song-img').removeClass('playing')
      })




    }
  }

  controller.init(view, model)
}