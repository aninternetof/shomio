Vue.component('entry-card', {
  props: ['entry', 'admin'],
  template:`
    <div class="col-md-6">
      <div class="card">
        <img class="card-img-top" style="width:100%" :src="entry.image">
        <div class="card-block">
          <h4 class="card-title">{{ entry.title }}</h4>
          <a :id=entry.title v-if="admin" onclick="editEntry(event)" class="card-text" href="#">edit</a>
          <p class="card-text">{{ entry.description }}</p>
          <a :href="entry.link" class="btn btn-secondary">more info</a>
        </div>
        <div class="card-block">
          <span class="tag-list text-muted" v-for="tag in entry.tags">{{ tag }}</span>
        </div>
      </div>
    </div>
    `
});

var content = new Vue({
  el: '#content',
  data: {
    entries: contentJson,
    admin: false,
  },
});

Vue.component('entry-tag', {
  props: ['tag'],
  template:`
    <a href="#" onclick="handleTagClick(event)" class="tag-button btn btn-outline-primary">{{ tag }}</a>
  `
});

var tags = new Vue({
  el: '#tags',
  data: {
    tags: []
  },
});

var adminBar = new Vue({
  el: '#admin-bar',
  data : {
    admin: false
  }
});

function setAdmin(state) {
  adminBar.admin = state;
  content.admin = state;
}

getTags();
currentTagFilters = [];

function clearAllFilters() {
  currentTagFilters = [];
  $(".tag-button").removeClass("active");
  content.entries = contentJson;
}

function filter() {
  console.log(currentTagFilters);
  if (currentTagFilters.length === 0) {
    content.entries = contentJson;
  } else {
    var entries = [];
    for (var i=0; i<contentJson.length; i++) {
      if (hasAll(contentJson[i].tags, currentTagFilters)) {
        entries.push(contentJson[i]);
      }
    }
    content.entries = entries;
  }
}

/**
 * @description determine if an array contains all items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains all items from arr.
 */
var hasAll = function (haystack, arr) {
  return arr.every(function (v) {
    return haystack.indexOf(v) >= 0;
  });
};

function removeEntry(title) {
  var toRemove = [];
  for (var i=0; i<content.entries.length; i++) {
    if (content.entries[i].title == title) {
      toRemove.push(i);
    }
  }
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

function handleTagClick(event) {
  event.preventDefault();
  tag = $(event.target).text();
  ind = currentTagFilters.indexOf(tag);
  if (ind < 0) {
    currentTagFilters.push(tag);
  } else {
    currentTagFilters.splice(ind, 1);
  }
  $(event.target).toggleClass("active");
  filter();
}

function editEntry(event) {
  event.preventDefault();
  entry = getEntry(event.target.id);
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

function getTags() {
  entryTags = [];
  for (var i=0; i<content.entries.length; i++) {
    for (var j=0; j<content.entries[i].tags.length; j++) {
      if (entryTags.indexOf(content.entries[i].tags[j]) < 0) {
        entryTags.push(content.entries[i].tags[j]);
      }
    }
  }
  tags.tags = entryTags;
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
  removeEntry(entry.title);
  content.entries.push(entry);
  getTags();
  $('#editModal').modal('hide');
});
