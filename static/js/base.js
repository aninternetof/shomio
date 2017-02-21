function exportContent() {
  console.log("Exporting");
  json = JSON.stringify(content.entries);
  json = "var contentJson = " + json;
  console.log(json);
  var blob = new Blob([json], {type: "application/js"});
  var url  = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.download = "content.js";
  a.href = url;
  a.click();
}

Vue.component('entry-card', {
  props: ['entry'],
  template:`
    <div class="col-md-6">
      <div class="card">
        <img class="card-img-top" style="width:100%" :src="entry.image">
        <div class="card-block">
          <h4 class="card-title">{{ entry.title }}</h4>
          <p class="card-text">{{ entry.description }}</p>
          <a href="#" class="btn btn-outline-primary">more info</a>
          <div><button type="button" class="btn btn-secondary btn-sm" v-for="tag in entry.tags">{{ tag }}</button></div>
        </div>
      </div>
    </div>
    `
});

var content = new Vue({
  el: '#content',
  data: {
    entries: contentJson
  }
});

$('#editForm').submit(function(e) {
    e.preventDefault();
    entry = {};
    entry.title = $('#titleInput').val();
    entry.image = $('#imageInput').val();
    entry.description = $('#descriptionInput').val();
    entry.tags = $('#tagsInput').val().split(',');

    content.entries.push(entry);

});
