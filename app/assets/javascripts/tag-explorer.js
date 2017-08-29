var taxonomy = "";

$(document).ready(function() {
  $.getJSON('/public/javascripts/edu.json', function(data) {
    taxonomy = data;
  });

  $(document).on('click', '.tag-explorer a', function(e){
    e.preventDefault()

    var $this = $(this)
    var id = $this.data('contentId')

    var $addTag = $this.parents('.add-tag')
    var $tagExplorer = $this.parents('.tag-explorer')
    var $column = $this.parents('.tag-explorer-column')
    var children = findObjectById(taxonomy, id).child_taxons;

    // remove old parent and active classes
    $column.find('.parent').removeClass('parent')
    $column.find('.active').removeClass('active')

    // highlight parent taxons
    $column.prevAll().find('.active').removeClass('active').addClass('parent')

    // make this one blue
    $this.addClass('active')

    // delete columns after this one
    $column.nextAll('.tag-explorer-column').remove()

    // add new column
    if (children.length > 0) {
      var list = buildList(children, this)

      $column.after(list)

      var $wrapper = $column.parent()
      $wrapper.width($wrapper.find('.tag-explorer-column').length * $wrapper.find('.tag-explorer-column').width())
      $tagExplorer.scrollLeft($wrapper.width())
    } else {
      // no children
    }

    var $tagActions = $addTag.find('.tag-actions')
    var tagPath = [];
    $tagExplorer.find('.parent').each(function() { tagPath.push($(this).text()) })
    tagPath.push($tagExplorer.find('.active').text());
    $tagActions.find('.tag-path').text(tagPath.join(" > "))

  })

  function findObjectById(obj, id) {
    if(obj.content_id === id) { return obj; }
    for(var i=0; i<obj.child_taxons.length; i++) {
      var foundId = findObjectById(obj.child_taxons[i], id)
      if(foundId) { return foundId }
    }
    return null
  }

  function buildList(taxons, trigger) {
    var $trigger = $(trigger)
    var id = $trigger.data('contentId')

    var list = '<div class="tag-explorer-column" id="tag-exlorer-'+id+'">'
    list += '<div class="list-group">'
    for (var i in taxons) {
      var taxon = taxons[i]
      list += '<a class="list-group-item" '
      list += 'href="https://www.gov.uk/'+taxon.base_path+'" '
      list += 'data-content-id="'+taxon.content_id+'">'
      list += '<span class="name">'+taxon.name+'</span>'
      if (taxon.child_taxons.length > 0) list += ' <span class="glyphicon glyphicon-chevron-right pull-right"></span>'
      list += '</a>'
    }
    list += '</div></div>'

    return list
  }
})
