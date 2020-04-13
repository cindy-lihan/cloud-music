{
  let view = {
    el:'#site-loading',
    show(){
      $(this.el).addClass("active")
    },
    hide(){
      $(this.el).removeClass("active")
    }
  }
  let controller = {
    init(view){
      this.view = view
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('beforeUpload',()=>{
        this.view.show()

      })
      window.eventHub.on('upload',()=>{
        this.view.hide()
      })
    }
  }
  controller.init(view)
}
