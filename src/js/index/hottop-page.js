{
  let view = {
    el:'#hottop-page',
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

  }
  let controller={
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'hottop-page'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })

    }
  }
  controller.init(view, model)
}