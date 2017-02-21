Vue.component('entry-card', {
  props: ['entry'],
  template:`
    <div class="col-md-6">
      <div class="card">
        <img class="card-img-top" style="width:100%" :src="entry.image">
        <div class="card-block">
          <h4 class="card-title">{{ entry.title }}</h4>
          <a :id=entry.title onclick="editEntry(event)" class="card-text" href="#">edit</a>
          <p class="card-text">{{ entry.description }}</p>
          <a :href="entry.link" class="btn btn-outline-primary">more info</a>
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
  },
});

function removeEntry(title) {
  var toRemove = [];
  for (var i=0; i<content.entries.length; i++) {
    if (content.entries[i].title == title) {
      toRemove.push(i);
    }
  }
  console.log(toRemove);
  for (var j=0; j<toRemove.length; j++) {
    content.entries.splice(toRemove[j]-j,1);
  }
}

function getEntry(title) {
  for (var i=0; i<content.entries.length; i++) {
    if (content.entries[i].title == title) {
      return content.entries[i];
    }
  }
}

function editEntry(event) {
  event.preventDefault();
  console.log(event.target.id);
  entry = getEntry(event.target.id);
  console.log(entry);
  $('#titleInput').val(entry.title);
  $('#imageInput').val(entry.image);
  $('#descriptionInput').val(entry.description);
  $('#linkInput').val(entry.link);
  $('#tagsInput').val(entry.tags.join());
  $('#editModal').modal('show');
}

function exportContent() {
  json = JSON.stringify(content.entries);
  json = "var contentJson = " + json;
    var blob = new Blob([json], {type: "application/js"});
  var url  = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.download = "content.js";
  a.href = url;
  a.click();
}

$('#editForm').submit(function(e) {
    e.preventDefault();
    entry = {};
    entry.title = $('#titleInput').val();
    entry.image = $('#imageInput').val();
    entry.description = $('#descriptionInput').val();
    entry.link = $('#linkInput').val();
    entry.tags = $('#tagsInput').val().split(',');
    /* get rid of any others with the same name */
    removeEntry(entry.title)
    content.entries.push(entry);
    $('#editModal').modal('hide');
});
