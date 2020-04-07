{
  let view = {
    el: "#songlist-container",
    template: `
        <div class="flex-list-header">
        <div class="flex-row">
            <div class="flex-cell">歌名</div>
            <div class="flex-cell">歌手</div>
            <div class="flex-cell">专辑</div>
            <div class="flex-cell">链接</div>
            <div class="flex-cell">操作</div>
        </div>
    </div>
    <div class="flex-list-item first">
        <div class="flex-row content">
            <div class="flex-cell first name">歌名xxx</div>
            <div class="flex-cell singer">歌手xxx</div>
            <div class="flex-cell collection">专辑xxx</div>
            <div class="flex-cell url">外链x</div>
            <div class="flex-cell operating">
                <a href="javascript:void(0);" class="cell-edit">修改</a>
                <a href="javascript:void(0);" class="cell-delete">删除</a>
            </div>
        </div>
    </div>
    <div class="flex-list-item">
        <div class="flex-row content">
            <div class="flex-cell name">歌名yyy</div>
            <div class="flex-cell singer">歌手yyy</div>
            <div class="flex-cell collection">专辑yyy</div>
            <div class="flex-cell url">外链y</div>
            <div class="flex-cell operating">
                <a href="javascript:void(0);" class="cell-edit">修改</a>
                <a href="javascript:void(0);" class="cell-delete">删除</a>
            </div>
        </div>
    </div>
    `,
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {};
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
    }
  }
  controller.init(view, model)
}
